import { useState } from 'react'
import { timelineData } from './server'
import { Info, RotateCcw, HelpCircle } from 'lucide-react'

const MIN_YEAR = 2011
const MAX_YEAR = 2025

function getYearLabel(year: number): string {
  if (year <= 2013) {
    return '2011 — At Publication'
  } else if (year <= 2019) {
    return '~2017 — Transition Era'
  } else {
    return '2025 — Current Landscape'
  }
}

function getYearColor(year: number): string {
  if (year <= 2013) {
    return 'text-amber-400'
  } else if (year <= 2019) {
    return 'text-cyan-400'
  } else {
    return 'text-teal-400'
  }
}

function getBarWidth(year: number): string {
  const fraction = ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
  return `${fraction}%`
}

export function ThenVsNowSliderLab() {
  const [year, setYear] = useState(MIN_YEAR)
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    setYear(parseInt(e.target.value, 10))
  }

  function handleReset() {
    setYear(MIN_YEAR)
    setHoveredTopic(null)
  }

  const yearLabel = getYearLabel(year)
  const yearColor = getYearColor(year)

  return (
    <div className="space-y-6">
      {/* What this teaches */}
      <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <h3 className="font-heading font-bold text-sm text-cyan-400">What this teaches</h3>
        </div>
        <p className="text-xs text-slate-400">
          Security objectives endure, but recommended controls evolve with evidence, technology,
          and real-world deployment experience. Move the slider to see how guidance changed
          from 2011 to 2025. (Slides 50–58)
        </p>
      </div>

      {/* Year slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-amber-400">2011</span>
          <span className={`font-heading font-bold text-lg ${yearColor}`}>{yearLabel}</span>
          <span className="font-mono text-xs text-teal-400">2025</span>
        </div>

        {/* Slider track with gradient */}
        <div className="relative">
          <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full bg-navy-700 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: getBarWidth(year),
                background: 'linear-gradient(90deg, #f59e0b, #22d3ee, #14b8a6)',
              }}
            />
          </div>
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={year}
            onChange={handleSliderChange}
            className="relative w-full h-6 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-navy-900 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(20,184,166,0.5)]"
            aria-label="Timeline year selector"
          />
        </div>

        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-bold text-slate-100">{year}</span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 border border-[var(--border-subtle)] text-slate-400 text-xs rounded-lg hover:bg-navy-700/50 transition-colors"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* Topic cards with morphing recommendations */}
      <div className="space-y-4">
        {timelineData.map(topic => {
          // Find the recommendation active at the current year
          let activeRec = topic.recommendations[0]
          for (const rec of topic.recommendations) {
            if (rec.year <= year) {
              activeRec = rec
            }
          }

          const isHovered = hoveredTopic === topic.topic

          return (
            <div
              key={topic.topic}
              className="p-4 bg-navy-800 border border-[var(--border-subtle)] rounded-lg hover:border-teal-500/30 transition-all"
              onMouseEnter={() => setHoveredTopic(topic.topic)}
              onMouseLeave={() => setHoveredTopic(null)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-heading font-bold text-sm text-slate-200">{topic.topic}</h3>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                  activeRec.year <= 2013
                    ? 'bg-amber-500/15 text-amber-400'
                    : activeRec.year <= 2019
                    ? 'bg-cyan-500/15 text-cyan-400'
                    : 'bg-teal-500/15 text-teal-400'
                }`}>
                  {activeRec.year}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{activeRec.text}</p>

              {/* "Why it changed" tooltip */}
              {activeRec.whyChanged && (
                <div className={`mt-3 overflow-hidden transition-all duration-300 ${
                  isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="flex items-start gap-2 p-3 bg-navy-700/50 rounded border border-[var(--border-subtle)]">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider">Why it changed</span>
                      <p className="text-xs text-slate-400 mt-1">{activeRec.whyChanged}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show the "why it changed" hint if not hovered */}
              {activeRec.whyChanged && !isHovered && (
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  Hover for &ldquo;why it changed&rdquo;
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Timeline markers */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-2">
        <span>Handbook published</span>
        <span>NIST 800-63-3</span>
        <span>NIST 800-63-4 final</span>
      </div>
    </div>
  )
}
