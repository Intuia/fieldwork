import type { SlideContent, CaseAnalysis } from './types';

export const assessmentWorkflow: SlideContent = {
  slideRef: 45,
  title: 'A safe assessment workflow for authentication',
  subtitle: 'Test only with authorization and accounts you control',
  points: [
    'Inventory login, registration, reset, remember-me, SSO, and support paths',
    'Compare controlled success/failure behavior; avoid unauthorized access',
    'Inspect state transitions, limits, token expiry, server-side enforcement',
    'Document evidence, impact, affected conditions, and mitigations',
  ],
};

export const caseAnalyses: CaseAnalysis[] = [
  {
    id: 'account-enumeration',
    slideRef: 46,
    title: 'Case analysis: account enumeration',
    subtitle: 'Small response differences can amplify into attack advantage',
    points: [
      'Compare controlled account outcomes across login, registration, recovery',
      'Inspect status, body, headers, redirects, and timing',
      'Valid targets become easier to spray or phish',
      'Mitigate with generic outcomes, equivalent processing, throttling, monitoring',
    ],
  },
  {
    id: 'multistage-auth',
    slideRef: 47,
    title: 'Case analysis: multistage authentication',
    subtitle: 'Challenge variety is not protection if state is client-controlled',
    points: [
      'Draw the expected state machine and its invariants',
      'List client values that claim progress or choose a challenge',
      'Check account binding, attempt binding, replay, and failure cleanup',
      'Store state server-side and validate sequence invariants',
    ],
  },
];

export const ethicsBanner = {
  text: 'Test only with authorization and accounts you control.',
  slideRef: 45,
};
