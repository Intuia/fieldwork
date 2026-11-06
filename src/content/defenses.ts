import type { Defense, SlideContent } from './types';

export const defenseFramework: SlideContent = {
  slideRef: 34,
  title: 'Secure authentication is a risk and usability problem',
  subtitle: 'Controls should meet the application\'s assurance needs',
  points: [
    'Consider asset value, attackers, user population, and compromise consequences',
    'Balance friction against adoption, accessibility, support, and recovery',
    'Combine credential protection, throttling, MFA, and monitoring',
    'Set stronger requirements for administrators and high-impact actions',
  ],
};

export const defenses: Defense[] = [
  {
    id: 'strong-credentials',
    slideRef: 35,
    title: 'Use strong credentials—modern interpretation',
    subtitle: 'Resist likely guessing without arbitrary complexity rituals',
    layer: 'credential',
    points: [
      'Encourage long, unique passwords; allow managers, paste, and broad characters',
      'Check new passwords against common or compromised values',
      'Avoid mandatory periodic changes absent compromise evidence',
      'Protect privileged accounts with phishing-resistant authentication',
    ],
  },
  {
    id: 'secret-handling',
    slideRef: 36,
    title: 'Handle credentials secretively from creation to retirement',
    subtitle: 'Reduce exposure in transit, storage, logs, and browsers',
    layer: 'credential',
    points: [
      'Use authenticated HTTPS for login, change, and recovery',
      'Never put passwords in URLs, analytics, logs, or redirect parameters',
      'Do not return passwords to clients or store recoverable password values',
      'Keep reset tokens short-lived, single-use, and out of referrer/log paths',
    ],
  },
  {
    id: 'password-hashing',
    slideRef: 37,
    title: 'Store passwords with a dedicated password hashing scheme',
    subtitle: 'Hashing should make each offline guess expensive',
    layer: 'credential',
    points: [
      'Use a unique random salt and tunable work factor per password',
      'Prefer Argon2id where suitable; bcrypt or scrypt can fit existing systems',
      'A pepper can help if stored separately; it does not replace salts or hashing',
      'Benchmark costs and raise them as capacity changes',
    ],
  },
  {
    id: 'consistent-validation',
    slideRef: 38,
    title: 'Validate credentials consistently and fail safely',
    subtitle: 'Authentication must be deterministic across normal and error paths',
    layer: 'protocol',
    points: [
      'Verify the complete password; never silently truncate or alter case',
      'Specify Unicode normalization and encoding consistently',
      'Clear temporary authentication state on errors; invalidate uncertain sessions',
      'Review pseudocode, source, dependencies, and exception paths',
    ],
  },
  {
    id: 'prevent-leakage',
    slideRef: 39,
    title: 'Prevent information leakage without confusing users',
    subtitle: 'One generic message should cover account and secret failures',
    layer: 'protocol',
    points: [
      'Use equivalent outcomes for unknown, locked, disabled, and wrong-password cases',
      'Keep status, response shape, and timing sufficiently consistent',
      'Provide safe next steps without confirming account existence',
      'Consider usability and support implications',
    ],
  },
  {
    id: 'prevent-guessing',
    slideRef: 40,
    title: 'Prevent guessing and credential reuse attacks',
    subtitle: 'Combine limits, detection, and safer authentication choices',
    layer: 'protocol',
    points: [
      'Apply server-side rate limits; do not rely only on IP or client cookie',
      'Use delays/challenges carefully to reduce account-lockout abuse',
      'Detect spraying and stuffing across accounts and sources',
      'Offer MFA and prefer phishing-resistant methods when risk warrants',
    ],
  },
  {
    id: 'password-change-defense',
    slideRef: 41,
    title: 'Protect password change functionality',
    subtitle: 'A sensitive change needs a trusted current context',
    layer: 'lifecycle',
    points: [
      'Reauthenticate or require step-up for high-risk changes',
      'Apply the same validation and storage policy as enrollment',
      'Invalidate relevant sessions and recovery credentials after compromise',
      'Notify the account holder through an established channel',
    ],
  },
  {
    id: 'account-recovery',
    slideRef: 42,
    title: 'Protect account recovery with equivalent care',
    subtitle: 'Recovery must not be the easiest route into the account',
    layer: 'lifecycle',
    points: [
      'Use high-entropy single-use reset tokens with short expiry and invalidation',
      'Do not use security questions as proof of identity',
      'Rate-limit and monitor requests; keep responses privacy-preserving',
      'Notify users and offer session/authenticator revocation',
    ],
  },
  {
    id: 'logging-monitoring',
    slideRef: 43,
    title: 'Log, monitor, and notify',
    subtitle: 'Authentication telemetry supports detection and response',
    layer: 'operations',
    points: [
      'Record successes, failures, recovery, credential/MFA changes, impersonation',
      'Never log passwords, OTPs, reset tokens, or full secrets',
      'Correlate failures by account, device, network, and time proportionately',
      'Alert users about meaningful account events with a response path',
    ],
  },
];

export const architectureSynthesis: SlideContent = {
  slideRef: 44,
  title: 'A practical secure-authentication architecture',
  subtitle: 'Layer controls around identity, secrets, state, and response',
  points: [
    'Credential layer: verifier storage, transport, rate limits',
    'Protocol layer: MFA/passkeys, challenge binding, safe session creation',
    'Lifecycle layer: enrollment, change, recovery, revocation, notifications',
    'Operations layer: logs, anomaly detection, support, incident response',
  ],
};

export const defenseLayers = [
  { id: 'credential', label: 'Credential Layer', description: 'Verifier storage, transport, rate limits' },
  { id: 'protocol', label: 'Protocol Layer', description: 'MFA/passkeys, challenge binding, safe session creation' },
  { id: 'lifecycle', label: 'Lifecycle Layer', description: 'Enrollment, change, recovery, revocation, notifications' },
  { id: 'operations', label: 'Operations Layer', description: 'Logs, anomaly detection, support, incident response' },
] as const;
