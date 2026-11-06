import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-navy-950/50 mt-auto no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-teal-400 mb-3">
              <Shield className="w-5 h-5" aria-hidden="true" />
              <span className="font-heading font-bold text-sm">Attacking Authentication</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chapter 6 study guide based on The Web Application Hacker's Handbook, 2nd ed.
              (Stuttard &amp; Pinto, Wiley 2011).
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-3">Sections</h3>
            <div className="grid grid-cols-2 gap-1">
              {[
                { path: '/technologies', label: 'Technologies' },
                { path: '/design-flaws', label: 'Design Flaws' },
                { path: '/defenses', label: 'Defenses' },
                { path: '/then-vs-now', label: 'Then vs Now' },
                { path: '/labs', label: 'Labs' },
                { path: '/quiz', label: 'Quiz' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs text-slate-500 hover:text-teal-400 transition-colors no-underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Ethics banner */}
          <div>
            <h3 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-3">Ethics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This is defensive security education.
              Test only with authorization and accounts you control.
              Every attack concept is presented with its defense.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-slate-500 font-mono">
            Sources checked 29 October 2026 •{' '}
            <Link to="/references" className="text-teal-500/70 hover:text-teal-400 no-underline">
              References
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
