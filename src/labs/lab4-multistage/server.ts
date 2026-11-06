export type StateStorageMode = 'client-side' | 'server-side';

export interface ClientState {
  completedStages: number[];
  username: string;
}

export interface StageResult {
  success: boolean;
  nextStage: number | null;
  authenticated: boolean;
  error?: string;
  invariantViolation?: string;
}

const VALID_PASSWORD = 's3cure!';
const VALID_CHALLENGE_ANSWER = '42';

export class MultistageServer {
  private mode: StateStorageMode;

  // Server-side state tracking
  private serverCompletedStages: number[] = [];
  private serverBoundUsername: string | null = null;
  private serverAuthenticated = false;

  constructor(mode: StateStorageMode) {
    this.mode = mode;
  }

  submitStage(
    stageNumber: number,
    data: { username?: string; password?: string; answer?: string },
    clientState?: ClientState,
  ): StageResult {
    if (this.mode === 'client-side') {
      return this.clientSideSubmit(stageNumber, data, clientState);
    } else {
      return this.serverSideSubmit(stageNumber, data);
    }
  }

  private clientSideSubmit(
    stageNumber: number,
    data: { username?: string; password?: string; answer?: string },
    clientState?: ClientState,
  ): StageResult {
    // Client-side mode: trust whatever the client says about completed stages.
    // The server only checks the current stage's data correctness.
    const completedStages = clientState?.completedStages ?? [];

    if (stageNumber === 1) {
      // Stage 1: accept any username
      if (!data.username) {
        return { success: false, nextStage: 1, authenticated: false, error: 'Username required' };
      }
      return { success: true, nextStage: 2, authenticated: false };
    }

    if (stageNumber === 2) {
      // Stage 2: check password, but don't verify stage 1 was done properly
      if (!data.password) {
        return { success: false, nextStage: 2, authenticated: false, error: 'Password required' };
      }
      if (data.password !== VALID_PASSWORD) {
        return { success: false, nextStage: 2, authenticated: false, error: 'Incorrect password' };
      }
      return { success: true, nextStage: 3, authenticated: false };
    }

    if (stageNumber === 3) {
      // Stage 3: check challenge answer. Trust clientState that stages 1+2 are done.
      if (!data.answer) {
        return { success: false, nextStage: 3, authenticated: false, error: 'Challenge answer required' };
      }
      if (data.answer !== VALID_CHALLENGE_ANSWER) {
        return { success: false, nextStage: 3, authenticated: false, error: 'Incorrect challenge answer' };
      }
      // The server trusts the client's claim that prior stages completed
      if (completedStages.includes(1) && completedStages.includes(2)) {
        return { success: true, nextStage: null, authenticated: true };
      }
      // Even without proper prior stages, client-side mode blindly trusts
      return { success: true, nextStage: null, authenticated: true };
    }

    return { success: false, nextStage: 1, authenticated: false, error: 'Invalid stage number' };
  }

  private serverSideSubmit(
    stageNumber: number,
    data: { username?: string; password?: string; answer?: string },
  ): StageResult {
    // Server-side mode: strict invariant checking

    if (this.serverAuthenticated) {
      return {
        success: false,
        nextStage: null,
        authenticated: true,
        error: 'Already authenticated',
        invariantViolation: 'REPLAY_PREVENTION',
      };
    }

    // Check monotonic sequence: the stage number must be exactly one more than completed stages
    const expectedStage = this.serverCompletedStages.length + 1;

    if (stageNumber < expectedStage) {
      return {
        success: false,
        nextStage: expectedStage,
        authenticated: false,
        error: `Stage ${stageNumber} already completed. Cannot repeat.`,
        invariantViolation: 'REPLAY_PREVENTION',
      };
    }

    if (stageNumber > expectedStage) {
      return {
        success: false,
        nextStage: expectedStage,
        authenticated: false,
        error: `Stage ${stageNumber} cannot be reached. Complete stage ${expectedStage} first.`,
        invariantViolation: 'SEQUENCE_MONOTONIC',
      };
    }

    // Stage-specific logic
    if (stageNumber === 1) {
      if (!data.username) {
        return { success: false, nextStage: 1, authenticated: false, error: 'Username required' };
      }
      // Bind account to this attempt
      this.serverBoundUsername = data.username;
      this.serverCompletedStages.push(1);
      return { success: true, nextStage: 2, authenticated: false };
    }

    if (stageNumber === 2) {
      // Check account binding: must match the username from stage 1
      if (data.username && data.username !== this.serverBoundUsername) {
        return {
          success: false,
          nextStage: 2,
          authenticated: false,
          error: `Username "${data.username}" does not match bound account "${this.serverBoundUsername}".`,
          invariantViolation: 'ACCOUNT_BINDING',
        };
      }
      if (!data.password) {
        return { success: false, nextStage: 2, authenticated: false, error: 'Password required' };
      }
      if (data.password !== VALID_PASSWORD) {
        // On failure, clear all state
        this.reset();
        return { success: false, nextStage: 1, authenticated: false, error: 'Incorrect password. Attempt invalidated.' };
      }
      this.serverCompletedStages.push(2);
      return { success: true, nextStage: 3, authenticated: false };
    }

    if (stageNumber === 3) {
      if (data.username && data.username !== this.serverBoundUsername) {
        return {
          success: false,
          nextStage: 3,
          authenticated: false,
          error: `Username "${data.username}" does not match bound account "${this.serverBoundUsername}".`,
          invariantViolation: 'ACCOUNT_BINDING',
        };
      }
      if (!data.answer) {
        return { success: false, nextStage: 3, authenticated: false, error: 'Challenge answer required' };
      }
      if (data.answer !== VALID_CHALLENGE_ANSWER) {
        this.reset();
        return { success: false, nextStage: 1, authenticated: false, error: 'Incorrect challenge answer. Attempt invalidated.' };
      }
      this.serverCompletedStages.push(3);
      this.serverAuthenticated = true;
      return { success: true, nextStage: null, authenticated: true };
    }

    return { success: false, nextStage: 1, authenticated: false, error: 'Invalid stage number' };
  }

  getServerState(): { completedStages: number[]; boundUsername: string | null; authenticated: boolean } {
    return {
      completedStages: [...this.serverCompletedStages],
      boundUsername: this.serverBoundUsername,
      authenticated: this.serverAuthenticated,
    };
  }

  reset(): void {
    this.serverCompletedStages = [];
    this.serverBoundUsername = null;
    this.serverAuthenticated = false;
  }
}
