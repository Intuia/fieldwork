import { useEffect } from 'react'
import { useProgress } from '../hooks/useProgress'
import { updateModuleIntro, thenVsNowItems, comparisonPairs } from '../content/thenVsNow'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ComparisonTable } from '../components/ui/ComparisonTable'
import { Accordion } from '../components/ui/Accordion'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import { Clock, TrendingUp, ArrowRightLeft } from 'lucide-react'

export default function ThenVsNow() {
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited('then-vs-now')
    document.title = 'Then vs Now — Ch. 6'
  }, [markVisited])

  // Separate items by category for structured display
  const historicalItems = thenVsNowItems.filter(item => item.tag === 'historical')
  const evolutionItems = thenVsNowItems.filter(item => item.tag === 'evolution')
  const currentItems = thenVsNowItems.filter(item => item.tag === 'updated-practice')
  const implicationItems = thenVsNowItems.filter(item => item.tag === 'implications')

  // Build accordion for the "current landscape" detailed items
  const currentAccordionItems = currentItems.map(item => ({
    id: item.id,
    title: item.title,
    badge: <Badge variant="updated">Updated Practice</Badge>,
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-400 italic">{item.subtitle}</p>
        <ol className="space-y-2">
          {item.points.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-300">
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ol>
        <div className="text-right">
          <span className="font-mono text-[10px] text-slate-500">Slide {item.slideRef}</span>
        </div>
      </div>
    ),
  }))

  // Build comparison table rows
  const comparisonRows = comparisonPairs.map(pair => ({
    label: pair.topic,
    left: pair.then,
    right: pair.now,
  }))

  return (
    <div className="animate-fade-in space-y-10">
      <PageHeader
        title="Then vs Now: 2011 to Current Landscape"
        subtitle={updateModuleIntro.subtitle}
        badge={<Badge variant="updated">Update Module</Badge>}
      />

      {/* Intro */}
      <Card>
        <ol className="space-y-2">
          {updateModuleIntro.points.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-300">
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slide {updateModuleIntro.slideRef}</span>
        </div>
      </Card>

      {/* Historical Frame */}
      {historicalItems.map(item => (
        <section key={item.id}>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <h2 className="text-xl font-heading font-bold text-slate-100">{item.title}</h2>
            <Badge variant="attack-pattern">Historical</Badge>
          </div>
          <Card>
            <p className="text-sm text-slate-400 italic mb-3">{item.subtitle}</p>
            <ol className="space-y-2">
              {item.points.map((point, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-300">
                  <span className="font-mono text-xs text-amber-400 mt-0.5 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 text-right">
              <span className="font-mono text-[10px] text-slate-500">Slide {item.slideRef}</span>
            </div>
          </Card>
        </section>
      ))}

      {/* What Changed */}
      {evolutionItems.map(item => (
        <section key={item.id}>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            <h2 className="text-xl font-heading font-bold text-slate-100">{item.title}</h2>
            <Badge variant="info-leakage">Evolution</Badge>
          </div>
          <Card>
            <p className="text-sm text-slate-400 italic mb-3">{item.subtitle}</p>
            <ol className="space-y-2">
              {item.points.map((point, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-300">
                  <span className="font-mono text-xs text-cyan-400 mt-0.5 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 text-right">
              <span className="font-mono text-[10px] text-slate-500">Slide {item.slideRef}</span>
            </div>
          </Card>
        </section>
      ))}

      {/* Current Landscape (accordion) */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-teal-400" aria-hidden="true" />
          <h2 className="text-xl font-heading font-bold text-slate-100">Current Landscape</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Click each topic to see the current guidance. Each is tagged as an updated practice.
        </p>
        <Accordion items={currentAccordionItems} />
      </section>

      {/* Side-by-side comparison table */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <ArrowRightLeft className="w-5 h-5 text-teal-400" aria-hidden="true" />
          <h2 className="text-xl font-heading font-bold text-slate-100">Side-by-Side Comparison</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          The security objective persists as recommended controls change.
        </p>
        <ComparisonTable
          leftHeader="2011 (At Publication)"
          rightHeader="Current Landscape"
          rows={comparisonRows}
        />

        {/* Enduring principles */}
        <div className="mt-6">
          <h3 className="font-heading font-bold text-slate-200 mb-3">Enduring Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {comparisonPairs.map((pair, index) => (
              <div
                key={index}
                className="p-4 bg-navy-800 border border-teal-500/20 rounded-lg"
              >
                <Badge variant="enduring" className="mb-2">Enduring</Badge>
                <div className="font-heading font-bold text-sm text-slate-200 mt-2">{pair.topic}</div>
                <p className="text-xs text-teal-400 mt-1">{pair.enduring}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Implications */}
      {implicationItems.map(item => (
        <section key={item.id}>
          <h2 className="text-xl font-heading font-bold text-slate-100 mb-4">{item.title}</h2>
          <Card glowing>
            <p className="text-sm text-slate-400 italic mb-3">{item.subtitle}</p>
            <ol className="space-y-2.5">
              {item.points.map((point, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-300">
                  <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 text-right">
              <span className="font-mono text-[10px] text-slate-500">Slide {item.slideRef}</span>
            </div>
          </Card>
        </section>
      ))}

      <PrevNextNav
        prev={{ path: '/assessment', label: 'Assessment' }}
        next={{ path: '/labs', label: 'Interactive Labs' }}
      />
    </div>
  )
}
