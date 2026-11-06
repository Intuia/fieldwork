import { useEffect } from 'react'
import { useProgress } from '../hooks/useProgress'
import { technologiesIntro, technologies, mfaRule } from '../content/technologies'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { CalloutBox } from '../components/ui/CalloutBox'
import { Tabs } from '../components/ui/Tabs'
import { PrevNextNav } from '../components/ui/PrevNextNav'

export default function Technologies() {
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited('technologies')
    document.title = 'Authentication Technologies — Ch. 6'
  }, [markVisited])

  // Build the tab for each technology, with the MFA tab getting a special callout
  const technologyTabs = technologies.map((tech) => {
    // Pick a short label for each tab
    let tabLabel = tech.title
    if (tech.slideRef === 7) {
      tabLabel = 'Forms Login'
    } else if (tech.slideRef === 8) {
      tabLabel = 'Multifactor'
    } else if (tech.slideRef === 9) {
      tabLabel = 'Certs & Integrated'
    } else if (tech.slideRef === 10) {
      tabLabel = 'Federated Auth'
    }

    const tabContent = (
      <div className="space-y-4">
        <Card glowing>
          <h3 className="font-heading text-lg font-bold text-slate-100 mb-1">
            {tech.title}
          </h3>
          <p className="text-sm text-slate-400 mb-4">{tech.subtitle}</p>
          <ol className="space-y-2">
            {tech.points.map((point, pointIndex) => (
              <li key={pointIndex} className="flex gap-3 text-sm text-slate-300">
                <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                  {String(pointIndex + 1).padStart(2, '0')}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 text-right">
            <span className="font-mono text-[10px] text-slate-500">Slide {tech.slideRef}</span>
          </div>
        </Card>

        {/* Show the MFA warning callout only on the multifactor tab */}
        {tech.slideRef === 8 && (
          <CalloutBox type="warning" title="Not all multi-prompt logins are MFA">
            {mfaRule.text}
          </CalloutBox>
        )}
      </div>
    )

    return {
      id: `tech-${tech.slideRef}`,
      label: tabLabel,
      content: tabContent,
    }
  })

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title={technologiesIntro.title}
        subtitle={technologiesIntro.subtitle}
        badge={
          <Badge variant="enduring">Technology Map</Badge>
        }
      />

      {/* Overview points from the intro slide */}
      <Card>
        <h3 className="font-heading text-base font-bold text-slate-200 mb-3">Chapter overview</h3>
        <ul className="space-y-2">
          {technologiesIntro.points.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-300">
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slide {technologiesIntro.slideRef}</span>
        </div>
      </Card>

      {/* Tabbed technology details */}
      <section>
        <h2 className="text-xl font-heading font-bold text-slate-100 mb-4">Technology details</h2>
        <Tabs tabs={technologyTabs} />
      </section>

      <PrevNextNav
        prev={{ path: '/', label: 'Home' }}
        next={{ path: '/design-flaws', label: 'Design Flaws' }}
      />
    </div>
  )
}
