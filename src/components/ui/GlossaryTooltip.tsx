import { useState, useRef, useEffect, type ReactNode } from 'react'

interface GlossaryTooltipProps {
  term: string
  definition: string
  children: ReactNode
}

export function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<'above' | 'below'>('above')
  const triggerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      // If there isn't enough space above, show below
      if (rect.top < 120) {
        setPosition('below')
      } else {
        setPosition('above')
      }
    }
  }, [isVisible])

  return (
    <span
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span
        className="border-b border-dotted border-teal-500/50 cursor-help text-teal-400"
        tabIndex={0}
        role="button"
        aria-describedby={`tooltip-${term}`}
      >
        {children}
      </span>

      {isVisible && (
        <span
          id={`tooltip-${term}`}
          role="tooltip"
          className={`absolute left-1/2 -translate-x-1/2 z-50 w-64 px-3 py-2 text-xs text-slate-200 bg-navy-700 border border-[var(--border-subtle)] rounded-lg shadow-lg ${
            position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          <span className="font-mono text-teal-400 font-bold block mb-1">{term}</span>
          <span className="text-slate-300 leading-relaxed block">{definition}</span>
        </span>
      )}
    </span>
  )
}
