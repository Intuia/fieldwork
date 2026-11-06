import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, Shield } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'

interface NavbarProps {
  onSearchOpen: () => void;
}

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/technologies', label: 'Technologies' },
  { path: '/design-flaws', label: 'Design Flaws' },
  { path: '/implementation-flaws', label: 'Impl. Flaws' },
  { path: '/threat-model', label: 'Threat Model' },
  { path: '/defenses', label: 'Defenses' },
  { path: '/assessment', label: 'Assessment' },
  { path: '/then-vs-now', label: 'Then vs Now' },
  { path: '/labs', label: 'Labs' },
  { path: '/quiz', label: 'Quiz' },
  { path: '/checklist', label: 'Checklist' },
  { path: '/references', label: 'References' },
]

export function Navbar({ onSearchOpen }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { getVisitedCount, totalPages } = useProgress()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        onSearchOpen()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSearchOpen])

  const visitedCount = getVisitedCount()
  const progressPercent = Math.round((visitedCount / totalPages) * 100)

  return (
    <nav className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-sm border-b border-[var(--border-subtle)]" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors no-underline" aria-label="Home — Attacking Authentication">
            <Shield className="w-6 h-6" aria-hidden="true" />
            <span className="font-heading font-bold text-sm sm:text-base hidden sm:inline">Auth Security</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 py-1 text-xs font-mono rounded transition-colors no-underline whitespace-nowrap ${
                    isActive
                      ? 'text-teal-400 bg-teal-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-navy-700/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right side: search + progress + mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500" aria-label={`Progress: ${progressPercent}% complete`}>
              <div className="w-16 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span>{progressPercent}%</span>
            </div>

            {/* Search button */}
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-slate-400 bg-navy-800 border border-[var(--border-subtle)] rounded-lg hover:border-teal-500/30 hover:text-slate-300 transition-colors"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-navy-700 rounded">⌘K</kbd>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-subtle)] bg-navy-900/98 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 text-sm font-mono rounded transition-colors no-underline ${
                    isActive
                      ? 'text-teal-400 bg-teal-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-navy-700/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
