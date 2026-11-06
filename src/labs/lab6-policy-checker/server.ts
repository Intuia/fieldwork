export interface RuleCheck {
  rule: string
  passed: boolean
  detail: string
}

export interface PolicyResult {
  passes: boolean
  rules: RuleCheck[]
  overallScore: 'weak' | 'fair' | 'good' | 'strong'
}

const COMMON_PASSWORDS_BLOCKLIST = [
  'password', 'password1', 'password123', '123456', '12345678', '123456789',
  '1234567890', 'qwerty', 'abc123', 'monkey', 'master', 'dragon', 'login',
  'princess', 'football', 'shadow', 'sunshine', 'trustno1', 'iloveyou',
  'batman', 'access', 'hello', 'charlie', 'donald', 'letmein', 'welcome',
  'admin', 'administrator', 'passw0rd', 'p@ssword', 'p@ssw0rd', 'p@ssw0rd!',
  'qwerty123', 'starwars', 'whatever', 'freedom', 'nothing', 'baseball',
  'jordan', 'thomas', 'summer', 'winter', 'spring', 'autumn', 'hockey',
  'soccer', 'hunter', 'pepper', 'harley', 'ranger', 'buster', 'george',
  'killer', 'cookie', 'flower', 'cheese', 'butter', 'coffee', 'robert',
  'matrix', 'andrew', 'daniel', 'joshua', 'michael', 'ashley', 'jessica',
  'jennifer', 'amanda', 'nicole', 'stephanie', 'chelsea', 'corvette',
  'mustang', 'camaro', 'firebird', 'ferrari', 'porsche', 'mercedes',
  'qazwsx', 'zxcvbnm', 'asdfghjkl', '1q2w3e4r', '1qaz2wsx', 'test',
  'test123', 'changeme', 'default', 'secret', 'root', 'toor', 'pass',
]

export function evaluate2011Rules(password: string): PolicyResult {
  const rules: RuleCheck[] = []

  // Rule 1: Minimum 8 characters
  const hasMinLength = password.length >= 8
  rules.push({
    rule: 'Minimum 8 characters',
    passed: hasMinLength,
    detail: hasMinLength
      ? `Length: ${password.length} characters (meets minimum)`
      : `Length: ${password.length} characters (below 8-character minimum)`,
  })

  // Rule 2: Must contain uppercase
  const hasUppercase = /[A-Z]/.test(password)
  rules.push({
    rule: 'Contains uppercase letter',
    passed: hasUppercase,
    detail: hasUppercase
      ? 'At least one uppercase letter found'
      : 'No uppercase letter found — required by composition rules',
  })

  // Rule 3: Must contain lowercase
  const hasLowercase = /[a-z]/.test(password)
  rules.push({
    rule: 'Contains lowercase letter',
    passed: hasLowercase,
    detail: hasLowercase
      ? 'At least one lowercase letter found'
      : 'No lowercase letter found — required by composition rules',
  })

  // Rule 4: Must contain digit
  const hasDigit = /[0-9]/.test(password)
  rules.push({
    rule: 'Contains digit',
    passed: hasDigit,
    detail: hasDigit
      ? 'At least one digit found'
      : 'No digit found — required by composition rules',
  })

  // Rule 5: Must contain special character
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  rules.push({
    rule: 'Contains special character',
    passed: hasSpecial,
    detail: hasSpecial
      ? 'At least one special character found'
      : 'No special character found — required by composition rules',
  })

  // Rule 6: Periodic change required (always flagged as a policy note)
  rules.push({
    rule: 'Periodic change required',
    passed: true,
    detail: 'Policy mandates password change every 60–90 days regardless of compromise evidence',
  })

  const passCount = rules.filter(r => r.passed).length
  const passes = hasMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecial

  let overallScore: PolicyResult['overallScore'] = 'weak'
  if (passes && password.length >= 12) {
    overallScore = 'strong'
  } else if (passes) {
    overallScore = 'good'
  } else if (passCount >= 4) {
    overallScore = 'fair'
  } else {
    overallScore = 'weak'
  }

  return { passes, rules, overallScore }
}

export type PolicyMode = '2011-rules' | 'nist-800-63b4'

export interface PolicyCheckResult {
  pass: boolean
  checks: { name: string; pass: boolean; detail: string }[]
}

export function checkPolicy(password: string, mode: PolicyMode): PolicyCheckResult {
  if (mode === '2011-rules') {
    const result = evaluate2011Rules(password)
    return {
      pass: result.passes,
      checks: result.rules.map(r => ({ name: r.rule, pass: r.passed, detail: r.detail })),
    }
  } else {
    const result = evaluateNIST2024Rules(password)
    return {
      pass: result.passes,
      checks: result.rules.map(r => ({ name: r.rule, pass: r.passed, detail: r.detail })),
    }
  }
}

export function evaluateNIST2024Rules(password: string): PolicyResult {
  const rules: RuleCheck[] = []
  const lowerPassword = password.toLowerCase()

  // Rule 1: Minimum 15 characters (single-factor default)
  const hasMinLength = password.length >= 15
  rules.push({
    rule: 'Minimum 15 characters (single-factor)',
    passed: hasMinLength,
    detail: hasMinLength
      ? `Length: ${password.length} characters (meets NIST SP 800-63B-4 minimum for single-factor)`
      : `Length: ${password.length} characters (below 15-character minimum for single-factor; 8 is allowed only within MFA)`,
  })

  // Rule 2: Allow long passwords (informational — always passes)
  const allowsLong = password.length <= 64
  rules.push({
    rule: 'Supports up to 64+ characters',
    passed: true,
    detail: allowsLong
      ? `Length ${password.length} is within recommended capacity. Systems must accept at least 64 characters.`
      : `Length ${password.length} exceeds 64 — a well-configured system still accepts this.`,
  })

  // Rule 3: No composition rules (informational — always passes)
  rules.push({
    rule: 'No composition rules imposed',
    passed: true,
    detail: 'NIST 800-63B-4 does not require uppercase, lowercase, digits, or special characters. Length is the primary control.',
  })

  // Rule 4: No forced periodic rotation (informational — always passes)
  rules.push({
    rule: 'No forced periodic rotation',
    passed: true,
    detail: 'Avoid mandatory periodic changes absent compromise evidence. Forced rotation encourages unsafe workarounds.',
  })

  // Rule 5: Not on blocklist
  const isOnBlocklist = COMMON_PASSWORDS_BLOCKLIST.includes(lowerPassword)
  rules.push({
    rule: 'Not on compromised/common password blocklist',
    passed: !isOnBlocklist,
    detail: isOnBlocklist
      ? `"${password}" appears on the common password blocklist — it must be rejected`
      : 'Password is not on the sample blocklist',
  })

  // Rule 6: Allows paste and password managers (informational — always passes)
  rules.push({
    rule: 'Paste and password managers allowed',
    passed: true,
    detail: 'Do not block paste into password fields. Support password managers and broad character sets.',
  })

  const passes = hasMinLength && !isOnBlocklist

  let overallScore: PolicyResult['overallScore'] = 'weak'
  if (passes && password.length >= 20) {
    overallScore = 'strong'
  } else if (passes) {
    overallScore = 'good'
  } else if (password.length >= 8 && !isOnBlocklist) {
    overallScore = 'fair'
  } else {
    overallScore = 'weak'
  }

  return { passes, rules, overallScore }
}
