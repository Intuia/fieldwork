import { useState, useMemo } from 'react'
import { checkPolicy, type PolicyMode } from './server'
import { CheckCircle, XCircle, Info, ClipboardCheck } from 'lucide-react'

const modeDescriptions: Record<PolicyMode, string> = {
  '2011-rules': 'Mixed characters required (upper, lower, digit, special). Minimum 8 characters. 90-day rotation.',
  'nist-800-63b4': 'Minimum 15 chars (single-factor). No composition rules. Blocklist check. No forced rotation. Paste allowed.',
}

const samplePasswords = [
  { label: 'P@ssw0rd!', value: 'P@ssw0rd!' },
  { label: 'correct horse battery staple', value: 'correct horse battery staple' },
  { label: 'admin', value: 'admin' },
  { label: 'MyDogSpotsLoves2RunFast', value: 'MyDogSpotsLoves2RunFast' },
  { label: 'aB1!xYz9', value: 'aB1!xYz9' },
]

export function PolicyCheckerLab() {
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<PolicyMode>('2011-rules')

  const result2011 = useMemo(() => checkPolicy(password, '2011-rules'), [password])
  const resultNist = useMemo(() => checkPolicy(password, 'nist-800-63b4'), [password])

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div>
        <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
          Policy standard
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(['2011-rules', 'nist-800-63b4'] as PolicyMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`p-3 rounded-lg border text-left text-sm transition-all ${
                mode === m
                  ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                  : 'border-[var(--border-subtle)] bg-navy-800 text-slate-400 hover:bg-navy-700/50'
              }`}
            >
              <div className="font-heading font-bold text-xs uppercase">
                {m === '2011-rules' ? '2011 Rules' : 'NIST 800-63B-4'}
              </div>
              <div className="text-[11px] mt-1 leading-snug opacity-80">{modeDescriptions[m]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Password input */}
      <div className="p-4 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
        <label className="block font-mono text-[10px] text-slate-500 uppercase mb-2">
          Enter a password to evaluate
        </label>
        <input
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Type or paste a password..."
          className="w-full px-3 py-2 bg-navy-900 border border-[var(--border-subtle)] rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-teal-500/50"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-[10px] text-slate-500 mr-1">Try:</span>
          {samplePasswords.map(sp => (
            <button
              key={sp.label}
              onClick={() => setPassword(sp.value)}
              className="px-2 py-0.5 bg-navy-700 text-[10px] text-slate-400 rounded hover:bg-navy-600 transition-colors font-mono"
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side results */}
      {password.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 2011 Result */}
          <div className={`p-4 rounded-lg border ${
            result2011.pass ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-heading font-bold text-xs uppercase text-slate-300">2011 Rules</span>
              <span className={`font-mono text-xs font-bold ${result2011.pass ? 'text-green-400' : 'text-red-400'}`}>
                {result2011.pass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="space-y-2">
              {result2011.checks.map(check => (
                <div key={check.name} className="flex items-start gap-2">
                  {check.pass ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <div className="text-xs text-slate-300">{check.name}</div>
                    <div className="text-[10px] text-slate-500">{check.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NIST Result */}
          <div className={`p-4 rounded-lg border ${
            resultNist.pass ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-heading font-bold text-xs uppercase text-slate-300">NIST 800-63B-4</span>
              <span className={`font-mono text-xs font-bold ${resultNist.pass ? 'text-green-400' : 'text-red-400'}`}>
                {resultNist.pass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="space-y-2">
              {resultNist.checks.map(check => (
                <div key={check.name} className="flex items-start gap-2">
                  {check.pass ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <div className="text-xs text-slate-300">{check.name}</div>
                    <div className="text-[10px] text-slate-500">{check.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insight: when the two policies disagree */}
      {password.length > 0 && result2011.pass !== resultNist.pass && (
        <div className={`p-4 rounded-lg border ${
          result2011.pass && !resultNist.pass
            ? 'border-amber-500/30 bg-amber-500/5'
            : 'border-cyan-500/30 bg-cyan-500/5'
        }`}>
          <div className="flex items-start gap-2">
            <ClipboardCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-slate-300">
              {result2011.pass && !resultNist.pass
                ? `"${password}" passes 2011 rules but fails NIST 800-63B-4. Composition complexity alone doesn't make a password strong — length and blocklist checks matter more.`
                : `"${password}" fails 2011 rules but passes NIST 800-63B-4. Long passphrases without special characters are more resistant to offline cracking than short complex strings.`
              }
            </div>
          </div>
        </div>
      )}

      {/* What this teaches */}
      <div className="p-4 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-teal-400" aria-hidden="true" />
          <h4 className="font-heading font-bold text-sm text-teal-400">What this teaches</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
          <li>Composition rules (upper + digit + special) produce predictable substitutions like P@ssw0rd!</li>
          <li>Length is the primary driver of resistance to offline cracking attacks.</li>
          <li>Blocklist checks catch common and breached passwords that pass composition rules.</li>
          <li>Forced rotation causes users to increment passwords (Password1!, Password2!), weakening security.</li>
        </ul>
        <div className="mt-2 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slides 17, 37, 51</span>
        </div>
      </div>
    </div>
  )
}
