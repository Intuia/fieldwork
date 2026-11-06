interface Step {
  label: string
  description?: string
  active?: boolean
  failed?: boolean
}

interface StepFlowProps {
  steps: Step[]
  className?: string
}

export function StepFlow({ steps, className = '' }: StepFlowProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-stretch gap-0 ${className}`} role="list" aria-label="Process steps">
      {steps.map((step, index) => {
        let dotColor = 'bg-slate-500'
        let borderColor = 'border-[var(--border-subtle)]'
        let textColor = 'text-slate-400'
        let labelColor = 'text-slate-300'

        if (step.failed) {
          dotColor = 'bg-red-500'
          borderColor = 'border-red-500/30'
          textColor = 'text-red-400'
          labelColor = 'text-red-300'
        } else if (step.active) {
          dotColor = 'bg-teal-500'
          borderColor = 'border-teal-500/30'
          textColor = 'text-teal-400'
          labelColor = 'text-teal-300'
        }

        const isLast = index === steps.length - 1

        return (
          <div key={step.label} className="flex sm:flex-1 items-center" role="listitem">
            <div className={`flex-1 flex flex-col items-center px-3 py-3 rounded-lg border ${borderColor} bg-navy-800`}>
              <div className={`w-3 h-3 rounded-full ${dotColor} mb-2`} aria-hidden="true" />
              <div className={`font-mono text-xs uppercase tracking-wider ${labelColor} text-center`}>
                {step.label}
              </div>
              {step.description && (
                <div className={`text-xs ${textColor} mt-1 text-center`}>
                  {step.description}
                </div>
              )}
            </div>
            {!isLast && (
              <div className="hidden sm:block w-6 h-px bg-[var(--border-subtle)] shrink-0" aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
