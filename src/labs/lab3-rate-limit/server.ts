export type RateLimitStrategy = 'client-side' | 'session-based' | 'per-account' | 'layered';

export interface AttemptResult {
  allowed: boolean;
  reason: string;
  attemptsLeft: number;
  delay?: number;
}

export class RateLimitServer {
  private strategy: RateLimitStrategy;
  private maxAttempts = 5;

  // Client-side: counter stored "on the client" (simulated)
  private clientCounter = 0;

  // Session-based: counter per session ID
  private sessionCounters: Map<string, number> = new Map();

  // Per-account: counter per username
  private accountCounters: Map<string, number> = new Map();
  private lockedAccounts: Set<string> = new Set();

  // Layered: combines account + IP + global
  private layeredAccountCounters: Map<string, number> = new Map();
  private layeredIpCounters: Map<string, number> = new Map();

  constructor(strategy: RateLimitStrategy) {
    this.strategy = strategy;
  }

  attempt(username: string, sessionId: string, ip: string): AttemptResult {
    if (this.strategy === 'client-side') {
      return this.clientSideAttempt();
    } else if (this.strategy === 'session-based') {
      return this.sessionBasedAttempt(sessionId);
    } else if (this.strategy === 'per-account') {
      return this.perAccountAttempt(username);
    } else {
      return this.layeredAttempt(username, ip);
    }
  }

  private clientSideAttempt(): AttemptResult {
    // Client-side counter: always increments, but any "new session" resets it
    this.clientCounter += 1;
    const attemptsLeft = Math.max(0, this.maxAttempts - this.clientCounter);

    if (this.clientCounter > this.maxAttempts) {
      return {
        allowed: false,
        reason: 'Client-side counter exceeded (but attacker can reset by clearing cookies)',
        attemptsLeft: 0,
      };
    }

    return {
      allowed: true,
      reason: `Client-side counter: ${this.clientCounter}/${this.maxAttempts}`,
      attemptsLeft,
    };
  }

  private sessionBasedAttempt(sessionId: string): AttemptResult {
    const current = this.sessionCounters.get(sessionId) ?? 0;
    const newCount = current + 1;
    this.sessionCounters.set(sessionId, newCount);

    const attemptsLeft = Math.max(0, this.maxAttempts - newCount);

    if (newCount > this.maxAttempts) {
      return {
        allowed: false,
        reason: `Session "${sessionId}" exceeded ${this.maxAttempts} attempts (attacker can start a new session)`,
        attemptsLeft: 0,
      };
    }

    return {
      allowed: true,
      reason: `Session "${sessionId}": attempt ${newCount}/${this.maxAttempts}`,
      attemptsLeft,
    };
  }

  private perAccountAttempt(username: string): AttemptResult {
    if (this.lockedAccounts.has(username)) {
      return {
        allowed: false,
        reason: `Account "${username}" is locked. Legitimate user is also locked out (denial of service).`,
        attemptsLeft: 0,
      };
    }

    const current = this.accountCounters.get(username) ?? 0;
    const newCount = current + 1;
    this.accountCounters.set(username, newCount);

    const attemptsLeft = Math.max(0, this.maxAttempts - newCount);

    if (newCount >= this.maxAttempts) {
      this.lockedAccounts.add(username);
      return {
        allowed: false,
        reason: `Account "${username}" locked after ${this.maxAttempts} failures. This also locks out the legitimate user.`,
        attemptsLeft: 0,
      };
    }

    return {
      allowed: true,
      reason: `Account "${username}": attempt ${newCount}/${this.maxAttempts}`,
      attemptsLeft,
    };
  }

  private layeredAttempt(username: string, ip: string): AttemptResult {
    const accountCount = (this.layeredAccountCounters.get(username) ?? 0) + 1;
    this.layeredAccountCounters.set(username, accountCount);

    const ipCount = (this.layeredIpCounters.get(ip) ?? 0) + 1;
    this.layeredIpCounters.set(ip, ipCount);

    // Layer 1: per-account soft limit — add delay after 5 attempts
    if (accountCount > this.maxAttempts) {
      const delay = Math.min((accountCount - this.maxAttempts) * 2, 30);
      return {
        allowed: true,
        reason: `Account "${username}": attempt ${accountCount} — adding ${delay}s delay (account never fully locked)`,
        attemptsLeft: -1,
        delay,
      };
    }

    // Layer 2: per-IP limit — require challenge after 10 attempts
    if (ipCount > 10) {
      return {
        allowed: true,
        reason: `IP "${ip}": ${ipCount} attempts — CAPTCHA challenge required (account still accessible)`,
        attemptsLeft: Math.max(0, this.maxAttempts - accountCount),
        delay: 1,
      };
    }

    const attemptsLeft = Math.max(0, this.maxAttempts - accountCount);
    return {
      allowed: true,
      reason: `Account "${username}": attempt ${accountCount}/${this.maxAttempts}, IP "${ip}": ${ipCount}/10`,
      attemptsLeft,
    };
  }

  resetClientCounter(): void {
    this.clientCounter = 0;
  }

  reset(): void {
    this.clientCounter = 0;
    this.sessionCounters.clear();
    this.accountCounters.clear();
    this.lockedAccounts.clear();
    this.layeredAccountCounters.clear();
    this.layeredIpCounters.clear();
  }
}
