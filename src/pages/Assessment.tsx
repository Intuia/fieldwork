import { useEffect } from 'react'
import { useProgress } from '../hooks/useProgress'
import { assessmentWorkflow, caseAnalyses, ethicsBanner } from '../content/assessment'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { CalloutBox } from '../components/ui/CalloutBox'
import { StepFlow } from '../components/ui/StepFlow'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import { AlertTriangle, Search, FileCheck, ClipboardList } from 'lucide-react'

export default function Assessment() {
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited('assessment')
    document.title = 'Assessment — Ch. 6'
  }, [markVisited])

  // The safe assessment workflow steps (derived from slide 45)
  const workflowSteps = [
    { label: 'Inventory', description: 'Map all auth paths' },
    { label: 'Compare', description: 'Test success/failure behavior' },
    { label: 'Inspect', description: 'State, limits, tokens' },
    { label: 'Document', description: 'Evidence & mitigations' },
  ]

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Safe Assessment Workflow"
        subtitle={assessmentWorkflow.subtitle}
        badge={<Badge variant="defense">Assessment</Badge>}
      />

      {/* Ethics banner — prominent */}
      <div className="p-5 bg-amber-500/10 border-2 border-amber-500/40 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h3 className="font-heading font-bold text-amber-400 mb-1">Authorized Testing Only</h3>
          <p className="text-sm text-amber-300/80">{ethicsBanner.text}</p>
        </div>
      </div>

      {/* Workflow steps visualization */}
      <section>
        <h2 className="text-xl font-heading font-bold text-slate-100 mb-4">Assessment Workflow</h2>
        <StepFlow steps={workflowSteps.map(step => ({ ...step, active: true }))} className="mb-6" />

        <Card>
          <ol className="space-y-3">
            {assessmentWorkflow.points.map((point, index) => {
              // Choose an icon for each step
              let IconComponent = Search
              if (index === 0) {
                IconComponent = ClipboardList
              } else if (index === 1) {
                IconComponent = Search
              } else if (index === 2) {
                IconComponent = FileCheck
              } else if (index === 3) {
                IconComponent = FileCheck
              }

              return (
                <li key={index} className="flex gap-3 text-sm text-slate-300">
                  <IconComponent className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              )
            })}
          </ol>
          <div className="mt-3 text-right">
            <span className="font-mono text-[10px] text-slate-500">Slide {assessmentWorkflow.slideRef}</span>
          </div>
        </Card>
      </section>

      {/* Case analyses */}
      <section>
        <h2 className="text-xl font-heading font-bold text-slate-100 mb-4">Worked Case Analyses</h2>
        <div className="space-y-6">
          {caseAnalyses.map((caseStudy, caseIndex) => (
            <Card key={caseStudy.id} glowing>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-mono text-[10px] text-teal-500 uppercase tracking-wider mb-1">
                    Case {caseIndex + 1}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-100">{caseStudy.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{caseStudy.subtitle}</p>
                </div>
                <Badge variant="attack-pattern">Analysis</Badge>
              </div>

              <div className="space-y-3 mt-4">
                {caseStudy.points.map((point, pointIndex) => {
                  // First 2 points are the analysis steps, last 2 are impact/mitigation
                  if (pointIndex < 2) {
                    return (
                      <div key={pointIndex} className="flex gap-3 text-sm text-slate-300">
                        <span className="font-mono text-xs text-cyan-500 mt-0.5 shrink-0">
                          {String(pointIndex + 1).padStart(2, '0')}
                        </span>
                        <span>{point}</span>
                      </div>
                    )
                  } else if (pointIndex === 2) {
                    return (
                      <CalloutBox key={pointIndex} type="impact" title="Impact">
                        {point}
                      </CalloutBox>
                    )
                  } else {
                    return (
                      <CalloutBox key={pointIndex} type="fix" title="Mitigation">
                        {point}
                      </CalloutBox>
                    )
                  }
                })}
              </div>

              <div className="mt-3 text-right">
                <span className="font-mono text-[10px] text-slate-500">Slide {caseStudy.slideRef}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <PrevNextNav
        prev={{ path: '/defenses', label: 'Defenses' }}
        next={{ path: '/then-vs-now', label: 'Then vs Now' }}
      />
    </div>
  )
}
