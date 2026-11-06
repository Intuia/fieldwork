import { describe, it, expect } from 'vitest'
import { RateLimitServer } from './server'

describe('Lab 3 – Rate-Limit Simulator', () => {
  describe('client-side strategy', () => {
    it('allows first 5 attempts', () => {
      const server = new RateLimitServer('client-side')
      for (let i = 0; i < 5; i++) {
        const result = server.attempt('admin', 'sess-1', '1.1.1.1')
        expect(result.allowed).toBe(true)
      }
    })

    it('blocks after 5 attempts', () => {
      const server = new RateLimitServer('client-side')
      for (let i = 0; i < 5; i++) {
        server.attempt('admin', 'sess-1', '1.1.1.1')
      }
      const result = server.attempt('admin', 'sess-1', '1.1.1.1')
      expect(result.allowed).toBe(false)
    })

    it('resets when client counter is cleared', () => {
      const server = new RateLimitServer('client-side')
      for (let i = 0; i < 6; i++) {
        server.attempt('admin', 'sess-1', '1.1.1.1')
      }
      server.resetClientCounter()
      const result = server.attempt('admin', 'sess-1', '1.1.1.1')
      expect(result.allowed).toBe(true)
    })
  })

  describe('session-based strategy', () => {
    it('blocks after 5 attempts on same session', () => {
      const server = new RateLimitServer('session-based')
      for (let i = 0; i < 5; i++) {
        server.attempt('admin', 'sess-1', '1.1.1.1')
      }
      const result = server.attempt('admin', 'sess-1', '1.1.1.1')
      expect(result.allowed).toBe(false)
    })

    it('resets with a new session', () => {
      const server = new RateLimitServer('session-based')
      for (let i = 0; i < 6; i++) {
        server.attempt('admin', 'sess-1', '1.1.1.1')
      }
      const result = server.attempt('admin', 'sess-2', '1.1.1.1')
      expect(result.allowed).toBe(true)
    })
  })

  describe('per-account strategy', () => {
    it('locks account after 5 failures', () => {
      const server = new RateLimitServer('per-account')
      for (let i = 0; i < 5; i++) {
        server.attempt('admin', 'sess-1', '1.1.1.1')
      }
      const result = server.attempt('admin', 'sess-2', '2.2.2.2')
      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('locked')
    })

    it('does not lock a different account', () => {
      const server = new RateLimitServer('per-account')
      for (let i = 0; i < 5; i++) {
        server.attempt('admin', 'sess-1', '1.1.1.1')
      }
      const result = server.attempt('alice', 'sess-1', '1.1.1.1')
      expect(result.allowed).toBe(true)
    })
  })

  describe('layered strategy', () => {
    it('adds delay after account threshold', () => {
      const server = new RateLimitServer('layered')
      for (let i = 0; i < 5; i++) {
        server.attempt('admin', 'sess-1', '1.1.1.1')
      }
      const result = server.attempt('admin', 'sess-1', '1.1.1.1')
      expect(result.allowed).toBe(true)
      expect(result.delay).toBeGreaterThan(0)
    })

    it('never fully locks the account', () => {
      const server = new RateLimitServer('layered')
      for (let i = 0; i < 20; i++) {
        const result = server.attempt('admin', `sess-${i}`, `1.1.1.${i}`)
        expect(result.allowed).toBe(true)
      }
    })

    it('triggers IP challenge after 10 attempts from same IP', () => {
      const server = new RateLimitServer('layered')
      for (let i = 0; i < 10; i++) {
        server.attempt(`user${i}`, 'sess-1', '1.1.1.1')
      }
      const result = server.attempt('user11', 'sess-1', '1.1.1.1')
      expect(result.reason).toContain('CAPTCHA')
    })
  })

  describe('reset', () => {
    it('clears all state', () => {
      const server = new RateLimitServer('per-account')
      for (let i = 0; i < 5; i++) {
        server.attempt('admin', 'sess-1', '1.1.1.1')
      }
      server.reset()
      const result = server.attempt('admin', 'sess-1', '1.1.1.1')
      expect(result.allowed).toBe(true)
    })
  })
})
