import { useState, useCallback } from 'react'
import { RotateCcw, Info, Send } from 'lucide-react'
import {
  vulnerableLogin, hardenedLogin,
  vulnerableRegistration, hardenedRegistration,
  vulnerableRecovery, hardenedRecovery,
  type LoginResponse, type RegistrationResponse,
} from './server'

type Mode = 'login' | 'registration' | 'recovery'

interface Result {
  label: string;
  response: LoginResponse | RegistrationResponse;
}

export function EnumerationLab() {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [vulnerableResult, setVulnerableResult] = useState<Result | null>(null)
  const [hardenedResult, setHardenedResult] = useState<Result | null>(null)

  const runTest = useCallback(() => {
    if (!username.trim()) {
      return
    }

    if (mode === 'login') {
      setVulnerableResult({ label: 'Vulnerable', response: vulnerableLogin(username, password) })
      setHardenedResult({ label: 'Hardened', response: hardenedLogin(username, password) })
    } else if (mode === 'registration') {
      setVulnerableResult({ label: 'Vulnerable', response: vulnerableRegistration(username) })
      setHardenedResult({ label: 'Hardened', response: hardenedRegistration(username) })
    } else {
      setVulnerableResult({ label: 'Vulnerable', response: vulnerableRecovery(username) })
      setHardenedResult({ label: 'Hardened', response: hardenedRecovery(username) })
    }
  }, [mode, username, password])

  const reset = useCallback(() => {
    setUsername('')
    setPassword('')
    setVulnerableResult(null)
    setHardenedResult(null)
  }, [])

  // Check whether the two results differ (the whole point of the lab)
  const responsesDiffer =
    vulnerableResult !== null &&
    hardenedResult !== null &&
    (vulnerableResult.response.body !== hardenedResult.response.body ||
     vulnerableResult.response.status !== hardenedResult.response.status ||
     Math.abs(vulnerableResult.response.timing - hardenedResult.response.timing) > 10)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-heading text-lg font-bold text-slate-100">Enumeration Comparator</h3>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 border border-[var(--border-subtle)] rounded-lg hover:border-teal-500/30 hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex border-b border-[var(--border-subtle)]" role="tablist" aria-label="Test mode">
        {(['login', 'registration', 'recovery'] as Mode[]).map(m => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => { setMode(m); reset() }}
            className={`px-4 py-2 text-xs font-mono capitalize border-b-2 -mb-px transition-colors ${
              mode === m
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1" htmlFor="enum-username">
              Username
            </label>
            <input
              id="enum-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { runTest() } }}
              placeholder="try: admin, alice, bob, unknown"
              className="w-full px-3 py-2 text-sm bg-navy-800 border border-[var(--border-subtle)] rounded-lg text-slate-200 placeholder-slate-600 outline-none focus:border-teal-500/50"
            />
          </div>
          {mode === 'login' && (
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1" htmlFor="enum-password">
                Password
              </label>
              <input
                id="enum-password"
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { runTest() } }}
                placeholder="try: s3cure! or anything"
                className="w-full px-3 py-2 text-sm bg-navy-800 border border-[var(--border-subtle)] rounded-lg text-slate-200 placeholder-slate-600 outline-none focus:border-teal-500/50"
              />
            </div>
          )}
        </div>
        <button
          onClick={runTest}
          disabled={!username.trim()}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-mono bg-teal-500 text-navy-900 font-bold rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          Send
        </button>
      </div>

      {/* Results: side-by-side */}
      {vulnerableResult && hardenedResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResponseCard
            label="Vulnerable Server"
            response={vulnerableResult.response}
            borderColor="border-red-500/30"
            accentColor="text-red-400"
            highlight={responsesDiffer}
          />
          <ResponseCard
            label="Hardened Server"
            response={hardenedResult.response}
            borderColor="border-green-500/30"
            accentColor="text-green-400"
            highlight={false}
          />
        </div>
      )}

      {/* Difference callout */}
      {responsesDiffer && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm text-amber-300">
            <span className="font-bold">Difference detected.</span> The vulnerable server leaks
            whether the account exists through its response body, status code, or timing. An
            attacker can automate this to build a list of valid usernames.
          </p>
        </div>
      )}

      {/* What this teaches */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <h4 className="font-heading text-sm font-bold text-cyan-300">What this teaches</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Different responses reveal which credential component was wrong. &ldquo;Unknown user&rdquo;
          versus &ldquo;wrong password&rdquo; helps build a valid username list. Registration, login,
          reset, and recovery can each expose account existence through status codes, body text,
          headers, redirects, and timing. Generic responses and consistent processing reduce the
          signal.
          <span className="font-mono text-[10px] text-slate-500 ml-1">(Slides 15, 46)</span>
        </p>
      </div>
    </div>
  )
}

// ── Response display card ─────────────────────────────

interface ResponseCardProps {
  label: string;
  response: LoginResponse | RegistrationResponse;
  borderColor: string;
  accentColor: string;
  highlight: boolean;
}

function ResponseCard({ label, response, borderColor, accentColor, highlight }: ResponseCardProps) {
  return (
    <div className={`rounded-xl border p-4 bg-navy-800 ${borderColor}`}>
      <h4 className={`font-mono text-xs uppercase tracking-wider mb-3 ${accentColor}`}>
        {label}
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Status</span>
          <span className={`font-mono font-bold ${highlight ? 'text-amber-400' : 'text-slate-300'}`}>
            {response.status}
          </span>
        </div>
        <div className="flex justify-between text-xs gap-4">
          <span className="text-slate-500 shrink-0">Body</span>
          <span className={`font-mono text-right ${highlight ? 'text-amber-400' : 'text-slate-300'}`}>
            {response.body}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Timing</span>
          <span className={`font-mono ${highlight ? 'text-amber-400' : 'text-slate-300'}`}>
            {response.timing} ms
          </span>
        </div>
      </div>
    </div>
  )
}
