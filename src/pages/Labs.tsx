import { useEffect, useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import { AccessChainLab } from '../labs/lab1-access-chain/Lab'
import { EnumerationLab } from '../labs/lab2-enumeration/Lab'
import { RateLimitLab } from '../labs/lab3-rate-limit/Lab'
import { MultistageLab } from '../labs/lab4-multistage/Lab'
import { PasswordStorageLab } from '../labs/lab5-password-storage/Lab'
import { PolicyCheckerLab } from '../labs/lab6-policy-checker/Lab'
import { MfaSorterLab } from '../labs/lab7-mfa-sorter/Lab'
import { ThenVsNowSliderLab } from '../labs/lab8-then-vs-now-slider/Lab'
import { AlertTriangle } from 'lucide-react'

const LABS = [
  { id: 1, name: 'Access Chain Explorer', component: AccessChainLab },
  { id: 2, name: 'Enumeration Comparator', component: EnumerationLab },
  { id: 3, name: 'Rate-Limit Simulator', component: RateLimitLab },
  { id: 4, name: 'Multistage State Machine', component: MultistageLab },
  { id: 5, name: 'Password Storage Cost', component: PasswordStorageLab },
  { id: 6, name: 'Policy Checker', component: PolicyCheckerLab },
  { id: 7, name: 'MFA Factor Sorter', component: MfaSorterLab },
  { id: 8, name: 'Then-vs-Now Slider', component: ThenVsNowSliderLab },
]

export default function Labs() {
  const { markVisited } = useProgress()
  const [activeLabId, setActiveLabId] = useState(1)

  useEffect(() => {
    markVisited('labs')
    document.title = 'Interactive Labs — Ch. 6'
  }, [markVisited])

  const activeLab = LABS.find(l => l.id === activeLabId)
  const ActiveComponent = activeLab?.component

  return (
    <div className="animate-fade-in">
      <div className="mb-2">
        <span className="font-mono text-xs text-teal-500 uppercase tracking-wider">Interactive Labs</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-100 mb-3">
        Simulated Security Labs
      </h1>
      <p className="text-slate-400 mb-6">
        8 client-side labs — no real network requests, no real attack tooling.
      </p>

      {/* Lab selector tabs */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="tablist"
        aria-label="Lab selector"
      >
        {LABS.map(lab => {
          const isActive = lab.id === activeLabId
          return (
            <button
              key={lab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`lab-panel-${lab.id}`}
              id={`lab-tab-${lab.id}`}
              onClick={() => setActiveLabId(lab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                isActive
                  ? 'bg-teal-500/15 border border-teal-500/40 text-teal-300'
                  : 'bg-navy-800 border border-[var(--border-subtle)] text-slate-400 hover:border-teal-500/20 hover:text-slate-300'
              }`}
            >
              <span className="text-[10px] opacity-60 mr-1">{lab.id}.</span>
              {lab.name}
            </button>
          )
        })}
      </div>

      {/* Active lab panel */}
      <div
        role="tabpanel"
        id={`lab-panel-${activeLabId}`}
        aria-labelledby={`lab-tab-${activeLabId}`}
        className="p-5 sm:p-6 bg-navy-800/50 border border-[var(--border-subtle)] rounded-xl"
      >
        <h2 className="font-heading font-bold text-lg text-slate-100 mb-4">
          <span className="font-mono text-teal-500 text-sm mr-2">Lab {activeLabId}</span>
          {activeLab?.name}
        </h2>
        {ActiveComponent && <ActiveComponent />}
      </div>

      {/* Ethics banner */}
      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
        <p className="text-amber-400 text-xs font-mono">
          Authorized testing only — all simulations run client-side with no external connections.
        </p>
      </div>

      <div className="mt-8">
        <PrevNextNav
          prev={{ path: '/then-vs-now', label: 'Then vs Now' }}
          next={{ path: '/quiz', label: 'Quiz' }}
        />
      </div>
    </div>
  )
}
