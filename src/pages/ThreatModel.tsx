import { useEffect, useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { threatModelIntro, threatMappings } from '../content/threatModel'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import { Badge } from '../components/ui/Badge'
import { Globe, Monitor, Database, LifeBuoy, ArrowRight } from 'lucide-react'

// Map each threat mapping id to an icon and extra detail text
function getThreatConfig(id: string) {
  if (id === 'online-oracle') {
    return {
      icon: Globe,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      glowColor: 'shadow-[0_0_12px_rgba(248,113,113,0.3)]',
      detail: 'An application that lets anyone submit credentials and distinguishes success from failure acts as a password-testing oracle. Attackers use this to guess, spray common passwords across accounts, stuff leaked credentials, or enumerate valid usernames — all remotely and at scale.',
    }
  } else if (id === 'client-controlled-state') {
    return {
      icon: Monitor,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      glowColor: 'shadow-[0_0_12px_rgba(251,191,36,0.3)]',
      detail: 'When authentication progress, challenge selection, or account identity is stored in hidden fields, cookies, or query parameters, the client can tamper with it. This enables skipping login stages, replaying previously correct answers, or substituting a different account mid-flow.',
    }
  } else if (id === 'database-disclosure') {
    return {
      icon: Database,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-[0_0_12px_rgba(192,132,252,0.3)]',
      detail: 'A read of the credential database gives attackers password hashes. With fast or unsalted hashes, offline cracking recovers most passwords cheaply. Those passwords are then reused against other services where users chose the same credential.',
    }
  } else {
    return {
      icon: LifeBuoy,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      glowColor: 'shadow-[0_0_12px_rgba(103,232,249,0.3)]',
      detail: 'Recovery flows, support impersonation, and fallback paths provide alternative routes into an account. If these paths require less evidence than primary login, they become the weakest link — an attacker bypasses the strong authenticator entirely by targeting the easier recovery mechanism.',
    }
  }
}

export default function ThreatModel() {
  const { markVisited } = useProgress()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    markVisited('threat-model')
    document.title = 'Threat Model — Ch. 6'
  }, [markVisited])

  function handleCardClick(id: string) {
    if (selectedId === id) {
      setSelectedId(null)
    } else {
      setSelectedId(id)
    }
  }

  const selectedMapping = threatMappings.find(m => m.id === selectedId)
  const selectedConfig = selectedId ? getThreatConfig(selectedId) : null

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title={threatModelIntro.title}
        subtitle={threatModelIntro.subtitle}
        badge={<Badge variant="attack-pattern">Threat Model</Badge>}
      />

      {/* Instructional text */}
      <p className="text-sm text-slate-400">
        Click a card to explore how each weakness translates to attacker capability.
      </p>

      {/* Interactive 2x2 threat mapping grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {threatMappings.map((mapping) => {
          const config = getThreatConfig(mapping.id)
          const IconComponent = config.icon
          const isSelected = selectedId === mapping.id

          return (
            <button
              key={mapping.id}
              onClick={() => handleCardClick(mapping.id)}
              className={`group relative p-5 rounded-xl border text-left transition-all duration-300 ${
                isSelected
                  ? `${config.borderColor} ${config.bgColor} ${config.glowColor}`
                  : 'border-[var(--border-subtle)] bg-navy-800 hover:bg-navy-700/50'
              }`}
              aria-pressed={isSelected}
              aria-label={`${mapping.weakness} leads to ${mapping.attackerCapability}`}
            >
              {/* Weakness side */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <IconComponent
                    className={`w-5 h-5 ${config.color}`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                    Weakness
                  </div>
                  <div className="font-heading font-bold text-sm text-slate-200">
                    {mapping.weakness}
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              <div className="flex items-center gap-2 mb-4 pl-2">
                <div className={`w-8 h-px ${isSelected ? 'bg-teal-500' : 'bg-slate-600'} transition-colors`} />
                <ArrowRight
                  className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-600'} transition-colors`}
                  aria-hidden="true"
                />
              </div>

              {/* Capability side */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="font-mono text-xs text-teal-400 font-bold">!</span>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                    Attacker capability
                  </div>
                  <div className="text-sm text-teal-300">
                    {mapping.attackerCapability}
                  </div>
                </div>
              </div>

              {/* Subtle selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Expanded detail panel for selected mapping */}
      {selectedMapping && selectedConfig && (
        <Card glowing className="border-l-4 border-l-teal-500">
          <div className="flex items-center gap-3 mb-3">
            {(() => {
              const IconComponent = selectedConfig.icon
              return (
                <IconComponent
                  className={`w-5 h-5 ${selectedConfig.color}`}
                  aria-hidden="true"
                />
              )
            })()}
            <h3 className="font-heading font-bold text-slate-100">
              {selectedMapping.weakness}
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span className="text-sm text-teal-400">
              {selectedMapping.attackerCapability}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedConfig.detail}
          </p>
          <div className="mt-3 text-right">
            <span className="font-mono text-[10px] text-slate-500">
              Slide {selectedMapping.slideRef}
            </span>
          </div>
        </Card>
      )}

      {/* Summary of the intro points */}
      <Card>
        <h3 className="font-heading text-base font-bold text-slate-200 mb-3">
          Four categories of authentication weakness
        </h3>
        <ol className="space-y-2">
          {threatModelIntro.points.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-300">
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 text-right">
          <span className="font-mono text-[10px] text-slate-500">
            Slide {threatModelIntro.slideRef}
          </span>
        </div>
      </Card>

      <PrevNextNav
        prev={{ path: '/implementation-flaws', label: 'Implementation Flaws' }}
        next={{ path: '/defenses', label: 'Defenses' }}
      />
    </div>
  )
}
