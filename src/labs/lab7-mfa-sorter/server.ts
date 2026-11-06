export interface AuthenticatorItem {
  id: string;
  name: string;
  correctCategory: 'known' | 'possessed' | 'inherent';
  phishingResistance: 'none' | 'low' | 'medium' | 'high';
  phishingDetail: string;
  isTrueSecondFactor: boolean;
}

export const authenticators: AuthenticatorItem[] = [
  {
    id: 'password',
    name: 'Password',
    correctCategory: 'known',
    phishingResistance: 'none',
    phishingDetail: 'Can be phished via fake login pages',
    isTrueSecondFactor: false,
  },
  {
    id: 'pin',
    name: 'PIN',
    correctCategory: 'known',
    phishingResistance: 'none',
    phishingDetail: 'Can be phished just like a password',
    isTrueSecondFactor: false,
  },
  {
    id: 'security-question',
    name: 'Security question',
    correctCategory: 'known',
    phishingResistance: 'none',
    phishingDetail: 'Answers are often guessable from public info or phishable',
    isTrueSecondFactor: false,
  },
  {
    id: 'totp',
    name: 'TOTP app (e.g. Google Authenticator)',
    correctCategory: 'possessed',
    phishingResistance: 'low',
    phishingDetail: 'OTP codes can be relayed in real-time to an impostor site',
    isTrueSecondFactor: true,
  },
  {
    id: 'sms-code',
    name: 'SMS code',
    correctCategory: 'possessed',
    phishingResistance: 'low',
    phishingDetail: 'SMS codes can be intercepted (SIM swap) or relayed to an impostor site',
    isTrueSecondFactor: true,
  },
  {
    id: 'hardware-token',
    name: 'Hardware security key (FIDO2)',
    correctCategory: 'possessed',
    phishingResistance: 'high',
    phishingDetail: 'Origin-bound: the key only responds to the legitimate site domain',
    isTrueSecondFactor: true,
  },
  {
    id: 'passkey',
    name: 'Passkey',
    correctCategory: 'possessed',
    phishingResistance: 'high',
    phishingDetail: 'Origin-bound via WebAuthn; private key never leaves the authenticator',
    isTrueSecondFactor: true,
  },
  {
    id: 'push-prompt',
    name: 'Push prompt',
    correctCategory: 'possessed',
    phishingResistance: 'medium',
    phishingDetail: 'Can be abused through fatigue attacks (repeated prompts until user approves)',
    isTrueSecondFactor: true,
  },
  {
    id: 'fingerprint',
    name: 'Fingerprint scan',
    correctCategory: 'inherent',
    phishingResistance: 'medium',
    phishingDetail: 'Local biometric; cannot be phished remotely but can be spoofed physically',
    isTrueSecondFactor: true,
  },
];

export interface SortResult {
  itemId: string;
  placedCategory: string;
  correct: boolean;
}

export function checkSorting(placements: Record<string, string>): SortResult[] {
  return authenticators.map(item => {
    const placedCategory = placements[item.id] || 'unplaced';
    return {
      itemId: item.id,
      placedCategory,
      correct: placedCategory === item.correctCategory,
    };
  });
}

export function checkMfaValidity(
  factor1Category: string,
  factor2Category: string
): { valid: boolean; reason: string } {
  if (factor1Category === factor2Category) {
    return {
      valid: false,
      reason: `Both factors are "${factor1Category}" — two factors from the same category is not true MFA.`,
    };
  }
  return {
    valid: true,
    reason: `Factors are from different categories ("${factor1Category}" + "${factor2Category}") — this qualifies as true MFA.`,
  };
}
