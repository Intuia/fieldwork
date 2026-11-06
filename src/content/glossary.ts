import type { GlossaryTerm } from './types';

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'authenticator',
    definition: 'Evidence presented to prove an identity claim. May be something known (password), something possessed (token), or something inherent (biometric).',
    slideRef: 4,
  },
  {
    term: 'salt',
    definition: 'A unique random value mixed into each password before hashing. Prevents precomputed table (rainbow table) attacks and ensures identical passwords produce different hashes.',
    slideRef: 32,
  },
  {
    term: 'pepper',
    definition: 'A secret value added to password hashing, stored separately from the hash database. Supplements but does not replace salts or dedicated password hashing.',
    slideRef: 37,
  },
  {
    term: 'work factor',
    definition: 'A tunable parameter that controls the computational cost of a password hash. Higher work factors make each offline guess more expensive for an attacker.',
    slideRef: 37,
  },
  {
    term: 'passkey',
    definition: 'A FIDO2/WebAuthn credential using public-key cryptography bound to a relying party. The private key stays with the authenticator; no shared secret can be phished or cracked from a server breach.',
    slideRef: 54,
  },
  {
    term: 'relying party',
    definition: 'The application or service that depends on an authentication result. In federated authentication, the relying party consumes assertions from an identity provider.',
    slideRef: 10,
  },
  {
    term: 'IdP',
    definition: 'Identity Provider — a service that authenticates users and issues assertions to relying parties. Centralizes authentication decisions in federated architectures.',
    slideRef: 10,
  },
  {
    term: 'assertion',
    definition: 'A digitally signed statement from an identity provider confirming a user\'s authentication. Trust depends on issuer, audience, signature, and expiry validation.',
    slideRef: 10,
  },
  {
    term: 'canonicalization',
    definition: 'The process of converting input to a standard form before comparison. Inconsistent canonicalization of usernames or passwords can collapse distinct values or create surprising identities.',
    slideRef: 21,
  },
  {
    term: 'step-up authentication',
    definition: 'Requiring additional verification for sensitive operations even when the user is already authenticated. Used for high-risk actions like password changes or large transactions.',
    slideRef: 17,
  },
  {
    term: 'spraying',
    definition: 'A breadth-first attack that tries a small set of common passwords across many accounts. Avoids per-account lockout thresholds by distributing attempts.',
    slideRef: 13,
  },
  {
    term: 'stuffing',
    definition: 'Credential stuffing reuses username/password pairs leaked from other services. Exploits password reuse across different sites.',
    slideRef: 13,
  },
  {
    term: 'factor categories',
    definition: 'The three independent types of authentication evidence: something known (knowledge), something possessed (possession), and something inherent (inherence). True MFA requires factors from at least two different categories.',
    slideRef: 8,
  },
  {
    term: 'FIDO2',
    definition: 'An authentication standard combining WebAuthn (browser API) and CTAP (authenticator protocol). Enables phishing-resistant, origin-bound public-key credentials (passkeys).',
    slideRef: 55,
  },
  {
    term: 'Argon2id',
    definition: 'A memory-hard password hashing algorithm that resists both GPU-based and side-channel attacks. Currently the preferred choice for new password storage implementations.',
    slideRef: 53,
  },
  {
    term: 'phishing resistance',
    definition: 'The property of an authentication mechanism that prevents credentials from being captured and replayed by an attacker\'s impostor site. FIDO2/passkeys achieve this through cryptographic origin binding.',
    slideRef: 54,
  },
];
