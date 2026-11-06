import { type ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: ReactNode
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {badge && <div className="mb-2">{badge}</div>}
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-100 mb-3">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-slate-400">{subtitle}</p>
      )}
    </div>
  )
}
