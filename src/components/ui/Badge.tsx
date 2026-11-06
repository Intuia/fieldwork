type BadgeVariant =
  | 'design-flaw'
  | 'implementation-flaw'
  | 'defense'
  | 'attack-pattern'
  | 'info-leakage'
  | 'enduring'
  | 'updated'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

function getVariantClasses(variant: BadgeVariant): string {
  if (variant === 'design-flaw') {
    return 'bg-red-500/15 text-red-400 border-red-500/30'
  } else if (variant === 'implementation-flaw') {
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  } else if (variant === 'defense') {
    return 'bg-green-500/15 text-green-400 border-green-500/30'
  } else if (variant === 'attack-pattern') {
    return 'bg-purple-500/15 text-purple-400 border-purple-500/30'
  } else if (variant === 'info-leakage') {
    return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
  } else if (variant === 'enduring') {
    return 'bg-teal-500/15 text-teal-400 border-teal-500/30'
  } else if (variant === 'updated') {
    return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
  } else {
    return 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  }
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider border rounded-full ${getVariantClasses(variant)} ${className}`}
    >
      {children}
    </span>
  )
}
