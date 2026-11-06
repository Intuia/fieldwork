import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavLink {
  path: string
  label: string
}

interface PrevNextNavProps {
  prev?: NavLink
  next?: NavLink
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  return (
    <nav className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--border-subtle)]" aria-label="Page navigation">
      {prev ? (
        <Link
          to={prev.path}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors no-underline group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          <div>
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Previous</div>
            <div>{prev.label}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={next.path}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors no-underline text-right group"
        >
          <div>
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Next</div>
            <div>{next.label}</div>
          </div>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
