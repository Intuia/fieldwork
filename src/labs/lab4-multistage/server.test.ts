import { describe, it, expect } from 'vitest'
import { MultistageServer } from './server'

describe('Lab 4 – Multistage State Machine', () => {
  describe('client-side mode', () => {
    it('completes normal 3-stage flow', () => {
      const server = new MultistageServer('client-side')
      const r1 = server.submitStage(1, { username: 'admin' })
      expect(r1.success).toBe(true)
      expect(r1.nextStage).toBe(2)

      const r2 = server.submitStage(2, { password: 's3cure!' }, { completedStages: [1], username: 'admin' })
      expect(r2.success).toBe(true)
      expect(r2.nextStage).toBe(3)

      const r3 = server.submitStage(3, { answer: '42' }, { completedStages: [1, 2], username: 'admin' })
      expect(r3.authenticated).toBe(true)
    })

    it('allows skipping to stage 3 (vulnerability)', () => {
      const server = new MultistageServer('client-side')
      const r = server.submitStage(3, { answer: '42' }, { completedStages: [1, 2], username: 'admin' })
      expect(r.authenticated).toBe(true)
    })

    it('rejects wrong password', () => {
      const server = new MultistageServer('client-side')
      const r = server.submitStage(2, { password: 'wrong' })
      expect(r.success).toBe(false)
    })

    it('rejects wrong challenge answer', () => {
      const server = new MultistageServer('client-side')
      const r = server.submitStage(3, { answer: 'wrong' })
      expect(r.success).toBe(false)
    })
  })

  describe('server-side mode', () => {
    it('completes normal 3-stage flow', () => {
      const server = new MultistageServer('server-side')
      const r1 = server.submitStage(1, { username: 'admin' })
      expect(r1.success).toBe(true)

      const r2 = server.submitStage(2, { password: 's3cure!' })
      expect(r2.success).toBe(true)

      const r3 = server.submitStage(3, { answer: '42' })
      expect(r3.authenticated).toBe(true)
    })

    it('blocks skip (SEQUENCE_MONOTONIC)', () => {
      const server = new MultistageServer('server-side')
      const r = server.submitStage(3, { answer: '42' })
      expect(r.success).toBe(false)
      expect(r.invariantViolation).toBe('SEQUENCE_MONOTONIC')
    })

    it('blocks repeat (REPLAY_PREVENTION)', () => {
      const server = new MultistageServer('server-side')
      server.submitStage(1, { username: 'admin' })
      const r = server.submitStage(1, { username: 'admin' })
      expect(r.success).toBe(false)
      expect(r.invariantViolation).toBe('REPLAY_PREVENTION')
    })

    it('blocks cross-account switch (ACCOUNT_BINDING)', () => {
      const server = new MultistageServer('server-side')
      server.submitStage(1, { username: 'admin' })
      const r = server.submitStage(2, { username: 'victim', password: 's3cure!' })
      expect(r.success).toBe(false)
      expect(r.invariantViolation).toBe('ACCOUNT_BINDING')
    })

    it('blocks replay after authentication', () => {
      const server = new MultistageServer('server-side')
      server.submitStage(1, { username: 'admin' })
      server.submitStage(2, { password: 's3cure!' })
      server.submitStage(3, { answer: '42' })
      const r = server.submitStage(1, { username: 'admin' })
      expect(r.invariantViolation).toBe('REPLAY_PREVENTION')
    })

    it('resets state on wrong password', () => {
      const server = new MultistageServer('server-side')
      server.submitStage(1, { username: 'admin' })
      server.submitStage(2, { password: 'wrong' })
      const state = server.getServerState()
      expect(state.completedStages).toEqual([])
      expect(state.boundUsername).toBeNull()
    })

    it('resets state on wrong challenge answer', () => {
      const server = new MultistageServer('server-side')
      server.submitStage(1, { username: 'admin' })
      server.submitStage(2, { password: 's3cure!' })
      server.submitStage(3, { answer: 'wrong' })
      const state = server.getServerState()
      expect(state.completedStages).toEqual([])
    })

    it('reset() clears all server state', () => {
      const server = new MultistageServer('server-side')
      server.submitStage(1, { username: 'admin' })
      server.submitStage(2, { password: 's3cure!' })
      server.reset()
      const state = server.getServerState()
      expect(state.completedStages).toEqual([])
      expect(state.boundUsername).toBeNull()
      expect(state.authenticated).toBe(false)
    })
  })
})
