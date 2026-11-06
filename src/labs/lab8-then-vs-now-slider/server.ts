export interface TimelineRecommendation {
  topic: string;
  recommendations: {
    year: number;
    text: string;
    whyChanged?: string;
  }[];
}

export const timelineData: TimelineRecommendation[] = [
  {
    topic: 'Password Policy',
    recommendations: [
      { year: 2011, text: 'Require mixed characters (upper, lower, digit, special). Minimum 8 characters. Enforce periodic change every 90 days.' },
      { year: 2017, text: 'NIST 800-63B removes composition rules. Minimum 8 characters. Check against blocklist. No forced rotation without evidence.', whyChanged: 'Research showed composition rules produce predictable substitutions (P@ssw0rd!). Users reuse patterns across rotations.' },
      { year: 2025, text: 'Minimum 15 characters single-factor (8 within MFA). Allow 64+ chars. Blocklist common/compromised values. No composition rules. No arbitrary rotation. Support paste and managers.', whyChanged: 'Longer passphrases resist offline cracking better than short complex strings. Password managers generate truly random credentials.' },
    ],
  },
  {
    topic: 'Password Hashing',
    recommendations: [
      { year: 2011, text: 'Use salted SHA-256. Each password gets a unique salt. This is considered sound practice.' },
      { year: 2017, text: 'Use bcrypt or PBKDF2 with high iteration count. SHA-256 alone is too fast for password hashing.', whyChanged: 'GPU acceleration makes fast hashes trivially crackable. A modern GPU can compute billions of SHA-256 hashes per second.' },
      { year: 2025, text: 'Prefer Argon2id. bcrypt or scrypt acceptable. Unique salt, tunable work factor. SHA-256 alone is not suitable. Benchmark and review costs.', whyChanged: 'Memory-hard functions like Argon2id resist both GPU and ASIC attacks by requiring significant memory per hash computation.' },
    ],
  },
  {
    topic: 'Multi-Factor Authentication',
    recommendations: [
      { year: 2011, text: 'Physical tokens and challenge-response as stronger login options. Knowledge prompts (security questions) as additional verification.' },
      { year: 2017, text: 'SMS-based OTP widely deployed. NIST initially deprecates SMS then walks back to "restricted". Push notifications emerging.', whyChanged: 'SMS vulnerable to SIM swap and SS7 attacks. But removing it would leave many users with no second factor.' },
      { year: 2025, text: 'FIDO2/passkeys preferred for phishing resistance. SMS/OTP can be relayed. Push fatigue is a real attack. Protect fallback and recovery paths.', whyChanged: 'Phishing-resistant protocols bind credentials to the relying party origin, preventing real-time relay attacks entirely.' },
    ],
  },
  {
    topic: 'Account Recovery',
    recommendations: [
      { year: 2011, text: 'Security questions as identity verification. Emailed credentials for reset. Memorable word subsets as challenge.' },
      { year: 2017, text: 'Security questions discouraged. Use high-entropy reset tokens. Short expiry. Single-use.', whyChanged: 'Security question answers are often public (mother\'s maiden name, pet name) or shared across services.' },
      { year: 2025, text: 'No security questions as proof of identity. High-entropy single-use tokens. Recovery and authenticator binding are first-class security processes. Recovery must not restore weaker paths.', whyChanged: 'Recovery became the primary attack vector — if recovery is easier than login, it defeats strong primary authentication.' },
    ],
  },
  {
    topic: 'Standards & Lifecycle',
    recommendations: [
      { year: 2011, text: 'No unified digital identity framework widely adopted. Authentication treated as a single login form decision.' },
      { year: 2017, text: 'NIST 800-63-3 introduces assurance levels (AAL1-3). Federation and lifecycle management formalized.', whyChanged: 'Organizations needed risk-based authentication. One size does not fit all applications.' },
      { year: 2025, text: 'NIST 800-63-4 (final July 2025). Expands privacy, UX, synced authenticators. Assurance levels match strength to impact. Federation requires trustworthy lifecycle handling.', whyChanged: 'Synced passkeys (cross-device) change the threat model. Privacy and usability are security requirements, not afterthoughts.' },
    ],
  },
];

export function getRecommendationAtYear(topic: string, year: number): string {
  const topicData = timelineData.find(t => t.topic === topic);
  if (!topicData) {
    return 'Unknown topic';
  }

  // Find the most recent recommendation at or before the given year
  let bestMatch = topicData.recommendations[0];
  for (const rec of topicData.recommendations) {
    if (rec.year <= year) {
      bestMatch = rec;
    }
  }
  return bestMatch.text;
}

export function getWhyChangedAtYear(topic: string, year: number): string | undefined {
  const topicData = timelineData.find(t => t.topic === topic);
  if (!topicData) {
    return undefined;
  }

  let bestMatch = topicData.recommendations[0];
  for (const rec of topicData.recommendations) {
    if (rec.year <= year) {
      bestMatch = rec;
    }
  }
  return bestMatch.whyChanged;
}
