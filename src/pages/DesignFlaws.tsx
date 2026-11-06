import { useEffect } from 'react'
import { useProgress } from '../hooks/useProgress'
import { designFlawsIntro, designFlaws, designFlawsRecap } from '../content/designFlaws'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { CalloutBox } from '../components/ui/CalloutBox'
import { Accordion } from '../components/ui/Accordion'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import type { DesignFlaw } from '../content/types'

// Map each flaw type to the Badge variant name
function getBadgeVariant(flawType: DesignFlaw['flawType']) {
  if (flawType === 'design-flaw') {
    return 'design-flaw' as const
  } else if (flawType === 'attack-pattern') {
    return 'attack-pattern' as const
  } else if (flawType === 'defense-design') {
    return 'defense' as const
  } else {
    return 'info-leakage' as const
  }
}

// Human-readable badge label
function getBadgeLabel(flawType: DesignFlaw['flawType']) {
  if (flawType === 'design-flaw') {
    return 'Design Flaw'
  } else if (flawType === 'attack-pattern') {
    return 'Attack Pattern'
  } else if (flawType === 'defense-design') {
    return 'Defense Design'
  } else {
    return 'Info Leakage'
  }
}

export default function DesignFlaws() {
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited('design-flaws')
    document.title = 'Design Flaws — Ch. 6'
  }, [markVisited])

  // Build accordion items from the design flaws data
  const accordionItems = designFlaws.map((flaw) => {
    const expandedContent = (
      <div className="space-y-4">
        {/* Subtitle */}
        <p className="text-sm text-slate-400 italic">{flaw.subtitle}</p>

        {/* Three callout boxes: what goes wrong, attacker outcome, fix */}
        <CalloutBox type="attack" title="What goes wrong">
          {flaw.whatGoesWrong}
        </CalloutBox>

        <CalloutBox type="impact" title="Attacker outcome">
          {flaw.attackerOutcome}
        </CalloutBox>

        <CalloutBox type="fix" title="Fix">
          {flaw.fix}
        </CalloutBox>

        {/* Numbered slide points for reference */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
          <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-2">
            Slide points
          </h4>
          <ol className="space-y-1.5">
            {flaw.points.map((point, pointIndex) => (
              <li key={pointIndex} className="flex gap-2 text-xs text-slate-400">
                <span className="font-mono text-teal-500/60 shrink-0">
                  {pointIndex + 1}.
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Slide reference */}
        <div className="text-right">
          <span className="font-mono text-[10px] text-slate-500">Slide {flaw.slideRef}</span>
        </div>
      </div>
    )

    return {
      id: flaw.id,
      title: flaw.title,
      badge: (
        <Badge variant={getBadgeVariant(flaw.flawType)}>
          {getBadgeLabel(flaw.flawType)}
        </Badge>
      ),
      content: expandedContent,
    }
  })

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title={designFlawsIntro.title}
        subtitle={designFlawsIntro.subtitle}
        badge={
          <Badge variant="design-flaw">Design Flaws</Badge>
        }
      />

      {/* Intro section points */}
      <Card>
        <p className="text-sm text-slate-400 mb-3 italic">{designFlawsIntro.subtitle}</p>
        <ul className="space-y-2">
          {designFlawsIntro.points.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-300">
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slide {designFlawsIntro.slideRef}</span>
        </div>
      </Card>

      {/* All design flaw accordions */}
      <section>
        <h2 className="text-xl font-heading font-bold text-slate-100 mb-4">
          {designFlaws.length} design flaws
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Click each flaw to see what goes wrong, attacker outcome, and the fix.
        </p>
        <Accordion items={accordionItems} />
      </section>

      {/* Recap card */}
      <Card glowing>
        <h3 className="font-heading text-lg font-bold text-slate-100 mb-1">
          {designFlawsRecap.title}
        </h3>
        <p className="text-sm text-slate-400 mb-3 italic">{designFlawsRecap.subtitle}</p>
        <ul className="space-y-2">
          {designFlawsRecap.points.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-300">
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slide {designFlawsRecap.slideRef}</span>
        </div>
      </Card>

      <PrevNextNav
        prev={{ path: '/technologies', label: 'Technologies' }}
        next={{ path: '/implementation-flaws', label: 'Implementation Flaws' }}
      />
    </div>
  )
}
