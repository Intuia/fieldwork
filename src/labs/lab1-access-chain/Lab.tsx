import { useState, useCallback } from 'react'
import { RotateCcw, ChevronRight, Info, ShieldAlert, ShieldCheck } from 'lucide-react'
import { evaluateChain, type ChainState } from './server'

const LINK_META = [
  { key: 'claim' as const, label: 'Claim', description: 'User presents identity' },
  { key: 'verify' as const, label: 'Verify', description: 'Authentication checks evidence' },
  { key: 'bind' as const, label: 'Bind', description: 'Session preserves continuity' },
  { key: 'monitor' as const, label: 'Monitor', description: 'Authorization governs actions' },
]

const INITIAL_STATE: ChainState = {
  claim: true,
  verify: true,
  bind: true,
  monitor: true,
}

export function AccessChainLab() {
  const [chain, setChain] = useState<ChainState>(INITIAL_STATE)

  const toggleLink = useCallback((key: keyof ChainState) => {
    setChain(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const reset = useCallback(() => {
    setChain(INITIAL_STATE)
  }, [])

  const outcome = evaluateChain(chain)

  // Determine which links are "effectively broken" (failed or downstream of a failure)
  function isEffectivelyBroken(index: number): boolean {
    for (let i = 0; i <= index; i++) {
      const key = LINK_META[i].key
      if (!chain[key]) {
        return true
      }
    }
    return false
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-heading text-lg font-bold text-slate-100">Access Chain Explorer</h3>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 border border-[var(--border-subtle)] rounded-lg hover:border-teal-500/30 hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Chain visualisation */}
      <div className="flex flex-col sm:flex-row items-stretch gap-0" role="group" aria-label="Access chain links">
        {LINK_META.map((link, index) => {
          const isWorking = chain[link.key]
          const isBroken = isEffectivelyBroken(index)
          const isLast = index === LINK_META.length - 1

          // Pick colours based on direct toggle and effective state
          let ringColor = 'border-teal-500/40'
          let bgColor = 'bg-teal-500/10'
          let dotColor = 'bg-teal-500'
          let textColor = 'text-teal-300'

          if (!isWorking) {
            // Directly toggled off
            ringColor = 'border-red-500/50'
            bgColor = 'bg-red-500/10'
            dotColor = 'bg-red-500'
            textColor = 'text-red-300'
          } else if (isBroken) {
            // Still toggled "on" but upstream failed
            ringColor = 'border-amber-500/40'
            bgColor = 'bg-amber-500/5'
            dotColor = 'bg-amber-500'
            textColor = 'text-amber-300'
          }

          return (
            <div key={link.key} className="flex sm:flex-1 items-center">
              <button
                onClick={() => toggleLink(link.key)}
                aria-pressed={isWorking}
                className={`flex-1 flex flex-col items-center gap-1.5 px-4 py-4 rounded-xl border-2 transition-all duration-300 ${ringColor} ${bgColor}`}
              >
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${dotColor}`} />
                <span className={`font-mono text-xs uppercase tracking-wider font-bold transition-colors duration-300 ${textColor}`}>
                  {link.label}
                </span>
                <span className="text-[10px] text-slate-500 text-center">{link.description}</span>
                <span className={`mt-1 text-[10px] font-mono ${isWorking ? 'text-teal-500' : 'text-red-400'}`}>
                  {isWorking ? '● working' : '✕ failed'}
                </span>
              </button>

              {!isLast && (
                <ChevronRight
                  className={`hidden sm:block w-5 h-5 mx-1 shrink-0 transition-colors duration-300 ${
                    isBroken ? 'text-red-500/40' : 'text-teal-500/40'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Outcome panel */}
      <div
        className={`rounded-xl border p-5 transition-colors duration-300 ${
          outcome.overallSecure
            ? 'border-teal-500/30 bg-teal-500/5'
            : 'border-red-500/30 bg-red-500/5'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          {outcome.overallSecure ? (
            <ShieldCheck className="w-5 h-5 text-teal-400" aria-hidden="true" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-red-400" aria-hidden="true" />
          )}
          <h4 className="font-heading font-bold text-sm text-slate-200">
            {outcome.overallSecure ? 'Chain intact — access is protected' : 'Chain broken — access is compromised'}
          </h4>
        </div>

        {/* Status indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Authenticated', value: outcome.authenticated },
            { label: 'Session valid', value: outcome.sessionValid },
            { label: 'Authorized', value: outcome.authorized },
            { label: 'Secure', value: outcome.overallSecure },
          ].map(indicator => (
            <div
              key={indicator.label}
              className={`px-3 py-2 rounded-lg text-center text-xs font-mono ${
                indicator.value
                  ? 'bg-teal-500/15 text-teal-400'
                  : 'bg-red-500/15 text-red-400'
              }`}
            >
              {indicator.value ? '✓' : '✕'} {indicator.label}
            </div>
          ))}
        </div>

        {/* Failure description */}
        {outcome.failureDescription && (
          <p className="text-sm text-slate-300 leading-relaxed">
            {outcome.failureDescription}
          </p>
        )}
      </div>

      {/* What this teaches */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <h4 className="font-heading text-sm font-bold text-cyan-300">What this teaches</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Authentication sits inside an access chain. A valid login is necessary, but it is only one
          link. Session management preserves continuity after verification, and authorization decides
          which actions the account may perform. Failure at any link can undermine the full
          protection.
          <span className="font-mono text-[10px] text-slate-500 ml-1">(Slide 5)</span>
        </p>
      </div>
    </div>
  )
}
