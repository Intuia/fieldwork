import { useState, useEffect, useMemo, useCallback } from 'react'
import { useProgress } from '../hooks/useProgress'
import { checklistItems } from '../content/checklist'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import { CheckSquare, ChevronDown, Copy, Check, RotateCcw } from 'lucide-react'

const STORAGE_KEY = 'ch6-checklist-state'

function loadCheckedState(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed: unknown = JSON.parse(saved)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return Object.fromEntries(
          checklistItems.map(item => [item.id, (parsed as Record<string, unknown>)[item.id] === true]),
        )
      }
    }
  } catch {
    // ignore
  }
  return {}
}

export default function Checklist() {
  const { markVisited } = useProgress()
  const [checked, setChecked] = useState<Record<string, boolean>>(loadCheckedState)
  const [copied, setCopied] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    markVisited('checklist')
    document.title = 'Review Checklist — Ch. 6'
  }, [markVisited])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
    } catch {
      // Keep the checklist usable when browser storage is unavailable.
    }
  }, [checked])

  const toggle = useCallback((id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const handleReset = useCallback(() => {
    setChecked({})
  }, [])

  const toggleCategory = useCallback((name: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const categories = useMemo(() => {
    const cats: { name: string; items: typeof checklistItems }[] = []
    const seen = new Set<string>()
    for (const item of checklistItems) {
      if (!seen.has(item.category)) {
        seen.add(item.category)
        cats.push({ name: item.category, items: [] })
      }
      cats.find(c => c.name === item.category)!.items.push(item)
    }
    return cats
  }, [])

  const totalItems = checklistItems.length
  const totalChecked = checklistItems.filter(item => checked[item.id]).length
  const progressPercent = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0

  const copyAsMarkdown = useCallback(async () => {
    const lines: string[] = ['# Authentication Review Checklist (Ch. 6)', '']
    for (const cat of categories) {
      lines.push(`## ${cat.name}`)
      for (const item of cat.items) {
        const mark = checked[item.id] ? 'x' : ' '
        lines.push(`- [${mark}] ${item.text}`)
      }
      lines.push('')
    }
    lines.push(`---`)
    lines.push(`${totalChecked}/${totalItems} completed`)

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = lines.join('\n')
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [categories, checked, totalChecked, totalItems])

  return (
    <div className="animate-fade-in">
      <div className="mb-2">
        <span className="font-mono text-xs text-teal-500 uppercase tracking-wider">Checklist</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-100 mb-3">
        Authentication Review Checklist
      </h1>
      <p className="text-slate-400 mb-6">
        Expand a category and check each item as you review your website. Your progress is saved on this device when browser storage is available.
      </p>

      {/* Progress bar + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 p-4 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-slate-400">{totalChecked}/{totalItems} completed</span>
            <span className="font-mono text-teal-400">{Math.round(progressPercent)}%</span>
          </div>
          <div role="progressbar" aria-label="Checklist completion" aria-valuenow={totalChecked} aria-valuemin={0} aria-valuemax={totalItems} className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100 ? 'bg-green-500' : 'bg-teal-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyAsMarkdown}
            className="min-h-11 flex items-center justify-center gap-1.5 px-3 py-2 border border-cyan-500/30 text-cyan-400 text-xs rounded-lg hover:bg-cyan-500/10 transition-colors"
          >
            {copied ? <Check className="w-3 h-3" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy as Markdown'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-11 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-500/30 text-slate-400 text-xs rounded-lg hover:bg-slate-500/10 transition-colors"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* Each category opens independently; checked state survives collapsing. */}
      <div className="space-y-3">
        {categories.map((cat, index) => {
          const catChecked = cat.items.filter(i => checked[i.id]).length
          const isExpanded = expandedCategories.has(cat.name)
          const triggerId = `checklist-category-${index}`
          const panelId = `checklist-panel-${index}`

          return (
            <section key={cat.name} className="bg-navy-800 rounded-xl border border-[var(--border-subtle)]">
              <h2>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full min-h-14 flex items-center gap-3 p-4 sm:p-5 rounded-xl text-left hover:bg-navy-700/50 transition-colors cursor-pointer"
                >
                  <span className="min-w-0 flex-1 font-heading font-bold text-base text-slate-200 break-words">
                    {cat.name}
                  </span>
                  <span className={`shrink-0 font-mono text-xs ${
                    catChecked === cat.items.length ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    <span className="sr-only">Completed: </span>{catChecked}/{cat.items.length}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-teal-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </h2>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!isExpanded}
                className="border-t border-[var(--border-subtle)] p-2 sm:p-3"
              >
                <ul className="space-y-1">
                  {cat.items.map(item => {
                    const isChecked = checked[item.id] || false

                    return (
                      <li key={item.id}>
                        <label
                          className={`min-h-12 w-full flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                            isChecked
                              ? 'bg-teal-500/5 border-teal-500/20'
                              : 'hover:bg-navy-700/50 border-transparent'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle(item.id)}
                            className="mt-0.5 w-5 h-5 shrink-0 accent-teal-500 cursor-pointer"
                          />
                          <span className={`min-w-0 text-base leading-relaxed break-words ${isChecked ? 'text-teal-300 line-through' : 'text-slate-300'}`}>
                            {item.text}
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          )
        })}
      </div>

      {progressPercent === 100 && (
        <div className="mt-6 p-4 bg-green-500/10 border-2 border-green-500/40 rounded-xl text-center">
          <CheckSquare className="w-8 h-8 text-green-400 mx-auto mb-2" aria-hidden="true" />
          <div className="font-heading font-bold text-green-400">Checklist Complete!</div>
          <p className="text-xs text-green-300/70 mt-1">All authentication review items verified.</p>
        </div>
      )}

      <PrevNextNav
        prev={{ path: '/quiz', label: 'Quiz' }}
        next={{ path: '/references', label: 'References' }}
      />
    </div>
  )
}
