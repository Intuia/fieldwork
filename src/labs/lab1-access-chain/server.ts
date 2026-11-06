export interface ChainState {
  claim: boolean;
  verify: boolean;
  bind: boolean;
  monitor: boolean;
}

export interface ChainOutcome {
  authenticated: boolean;
  sessionValid: boolean;
  authorized: boolean;
  overallSecure: boolean;
  failureDescription: string;
}

export function evaluateChain(state: ChainState): ChainOutcome {
  // Each link depends on all previous links being intact.
  // If an earlier link fails, everything downstream is compromised.

  if (!state.claim) {
    return {
      authenticated: false,
      sessionValid: false,
      authorized: false,
      overallSecure: false,
      failureDescription:
        'Identity not established. Without a valid claim, the system cannot know who is acting. An attacker can present any identity or none at all — every downstream check is meaningless.',
    };
  }

  if (!state.verify) {
    return {
      authenticated: false,
      sessionValid: false,
      authorized: false,
      overallSecure: false,
      failureDescription:
        'Evidence not checked. The identity claim was accepted without proof. An attacker can assert any username and gain access — the session and authorization inherit a forged identity.',
    };
  }

  if (!state.bind) {
    return {
      authenticated: true,
      sessionValid: false,
      authorized: false,
      overallSecure: false,
      failureDescription:
        'Session not preserved. Authentication succeeded but continuity was lost. An attacker can hijack or forge the session binding, acting as the authenticated user on subsequent requests.',
    };
  }

  if (!state.monitor) {
    return {
      authenticated: true,
      sessionValid: true,
      authorized: false,
      overallSecure: false,
      failureDescription:
        'Actions not governed. The user is authenticated and the session is valid, but no access control enforces what they may do. An attacker with any valid session can access resources beyond their intended scope.',
    };
  }

  return {
    authenticated: true,
    sessionValid: true,
    authorized: true,
    overallSecure: true,
    failureDescription: '',
  };
}
