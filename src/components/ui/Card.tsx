import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
  glowing?: boolean
}

export function Card({ title, children, className = '', glowing = false }: CardProps) {
  const shouldReduceMotion = useReducedMotion()

  const baseClasses = [
    'rounded-xl border p-6',
    'bg-navy-700 border-[var(--border-subtle)]',
    'transition-shadow duration-300',
  ].join(' ')

  const glowClasses = glowing
    ? 'hover:shadow-[var(--glow-teal)] hover:border-[var(--border-glow)]'
    : ''

  return (
    <motion.div
      className={`${baseClasses} ${glowClasses} ${className}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {title ? (
        <h3 className="font-heading text-lg font-bold text-slate-100 mb-3">
          {title}
        </h3>
      ) : null}
      {children}
    </motion.div>
  )
}
