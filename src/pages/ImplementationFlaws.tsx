import { useEffect } from 'react'
import { useProgress } from '../hooks/useProgress'
import { implementationFlawsIntro, implementationFlaws } from '../content/implementationFlaws'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { CalloutBox } from '../components/ui/CalloutBox'
import { PrevNextNav } from '../components/ui/PrevNextNav'

// Map the section string to a readable badge label
function getSectionLabel(section: string): string {
  if (section === 'IMPLEMENTATION FLAW') {
    return 'Implementation Flaw'
  } else if (section === 'STATE MODEL') {
    return 'State Model'
  } else if (section === 'PROCEDURE') {
    return 'Procedure'
  } else {
    return section
  }
}

export default function ImplementationFlaws() {
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited('implementation-flaws')
    document.title = 'Implementation Flaws — Ch. 6'
  }, [markVisited])

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title={implementationFlawsIntro.title}
        subtitle={implementationFlawsIntro.subtitle}
        badge={<Badge variant="implementation-flaw">Implementation Flaws</Badge>}
      />

      {/* Intro card with overview points */}
      <Card>
        <h3 className="font-heading text-base font-bold text-slate-200 mb-3">
          Section overview
        </h3>
        <ol className="space-y-2">
          {implementationFlawsIntro.points.map((point, index) => (
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
            Slide {implementationFlawsIntro.slideRef}
          </span>
        </div>
      </Card>

      {/* Each implementation flaw as a card */}
      <section className="space-y-6">
        <h2 className="text-xl font-heading font-bold text-slate-100">
          {implementationFlaws.length} implementation flaws
        </h2>

        {implementationFlaws.map((flaw) => (
          <Card key={flaw.id} glowing>
            {/* Header with badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-100">
                  {flaw.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1 italic">{flaw.subtitle}</p>
              </div>
              <Badge variant="implementation-flaw">{getSectionLabel(flaw.section)}</Badge>
            </div>

            {/* Special callout for multistage state machine */}
            {flaw.slideRef === 29 && (
              <div className="mb-4">
                <CalloutBox type="attack" title="Client state is not authoritative">
                  Hidden fields, cookies, and query parameters are not authoritative progress.
                  An attacker can modify these values to skip stages, replay earlier steps,
                  or substitute a different account mid-flow.
                </CalloutBox>
              </div>
            )}

            {/* Special callout for credential storage */}
            {flaw.slideRef === 32 && (
              <div className="mb-4">
                <CalloutBox type="warning" title="Fast hashes are insufficient">
                  Fast general hashes make offline guesses cheap. A database leak with
                  unsalted or fast-hashed passwords lets attackers crack credentials at
                  billions of guesses per second using commodity hardware.
                </CalloutBox>
              </div>
            )}

            {/* Numbered points */}
            <ol className="space-y-2.5">
              {flaw.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex gap-3 text-sm text-slate-300">
                  <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                    {String(pointIndex + 1).padStart(2, '0')}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>

            {/* Slide reference */}
            <div className="mt-4 text-right">
              <span className="font-mono text-[10px] text-slate-500">
                Slide {flaw.slideRef}
              </span>
            </div>
          </Card>
        ))}
      </section>

      <PrevNextNav
        prev={{ path: '/design-flaws', label: 'Design Flaws' }}
        next={{ path: '/threat-model', label: 'Threat Model' }}
      />
    </div>
  )
}
