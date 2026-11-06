import type { ThreatMapping, SlideContent } from './types';

export const threatModelIntro: SlideContent = {
  slideRef: 33,
  title: 'Map each weakness to attacker capability',
  subtitle: 'Ask what evidence or state an attacker can control',
  points: [
    'Online oracle → guessing, spraying, stuffing, and enumeration',
    'Client-controlled state → stage skipping, replay, or account substitution',
    'Database disclosure → offline cracking and cross-service reuse',
    'Recovery/support path → bypass of primary authenticator',
  ],
};

export const threatMappings: ThreatMapping[] = [
  {
    id: 'online-oracle',
    weakness: 'Online oracle',
    attackerCapability: 'Guessing, spraying, stuffing, and enumeration',
    slideRef: 33,
  },
  {
    id: 'client-controlled-state',
    weakness: 'Client-controlled state',
    attackerCapability: 'Stage skipping, replay, or account substitution',
    slideRef: 33,
  },
  {
    id: 'database-disclosure',
    weakness: 'Database disclosure',
    attackerCapability: 'Offline cracking and cross-service reuse',
    slideRef: 33,
  },
  {
    id: 'recovery-support-path',
    weakness: 'Recovery/support path',
    attackerCapability: 'Bypass of primary authenticator',
    slideRef: 33,
  },
];
