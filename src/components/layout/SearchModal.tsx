import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import type { SearchItem } from '../../hooks/useSearch'

interface SearchModalProps {
  isOpen: boolean;
  query: string;
  results: SearchItem[];
  onQueryChange: (query: string) => void;
  onClose: () => void;
}

export function SearchModal({ isOpen, query, results, onQueryChange, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) {
      return
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  function handleResultClick(path: string) {
    navigate(path)
    onClose()
  }

  function handleKeyDownOnResult(event: React.KeyboardEvent, path: string) {
    if (event.key === 'Enter') {
      handleResultClick(path)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative w-full max-w-lg mx-4 bg-navy-800 border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search topics, concepts, pages..."
            className="flex-1 bg-transparent text-slate-100 text-sm placeholder-slate-500 outline-none font-body"
            aria-label="Search query"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
          {results.map((item) => (
            <div
              key={item.path}
              onClick={() => handleResultClick(item.path)}
              onKeyDown={(e) => handleKeyDownOnResult(e, item.path)}
              className="px-4 py-3 hover:bg-navy-700/50 cursor-pointer transition-colors border-b border-[var(--border-subtle)] last:border-b-0"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-teal-500 uppercase tracking-wider">{item.section}</span>
              </div>
              <div className="text-sm text-slate-200 mt-0.5">{item.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
            </div>
          ))}
          {!query.trim() && (
            <div className="px-4 py-6 text-center text-xs text-slate-500">
              Start typing to search across all content
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] flex items-center gap-4 text-[10px] text-slate-500 font-mono">
          <span><kbd className="px-1 py-0.5 bg-navy-700 rounded">↵</kbd> select</span>
          <span><kbd className="px-1 py-0.5 bg-navy-700 rounded">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
