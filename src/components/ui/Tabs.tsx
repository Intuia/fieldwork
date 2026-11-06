import { useState, useCallback, useRef, type ReactNode, type KeyboardEvent } from 'react'

interface TabItem {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  className?: string
}

export function Tabs({ tabs, className = '' }: TabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex

    if (event.key === 'ArrowRight') {
      nextIndex = currentIndex + 1
      if (nextIndex >= tabs.length) {
        nextIndex = 0
      }
    } else if (event.key === 'ArrowLeft') {
      nextIndex = currentIndex - 1
      if (nextIndex < 0) {
        nextIndex = tabs.length - 1
      }
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    } else {
      return
    }

    event.preventDefault()
    setActiveId(tabs[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }, [tabs])

  const activeTab = tabs.find(tab => tab.id === activeId)

  return (
    <div className={className}>
      {/* Tab list */}
      <div
        className="flex border-b border-[var(--border-subtle)] overflow-x-auto"
        role="tablist"
        aria-label="Content tabs"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`px-4 py-2.5 text-xs font-mono whitespace-nowrap transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab panel */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
        className="py-4"
      >
        {activeTab?.content}
      </div>
    </div>
  )
}
