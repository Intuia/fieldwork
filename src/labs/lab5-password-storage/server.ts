export type StorageMethod = 'plaintext' | 'fast-hash' | 'salted-fast-hash' | 'bcrypt' | 'scrypt' | 'argon2id'

export interface StorageResult {
  method: string
  description: string
  whatLeaks: string
  illustrativeGuessesPerSecond: number
  illustrativeTimeToCrack: string
  relativeSecurityScore: number
  workFactor?: number
}

export function evaluateStorage(method: StorageMethod, workFactor?: number): StorageResult {
  if (method === 'plaintext') {
    return {
      method: 'Plaintext',
      description: 'Passwords stored as-is with no transformation.',
      whatLeaks: 'Every password is immediately visible in the database. All accounts are compromised instantly.',
      illustrativeGuessesPerSecond: Infinity,
      illustrativeTimeToCrack: 'Instant — no guessing needed',
      relativeSecurityScore: 0,
    }
  } else if (method === 'fast-hash') {
    return {
      method: 'Fast Hash (unsalted MD5/SHA-256)',
      description: 'Password run through a general-purpose hash. No salt. Identical passwords produce identical hashes.',
      whatLeaks: 'Hashes can be reversed with rainbow tables or brute-forced at billions of guesses per second.',
      illustrativeGuessesPerSecond: 10_000_000_000,
      illustrativeTimeToCrack: 'Seconds for common passwords',
      relativeSecurityScore: 10,
    }
  } else if (method === 'salted-fast-hash') {
    return {
      method: 'Salted Fast Hash (SHA-256 + salt)',
      description: 'A unique random salt is prepended before hashing. Prevents rainbow table lookups, but the hash is still fast.',
      whatLeaks: 'Each password must be brute-forced individually (no rainbow tables), but guessing is still billions per second.',
      illustrativeGuessesPerSecond: 10_000_000_000,
      illustrativeTimeToCrack: 'Minutes for common passwords',
      relativeSecurityScore: 20,
    }
  } else if (method === 'bcrypt') {
    const factor = workFactor ?? 3
    // Work factor slider 1–5 maps conceptually to bcrypt cost 10–14
    const costLabel = 10 + (factor - 1)
    let guessesPerSecond = 10000
    let timeToCrack = 'Months for common passwords'
    let score = 70

    if (factor === 1) {
      guessesPerSecond = 10000
      timeToCrack = 'Months for common passwords'
      score = 70
    } else if (factor === 2) {
      guessesPerSecond = 5000
      timeToCrack = 'Months to a year'
      score = 75
    } else if (factor === 3) {
      guessesPerSecond = 1000
      timeToCrack = 'Years for common passwords'
      score = 80
    } else if (factor === 4) {
      guessesPerSecond = 300
      timeToCrack = 'Many years'
      score = 83
    } else {
      guessesPerSecond = 100
      timeToCrack = 'Decades'
      score = 85
    }

    return {
      method: `bcrypt (cost ${costLabel})`,
      description: `Dedicated password hash with tunable work factor. Each guess requires significant CPU time. Cost parameter: ${costLabel}.`,
      whatLeaks: 'Hashes that are individually expensive to brute-force. Higher cost = slower guessing.',
      illustrativeGuessesPerSecond: guessesPerSecond,
      illustrativeTimeToCrack: timeToCrack,
      relativeSecurityScore: score,
      workFactor: factor,
    }
  } else if (method === 'scrypt') {
    const factor = workFactor ?? 3
    let guessesPerSecond = 5000
    let timeToCrack = 'Months to years'
    let score = 75

    if (factor === 1) {
      guessesPerSecond = 5000
      timeToCrack = 'Months to years'
      score = 75
    } else if (factor === 2) {
      guessesPerSecond = 2000
      timeToCrack = 'Years'
      score = 80
    } else if (factor === 3) {
      guessesPerSecond = 500
      timeToCrack = 'Many years'
      score = 85
    } else if (factor === 4) {
      guessesPerSecond = 100
      timeToCrack = 'Decades'
      score = 88
    } else {
      guessesPerSecond = 30
      timeToCrack = 'Decades to centuries'
      score = 90
    }

    return {
      method: `scrypt (level ${factor})`,
      description: `Memory-hard password hash. Requires both CPU time and large amounts of RAM per guess, resisting GPU acceleration.`,
      whatLeaks: 'Hashes that are expensive in both time and memory to brute-force.',
      illustrativeGuessesPerSecond: guessesPerSecond,
      illustrativeTimeToCrack: timeToCrack,
      relativeSecurityScore: score,
      workFactor: factor,
    }
  } else {
    // argon2id
    const factor = workFactor ?? 3
    let guessesPerSecond = 100
    let timeToCrack = 'Years'
    let score = 85

    if (factor === 1) {
      guessesPerSecond = 100
      timeToCrack = 'Years'
      score = 85
    } else if (factor === 2) {
      guessesPerSecond = 30
      timeToCrack = 'Decades'
      score = 90
    } else if (factor === 3) {
      guessesPerSecond = 10
      timeToCrack = 'Decades to centuries'
      score = 93
    } else if (factor === 4) {
      guessesPerSecond = 3
      timeToCrack = 'Centuries'
      score = 97
    } else {
      guessesPerSecond = 1
      timeToCrack = 'Centuries or more'
      score = 100
    }

    return {
      method: `Argon2id (level ${factor})`,
      description: `Winner of the Password Hashing Competition. Tunable for CPU time, memory, and parallelism. Recommended by OWASP and NIST SP 800-63B-4.`,
      whatLeaks: 'Hashes that are extremely expensive to brute-force. The recommended modern choice.',
      illustrativeGuessesPerSecond: guessesPerSecond,
      illustrativeTimeToCrack: timeToCrack,
      relativeSecurityScore: score,
      workFactor: factor,
    }
  }
}

export function getAllMethodResults(): StorageResult[] {
  return [
    evaluateStorage('plaintext'),
    evaluateStorage('fast-hash'),
    evaluateStorage('salted-fast-hash'),
    evaluateStorage('bcrypt', 3),
    evaluateStorage('scrypt', 3),
    evaluateStorage('argon2id', 3),
  ]
}
