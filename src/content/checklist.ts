import type { ChecklistItem } from './types';

export const checklistItems: ChecklistItem[] = [
  // Category: Map authentication paths
  {
    id: 'cl-map-register',
    category: 'Map authentication paths',
    text: 'Register',
    slideRef: 62,
  },
  {
    id: 'cl-map-login',
    category: 'Map authentication paths',
    text: 'Login',
    slideRef: 62,
  },
  {
    id: 'cl-map-change',
    category: 'Map authentication paths',
    text: 'Change password',
    slideRef: 62,
  },
  {
    id: 'cl-map-remember',
    category: 'Map authentication paths',
    text: 'Remember me',
    slideRef: 62,
  },
  {
    id: 'cl-map-recover',
    category: 'Map authentication paths',
    text: 'Recover account',
    slideRef: 62,
  },
  {
    id: 'cl-map-federate',
    category: 'Map authentication paths',
    text: 'Federate (SSO)',
    slideRef: 62,
  },
  {
    id: 'cl-map-impersonate',
    category: 'Map authentication paths',
    text: 'Impersonate',
    slideRef: 62,
  },
  {
    id: 'cl-map-revoke',
    category: 'Map authentication paths',
    text: 'Revoke access',
    slideRef: 62,
  },

  // Category: Trace state
  {
    id: 'cl-state-progress',
    category: 'Trace state',
    text: 'Server-side progress tracking (no client-controlled stage indicators)',
    slideRef: 62,
  },
  {
    id: 'cl-state-binding',
    category: 'Trace state',
    text: 'Account binding (identity locked to attempt)',
    slideRef: 62,
  },
  {
    id: 'cl-state-expiry',
    category: 'Trace state',
    text: 'Expiry (abandoned attempts and tokens expire)',
    slideRef: 62,
  },
  {
    id: 'cl-state-replay',
    category: 'Trace state',
    text: 'Replay prevention (tokens/challenges single-use)',
    slideRef: 62,
  },
  {
    id: 'cl-state-cleanup',
    category: 'Trace state',
    text: 'Cleanup (partial state cleared on failure/completion)',
    slideRef: 62,
  },

  // Category: Protect secrets
  {
    id: 'cl-secrets-https',
    category: 'Protect secrets',
    text: 'HTTPS for all authentication traffic',
    slideRef: 62,
  },
  {
    id: 'cl-secrets-no-urls',
    category: 'Protect secrets',
    text: 'No secrets in URLs or logs',
    slideRef: 62,
  },
  {
    id: 'cl-secrets-hashing',
    category: 'Protect secrets',
    text: 'Salted, tunable password hashes (Argon2id / bcrypt / scrypt)',
    slideRef: 62,
  },
  {
    id: 'cl-secrets-tokens',
    category: 'Protect secrets',
    text: 'Short-lived, single-use reset tokens',
    slideRef: 62,
  },

  // Category: Defend and observe
  {
    id: 'cl-defend-rate-limits',
    category: 'Defend and observe',
    text: 'Server-side rate limits on authentication attempts',
    slideRef: 62,
  },
  {
    id: 'cl-defend-generic',
    category: 'Defend and observe',
    text: 'Generic failure responses (no account enumeration)',
    slideRef: 62,
  },
  {
    id: 'cl-defend-mfa',
    category: 'Defend and observe',
    text: 'MFA / passkeys offered or required',
    slideRef: 62,
  },
  {
    id: 'cl-defend-notifications',
    category: 'Defend and observe',
    text: 'User notifications for account events',
    slideRef: 62,
  },
  {
    id: 'cl-defend-audit',
    category: 'Defend and observe',
    text: 'Audit logging (no secrets in logs)',
    slideRef: 62,
  },
];
