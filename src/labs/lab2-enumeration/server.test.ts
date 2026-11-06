import { describe, it, expect } from 'vitest'
import {
  vulnerableLogin, hardenedLogin,
  vulnerableRegistration, hardenedRegistration,
  vulnerableRecovery, hardenedRecovery,
} from './server'

describe('Lab 2 – Enumeration Comparator', () => {
  describe('vulnerableLogin', () => {
    it('reveals unknown users via distinct message', () => {
      const res = vulnerableLogin('nonexistent', 'anything')
      expect(res.body).toBe('Unknown user')
    })

    it('reveals valid user with wrong password via distinct message', () => {
      const res = vulnerableLogin('admin', 'wrong')
      expect(res.body).toBe('Incorrect password')
    })

    it('authenticates with correct credentials', () => {
      const res = vulnerableLogin('admin', 's3cure!')
      expect(res.status).toBe(302)
    })

    it('leaks timing: unknown user is faster than wrong password', () => {
      const unknown = vulnerableLogin('nonexistent', 'x')
      const wrongPw = vulnerableLogin('admin', 'wrong')
      expect(unknown.timing).toBeLessThan(wrongPw.timing)
    })

    it('is case-insensitive for usernames', () => {
      const res = vulnerableLogin('Admin', 's3cure!')
      expect(res.status).toBe(302)
    })
  })

  describe('hardenedLogin', () => {
    it('returns identical message for unknown user and wrong password', () => {
      const unknown = hardenedLogin('nonexistent', 'anything')
      const wrongPw = hardenedLogin('admin', 'wrong')
      expect(unknown.body).toBe(wrongPw.body)
      expect(unknown.body).toBe('Invalid credentials')
    })

    it('returns similar timing for unknown and wrong password', () => {
      const unknown = hardenedLogin('nonexistent', 'x')
      const wrongPw = hardenedLogin('admin', 'wrong')
      expect(Math.abs(unknown.timing - wrongPw.timing)).toBeLessThan(10)
    })

    it('authenticates with correct credentials', () => {
      const res = hardenedLogin('admin', 's3cure!')
      expect(res.status).toBe(302)
    })
  })

  describe('vulnerableRegistration', () => {
    it('reveals existing usernames', () => {
      const res = vulnerableRegistration('admin')
      expect(res.body).toBe('Username already taken')
      expect(res.status).toBe(409)
    })

    it('accepts new usernames', () => {
      const res = vulnerableRegistration('newuser')
      expect(res.status).toBe(201)
    })
  })

  describe('hardenedRegistration', () => {
    it('returns identical response for existing and new usernames', () => {
      const existing = hardenedRegistration('admin')
      const newUser = hardenedRegistration('newuser')
      expect(existing.body).toBe(newUser.body)
      expect(existing.status).toBe(newUser.status)
    })
  })

  describe('vulnerableRecovery', () => {
    it('reveals non-existent accounts', () => {
      const res = vulnerableRecovery('nonexistent')
      expect(res.body).toBe('No account found with that username')
    })

    it('reveals existing accounts with email hint', () => {
      const res = vulnerableRecovery('admin')
      expect(res.body).toContain('Recovery email sent')
    })
  })

  describe('hardenedRecovery', () => {
    it('returns identical response regardless of account existence', () => {
      const existing = hardenedRecovery('admin')
      const unknown = hardenedRecovery('nonexistent')
      expect(existing.body).toBe(unknown.body)
    })
  })
})
