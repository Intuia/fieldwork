import type { ImplementationFlaw, SlideContent } from './types';

export const implementationFlawsIntro: SlideContent = {
  slideRef: 27,
  title: 'Implementation flaws: sound ideas can fail in code',
  subtitle: 'The chapter focuses on fail-open logic, multistage state, and stored secrets',
  points: [
    'Authentication has branches, exceptions, and partial progress states',
    'Client values cannot prove that a prior stage succeeded',
    'Credential databases must withstand offline guessing',
    'Review intended logic and actual execution paths',
  ],
};

export const implementationFlaws: ImplementationFlaw[] = [
  {
    id: 'fail-open',
    slideRef: 28,
    title: 'Fail-open login grants access on error',
    subtitle: 'Unexpected conditions must never count as successful authentication',
    section: 'IMPLEMENTATION FLAW',
    points: [
      'Exceptions, missing fields, parser failure, or outages can skip a check',
      'Incorrect boolean logic and error handling create fail-open paths',
      'On uncertainty, deny, clear temporary state, and log safe diagnostics',
      'Trace every branch through session creation',
    ],
  },
  {
    id: 'multistage-state-machine',
    slideRef: 29,
    title: 'Multistage login is a server-side state machine',
    subtitle: 'Every stage must bind to the same account and attempt',
    section: 'STATE MODEL',
    points: [
      'A sequence may collect identifier, password, and an independent challenge',
      'Store previous-stage success and context in server-side session state',
      'Reject skipped, repeated, reordered, or cross-account transitions',
      'Hidden fields, cookies, and query parameters are not authoritative progress',
    ],
  },
  {
    id: 'validate-transitions',
    slideRef: 30,
    title: 'Validate each transition before accepting the next stage',
    subtitle: 'A strong sequence is explicit and monotonic',
    section: 'PROCEDURE',
    points: [
      'Verify all prior steps on every request',
      'Bind the account once; do not accept a different identity mid-flow',
      'Expire abandoned attempts and invalidate state on failure/completion',
      'Return consistent outcomes without revealing which stage was correct',
    ],
  },
  {
    id: 'random-questions',
    slideRef: 31,
    title: 'Random questions can become replayable or selectable',
    subtitle: 'Randomization is weak when the client controls challenge state',
    section: 'IMPLEMENTATION FLAW',
    points: [
      'A hidden field or cookie naming a challenge lets attackers choose it',
      'A new question on every retry can make captured answers replayable',
      'Bind question to account and attempt server-side',
      'Security questions are not an independent possession factor',
    ],
  },
  {
    id: 'credential-storage',
    slideRef: 32,
    title: 'Credential storage determines breach impact',
    subtitle: 'A database read should not reveal reusable passwords',
    section: 'IMPLEMENTATION FLAW',
    points: [
      'Plaintext or reversible passwords expose all accounts',
      'Fast general hashes make offline guesses cheap',
      'Use password-specific, salted, costed password hashing',
      'Control database access and rehash when cost parameters change',
    ],
  },
];
