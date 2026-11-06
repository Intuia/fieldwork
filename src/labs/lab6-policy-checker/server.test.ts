import { describe, it, expect } from 'vitest'
import { checkPolicy, evaluate2011Rules, evaluateNIST2024Rules } from './server'

describe('Lab 6 – Policy Checker', () => {
  describe('2011 rules', () => {
    it('passes a complex 8+ char password', () => {
      const result = evaluate2011Rules('P@ssw0rd!')
      expect(result.passes).toBe(true)
    })

    it('fails a password missing uppercase', () => {
      const result = evaluate2011Rules('p@ssw0rd!')
      expect(result.passes).toBe(false)
    })

    it('fails a password shorter than 8 characters', () => {
      const result = evaluate2011Rules('Ab1!')
      expect(result.passes).toBe(false)
    })

    it('fails a password missing special character', () => {
      const result = evaluate2011Rules('Passw0rd1')
      expect(result.passes).toBe(false)
    })

    it('fails a password missing digit', () => {
      const result = evaluate2011Rules('P@ssword!')
      expect(result.passes).toBe(false)
    })

    it('rates a long complex password as strong', () => {
      const result = evaluate2011Rules('MyStr0ng!Pass12')
      expect(result.overallScore).toBe('strong')
    })
  })

  describe('NIST 800-63B-4 rules', () => {
    it('passes a 15+ char non-blocklisted password', () => {
      const result = evaluateNIST2024Rules('correct horse battery staple')
      expect(result.passes).toBe(true)
    })

    it('fails a password under 15 characters', () => {
      const result = evaluateNIST2024Rules('short')
      expect(result.passes).toBe(false)
    })

    it('fails a blocklisted password even if long enough', () => {
      // 'password' is too short AND blocklisted
      const result = evaluateNIST2024Rules('password')
      expect(result.passes).toBe(false)
    })

    it('does not require composition rules', () => {
      const result = evaluateNIST2024Rules('this is a long passphrase with no special chars')
      expect(result.passes).toBe(true)
    })

    it('rates a 20+ char password as strong', () => {
      const result = evaluateNIST2024Rules('a very long passphrase indeed')
      expect(result.overallScore).toBe('strong')
    })
  })

  describe('checkPolicy wrapper', () => {
    it('uses 2011 rules when mode is "2011-rules"', () => {
      const result = checkPolicy('P@ssw0rd!', '2011-rules')
      expect(result.pass).toBe(true)
    })

    it('uses NIST rules when mode is "nist-800-63b4"', () => {
      const result = checkPolicy('P@ssw0rd!', 'nist-800-63b4')
      // P@ssw0rd! is only 9 chars, fails NIST 15-char minimum
      expect(result.pass).toBe(false)
    })

    it('highlights policy disagreement: complex but short', () => {
      const r2011 = checkPolicy('P@ssw0rd!', '2011-rules')
      const rNist = checkPolicy('P@ssw0rd!', 'nist-800-63b4')
      expect(r2011.pass).toBe(true)
      expect(rNist.pass).toBe(false)
    })

    it('highlights policy disagreement: long but simple', () => {
      const r2011 = checkPolicy('correct horse battery staple', '2011-rules')
      const rNist = checkPolicy('correct horse battery staple', 'nist-800-63b4')
      // No uppercase, no digit, no special — fails 2011
      expect(r2011.pass).toBe(false)
      // Long and not blocklisted — passes NIST
      expect(rNist.pass).toBe(true)
    })
  })
})
