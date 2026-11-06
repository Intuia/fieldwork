import { useState } from 'react'
import { evaluateStorage, type StorageMethod, type StorageResult } from './server'
import { RotateCcw, Info, AlertTriangle, Database, ShieldCheck } from 'lucide-react'

const METHODS: { id: StorageMethod; label: string; hasWorkFactor: boolean }[] = [
  { id: 'plaintext', label: 'Plaintext', hasWorkFactor: false },
  { id: 'fast-hash', label: 'Fast Hash (MD5/SHA-256)', hasWorkFactor: false },
  { id: 'salted-fast-hash', label: 'Salted Fast Hash', hasWorkFactor: false },
  { id: 'bcrypt', label: 'bcrypt', hasWorkFactor: true },
  { id: 'scrypt', label: 'scrypt', hasWorkFactor: true },
  { id: 'argon2id', label: 'Argon2id', hasWorkFactor: true },
]

function formatGuessRate(rate: number): string {
  if (!isFinite(rate)) {
    return 'N/A (no guessing needed)'
  } else if (rate >= 1_000_000_000) {
    return `~${(rate / 1_000_000_000).toFixed(0)}B / sec`
  } else if (rate >= 1_000_000) {
    return `~${(rate / 1_000_000).toFixed(0)}M / sec`
  } else if (rate >= 1_000) {
    return `~${(rate / 1_000).toFixed(0)}K / sec`
  } else {
    return `~${rate} / sec`
  }
}

function getScoreColor(score: number): string {
  if (score <= 10) {
    return 'bg-red-500'
  } else if (score <= 30) {
    return 'bg-amber-500'
  } else if (score <= 70) {
    return 'bg-amber-400'
  } else if (score <= 90) {
    return 'bg-teal-500'
  } else {
    return 'bg-green-500'
  }
}

function getScoreLabel(score: number): string {
  if (score <= 10) {
    return 'Catastrophic'
  } else if (score <= 30) {
    return 'Very Weak'
  } else if (score <= 70) {
    return 'Moderate'
  } else if (score <= 90) {
    return 'Strong'
  } else {
    return 'Excellent'
  }
}

export function PasswordStorageLab() {
  const [selectedMethod, setSelectedMethod] = useState<StorageMethod>('plaintext')
  const [workFactor, setWorkFactor] = useState(3)

  const currentResult = evaluateStorage(selectedMethod, workFactor)

  // Build comparison data for all methods at default work factor
  const allResults: StorageResult[] = METHODS.map(m => {
    if (m.id === selectedMethod && m.hasWorkFactor) {
      return evaluateStorage(m.id, workFactor)
    }
    return evaluateStorage(m.id, 3)
  })

  const methodHasWorkFactor = METHODS.find(m => m.id === selectedMethod)?.hasWorkFactor ?? false

  function handleReset() {
    setSelectedMethod('plaintext')
    setWorkFactor(3)
  }

  return (
    <div className="space-y-6">
      {/* What this teaches */}
      <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
          <h3 className="font-heading font-bold text-sm text-cyan-400">What this teaches</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed pl-6">
          A database read should not reveal reusable passwords. Plaintext and fast hashes expose all accounts
          cheaply. Password-specific, salted, costed hashing makes each offline guess expensive.
          <span className="text-slate-500 ml-1">(Slides 32, 37, 53)</span>
        </p>
      </div>

      {/* Illustrative disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
        <p className="text-xs text-amber-300 font-mono">
          ILLUSTRATIVE — These values show relative differences, not real benchmarks.
        </p>
      </div>

      {/* Method selection */}
      <div>
        <h3 className="font-heading font-bold text-sm text-slate-200 mb-3">Choose storage method</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {METHODS.map(method => {
            const isSelected = selectedMethod === method.id
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  isSelected
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                    : 'border-[var(--border-subtle)] bg-navy-800 text-slate-400 hover:bg-navy-700/50'
                }`}
                aria-pressed={isSelected}
              >
                <span className="font-mono font-bold">{method.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Work factor slider (only for bcrypt/scrypt/argon2id) */}
      {methodHasWorkFactor && (
        <div className="p-4 bg-navy-800 border border-[var(--border-subtle)] rounded-lg">
          <label className="block font-mono text-xs text-slate-400 mb-2">
            Work Factor: <span className="text-teal-400 font-bold">{workFactor}</span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={workFactor}
            onChange={(e) => setWorkFactor(parseInt(e.target.value, 10))}
            className="w-full accent-teal-500"
            aria-label="Work factor"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Low (faster login)</span>
            <span>High (slower guessing)</span>
          </div>
        </div>
      )}

      {/* Current method detail */}
      <div className="p-5 bg-navy-800 border border-[var(--border-subtle)] rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-teal-500 shrink-0" aria-hidden="true" />
          <h3 className="font-heading font-bold text-slate-100">{currentResult.method}</h3>
        </div>

        <p className="text-sm text-slate-300">{currentResult.description}</p>

        {/* Security score bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              Relative Security
            </span>
            <span className={`font-mono text-xs font-bold ${
              currentResult.relativeSecurityScore <= 20 ? 'text-red-400' :
              currentResult.relativeSecurityScore <= 70 ? 'text-amber-400' :
              'text-green-400'
            }`}>
              {getScoreLabel(currentResult.relativeSecurityScore)} ({currentResult.relativeSecurityScore}/100)
            </span>
          </div>
          <div className="h-3 bg-navy-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getScoreColor(currentResult.relativeSecurityScore)}`}
              style={{ width: `${currentResult.relativeSecurityScore}%` }}
            />
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-navy-900/50 rounded-lg">
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Illustrative Guess Rate
            </div>
            <div className="font-mono text-sm text-slate-200">
              {formatGuessRate(currentResult.illustrativeGuessesPerSecond)}
            </div>
          </div>
          <div className="p-3 bg-navy-900/50 rounded-lg">
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Time to Crack (common pw)
            </div>
            <div className="font-mono text-sm text-slate-200">
              {currentResult.illustrativeTimeToCrack}
            </div>
          </div>
        </div>

        {/* What leaks */}
        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <div className="font-mono text-[10px] text-red-400 uppercase tracking-wider mb-1">
            What a database leak exposes
          </div>
          <p className="text-xs text-slate-300">{currentResult.whatLeaks}</p>
        </div>
      </div>

      {/* Comparison chart across all methods */}
      <div>
        <h3 className="font-heading font-bold text-sm text-slate-200 mb-3">All methods compared</h3>
        <div className="space-y-2">
          {allResults.map(result => {
            const isActive = result.method === currentResult.method
            return (
              <div
                key={result.method}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isActive
                    ? 'border-teal-500/30 bg-teal-500/5'
                    : 'border-[var(--border-subtle)] bg-navy-800/50'
                }`}
              >
                <div className="w-24 sm:w-32 shrink-0">
                  <span className={`font-mono text-xs ${isActive ? 'text-teal-300' : 'text-slate-400'}`}>
                    {result.method}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getScoreColor(result.relativeSecurityScore)}`}
                      style={{ width: `${result.relativeSecurityScore}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="font-mono text-xs text-slate-400">{result.relativeSecurityScore}/100</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommended choice highlight */}
      <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h4 className="font-heading font-bold text-sm text-green-400 mb-1">Recommendation</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Use Argon2id where suitable; bcrypt or scrypt can fit existing systems.
            SHA-256 alone is fast and should not be used as a password hashing function.
            Benchmark costs and raise work factors as capacity changes.
          </p>
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-slate-400 border border-[var(--border-subtle)] rounded-lg hover:bg-navy-700/50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  )
}
