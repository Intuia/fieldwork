import type { SlideContent, LearningObjective, AccessChainLink, KeyTakeaway } from './types';

export const heroContent: SlideContent = {
  slideRef: 1,
  title: 'Attacking Authentication',
  subtitle: 'A systematic study of design, implementation, and defense in web application identity checks',
  points: [
    'IDENTITY • EVIDENCE • TRUST',
    'The Web Application Hacker\'s Handbook, 2nd edition',
    'Dafydd Stuttard and Marcus Pinto • Wiley • 2011',
    'University lecture and independent study guide',
  ],
};

export const learningObjectives: LearningObjective[] = [
  {
    number: 1,
    text: 'Define authentication; distinguish it from sessions and authorization',
    slideRef: 3,
  },
  {
    number: 2,
    text: 'Classify authentication technologies and analyze their trade-offs',
    slideRef: 3,
  },
  {
    number: 3,
    text: 'Trace design and implementation weaknesses to attacker outcomes',
    slideRef: 3,
  },
  {
    number: 4,
    text: 'Evaluate credential, recovery, validation, and monitoring controls',
    slideRef: 3,
  },
  {
    number: 5,
    text: 'Compare the textbook perspective with current standards and practice',
    slideRef: 3,
  },
];

export const accessChainLinks: AccessChainLink[] = [
  {
    id: 'claim',
    label: 'Claim',
    description: 'Authentication verifies evidence of an identity claim',
    slideRef: 5,
  },
  {
    id: 'verify',
    label: 'Verify',
    description: 'Session management preserves continuity after verification',
    slideRef: 5,
  },
  {
    id: 'bind',
    label: 'Bind',
    description: 'Authorization decides which actions the account may perform',
    slideRef: 5,
  },
  {
    id: 'monitor',
    label: 'Monitor',
    description: 'Failure at any link can undermine the full protection',
    slideRef: 5,
  },
];

export const keyTakeaways: KeyTakeaway[] = [
  {
    number: 1,
    text: 'Authentication is a system, not a login form',
    slideRef: 64,
  },
  {
    number: 2,
    text: 'The weakest recovery, fallback, or support path can defeat a strong authenticator',
    slideRef: 64,
  },
  {
    number: 3,
    text: 'Treat the client as untrusted; bind identity and progress to server-side state',
    slideRef: 64,
  },
  {
    number: 4,
    text: 'Use controls grounded in current standards and real use',
    slideRef: 64,
  },
  {
    number: 5,
    text: 'Assess compromise resistance and legitimate-user recovery',
    slideRef: 64,
  },
];

export const foundationsContent: SlideContent = {
  slideRef: 4,
  title: 'Why authentication is a security boundary',
  subtitle: 'Authentication establishes confidence about who is acting',
  points: [
    'A login checks an identity claim against one or more authenticators',
    'Success opens a user context; it does not decide every permitted action',
    'Weak authentication can expose application functionality and data',
    'Authentication, sessions, and access control depend on one another',
  ],
};

export const accessChainContent: SlideContent = {
  slideRef: 5,
  title: 'Authentication sits inside an access chain',
  subtitle: 'A valid login is necessary, but it is only one link',
  points: [
    'Claim → authentication verifies evidence',
    'Session management preserves continuity after verification',
    'Authorization decides which actions the account may perform',
    'Failure at any link can undermine the full protection',
  ],
};
