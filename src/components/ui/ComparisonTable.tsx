interface ComparisonRow {
  label: string
  left: string
  right: string
}

interface ComparisonTableProps {
  leftHeader: string
  rightHeader: string
  rows: ComparisonRow[]
  className?: string
}

export function ComparisonTable({ leftHeader, rightHeader, rows, className = '' }: ComparisonTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm border-collapse" role="table">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 font-mono text-xs text-slate-500 uppercase tracking-wider bg-navy-800 border-b border-[var(--border-subtle)] w-1/4">
              Topic
            </th>
            <th className="text-left px-4 py-3 font-mono text-xs text-amber-400 uppercase tracking-wider bg-navy-800 border-b border-[var(--border-subtle)] w-[37.5%]">
              {leftHeader}
            </th>
            <th className="text-left px-4 py-3 font-mono text-xs text-teal-400 uppercase tracking-wider bg-navy-800 border-b border-[var(--border-subtle)] w-[37.5%]">
              {rightHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={index % 2 === 0 ? 'bg-navy-900/50' : 'bg-navy-800/30'}
            >
              <td className="px-4 py-3 font-heading font-bold text-slate-300 border-b border-[var(--border-subtle)]">
                {row.label}
              </td>
              <td className="px-4 py-3 text-slate-400 border-b border-[var(--border-subtle)]">
                {row.left}
              </td>
              <td className="px-4 py-3 text-slate-300 border-b border-[var(--border-subtle)]">
                {row.right}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
