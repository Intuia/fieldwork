import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, BookOpen, FlaskConical, ChevronRight } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'

export default function Home() {
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited('home')
    document.title = 'Attacking Authentication — Ch. 6 Study Guide'
  }, [markVisited])

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero */}
      <section className="text-center py-12 sm:py-20">
        <div className="font-mono text-xs sm:text-sm text-teal-500 uppercase tracking-[0.3em] mb-6">
          Identity &bull; Evidence &bull; Trust
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-slate-100 mb-6 leading-tight">
          Attacking{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
            Authentication
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-4">
          A systematic study of design, implementation, and defense in web application identity checks
        </p>
        <p className="text-sm text-slate-500 mb-10">
          The Web Application Hacker&rsquo;s Handbook, 2nd ed. &bull; Stuttard &amp; Pinto &bull; Chapter 6
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/technologies"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-navy-900 font-heading font-bold rounded-lg hover:bg-teal-400 transition-colors no-underline"
          >
            <BookOpen className="w-5 h-5" aria-hidden="true" />
            Start Learning
          </Link>
          <Link
            to="/labs"
            className="inline-flex items-center gap-2 px-6 py-3 border border-teal-500/30 text-teal-400 font-heading font-bold rounded-lg hover:bg-teal-500/10 transition-colors no-underline"
          >
            <FlaskConical className="w-5 h-5" aria-hidden="true" />
            Interactive Labs
          </Link>
        </div>
      </section>

      {/* Learning Objectives — Slide 3 */}
      <section>
        <h2 className="text-2xl font-heading font-bold text-slate-100 mb-2 flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-500" aria-hidden="true" />
          Learning Objectives
        </h2>
        <p className="text-sm text-slate-400 mb-6">By the end, students should be able to&hellip;</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Define authentication; distinguish it from sessions and authorization',
            'Classify authentication technologies and analyze their trade-offs',
            'Trace design and implementation weaknesses to attacker outcomes',
            'Evaluate credential, recovery, validation, and monitoring controls',
            'Compare the textbook perspective with current standards and practice',
          ].map((objective, index) => (
            <div
              key={index}
              className="p-4 bg-navy-800 border border-[var(--border-subtle)] rounded-lg"
            >
              <div className="font-mono text-xs text-teal-500 mb-2">{String(index + 1).padStart(2, '0')}</div>
              <p className="text-sm text-slate-300">{objective}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Access Chain — Slide 5 */}
      <section>
        <h2 className="text-2xl font-heading font-bold text-slate-100 mb-2">The Access Chain</h2>
        <p className="text-sm text-slate-400 mb-6">Authentication sits inside a chain — failure at any link undermines the whole protection.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
          {[
            { label: 'Claim', description: 'User presents identity' },
            { label: 'Verify', description: 'Authentication checks evidence' },
            { label: 'Bind', description: 'Session preserves continuity' },
            { label: 'Monitor', description: 'Authorization governs actions' },
          ].map((step, index) => (
            <div key={step.label} className="flex items-center gap-2 sm:gap-0">
              <div className="flex flex-col items-center px-6 py-4 bg-navy-800 border border-teal-500/20 rounded-lg min-w-[140px]">
                <div className="font-mono text-xs text-teal-500 uppercase tracking-wider">{step.label}</div>
                <div className="text-xs text-slate-400 mt-1 text-center">{step.description}</div>
              </div>
              {index < 3 && (
                <ChevronRight className="w-5 h-5 text-teal-500/50 hidden sm:block mx-1" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways — Slide 64 */}
      <section>
        <h2 className="text-2xl font-heading font-bold text-slate-100 mb-6">Key Takeaways</h2>
        <div className="space-y-3">
          {[
            'Authentication is a system, not a login form',
            'The weakest recovery, fallback, or support path can defeat a strong authenticator',
            'Treat the client as untrusted; bind identity and progress to server-side state',
            'Use controls grounded in current standards and real use',
            'Assess compromise resistance and legitimate-user recovery',
          ].map((takeaway, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-navy-800/50 border-l-2 border-teal-500/40 rounded-r-lg"
            >
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">{String(index + 1).padStart(2, '0')}</span>
              <p className="text-sm text-slate-300">{takeaway}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation prompt */}
      <section className="text-center py-8 border-t border-[var(--border-subtle)]">
        <p className="text-sm text-slate-400 mb-4">Ready to begin?</p>
        <Link
          to="/technologies"
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-heading font-bold no-underline"
        >
          Start with Authentication Technologies
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
