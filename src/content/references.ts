import type { Reference } from './types';

export const references: Reference[] = [
  {
    title: 'The Web Application Hacker\'s Handbook, 2nd edition',
    url: '',
    description: 'Dafydd Stuttard and Marcus Pinto, Wiley, 2011. Chapter 6: Attacking Authentication (pp. 159–202). Primary source for all original slide content.',
  },
  {
    title: 'NIST SP 800-63-4 / 63B-4 (final, July 2025)',
    url: 'https://pages.nist.gov/800-63-4/',
    description: 'Digital Identity Guidelines and Authenticator and Lifecycle Management. Defines password minimums (15 chars single-factor), blocklists, no composition rules, assurance levels, and syncable authenticator guidance.',
  },
  {
    title: 'OWASP Authentication Cheat Sheet',
    url: 'https://cheatsheetseries.owasp.org/',
    description: 'Practical guidance for implementing authentication controls, including session management, credential storage, and multi-factor authentication.',
  },
  {
    title: 'OWASP Password Storage Cheat Sheet',
    url: 'https://cheatsheetseries.owasp.org/',
    description: 'Detailed recommendations for password hashing: Argon2id preferred, bcrypt/scrypt alternatives, work factor benchmarking, and migration strategies.',
  },
  {
    title: 'FIDO Alliance — Passkeys: The Journey to Prevent Phishing, Parts 1–2 (2025)',
    url: 'https://fidoalliance.org/',
    description: 'Industry guidance on phishing-resistant authentication using FIDO2/WebAuthn credentials (passkeys), deployment considerations, and user experience.',
  },
];

export const sourcesCheckedDate = '29 October 2026';
