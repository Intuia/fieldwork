import type { SlideContent } from './types';

export const technologiesIntro: SlideContent = {
  slideRef: 6,
  title: 'Authentication technologies in the chapter',
  subtitle: 'The book surveys several ways to establish identity',
  points: [
    'HTML forms: username and password handled by application logic',
    'Multifactor: combine independent evidence, such as password and token',
    'Client certificates or smartcards: prove possession of a cryptographic credential',
    'HTTP Basic/Digest and Windows-integrated authentication',
    'Third-party authentication services',
  ],
};

export const technologies: SlideContent[] = [
  {
    slideRef: 7,
    title: 'Forms-based login: the common web pattern',
    subtitle: 'The browser collects an identifier and secret; the server verifies them',
    points: [
      'The form is an interface; the security decision belongs server-side',
      'Credentials travel in an HTTP request and need protected transport',
      'The server checks submitted evidence against a protected record',
      'Success should establish a fresh authenticated session',
    ],
  },
  {
    slideRef: 8,
    title: 'Multifactor authentication adds independent evidence',
    subtitle: 'More than one prompt does not automatically mean multiple factors',
    points: [
      'Factor categories: something known, possessed, or inherent',
      'Password plus PIN are both knowledge factors, not true MFA',
      'Physical tokens may generate one-time codes or challenge responses',
      'Factor choice should reflect risk, usability, recovery, and threat model',
    ],
  },
  {
    slideRef: 9,
    title: 'Certificates, smartcards, and integrated authentication',
    subtitle: 'These mechanisms change where evidence is held and checked',
    points: [
      'Client certificates and smartcards use cryptographic credentials',
      'HTTP Basic/Digest and Windows-integrated methods commonly occur in managed networks',
      'Identity-to-account mapping and authorization still need sound design',
      'Strong protocols do not correct weak recovery or unsafe fallback',
    ],
  },
  {
    slideRef: 10,
    title: 'Federated authentication delegates a trust decision',
    subtitle: 'An identity service authenticates for a relying application',
    points: [
      'The user authenticates to an identity provider; the application consumes an assertion',
      'Trust depends on issuer, audience, signature, expiry, and account linking',
      'Centralization improves consistency but raises the importance of IdP security',
      'Federation has since become a mainstream architecture',
    ],
  },
];

export const mfaRule = {
  slideRef: 8,
  text: 'Password + PIN = two knowledge factors, not true MFA. True multifactor requires independent factor categories (known, possessed, or inherent).',
};
