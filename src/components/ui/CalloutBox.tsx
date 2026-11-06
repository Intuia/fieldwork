import { type ReactNode } from 'react'
import { Swords, AlertTriangle, Shield, AlertCircle, Info } from 'lucide-react'

type CalloutType = 'attack' | 'impact' | 'fix' | 'warning' | 'info'

interface CalloutBoxProps {
  type: CalloutType
  title: string
  children: ReactNode
}

function getCalloutConfig(type: CalloutType) {
  if (type === 'attack') {
    return {
      icon: Swords,
      borderColor: 'border-l-red-500',
      bgColor: 'bg-red-500/5',
      iconColor: 'text-red-400',
      titleColor: 'text-red-400',
    }
  } else if (type === 'impact') {
    return {
      icon: AlertTriangle,
      borderColor: 'border-l-amber-500',
      bgColor: 'bg-amber-500/5',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-400',
    }
  } else if (type === 'fix') {
    return {
      icon: Shield,
      borderColor: 'border-l-green-500',
      bgColor: 'bg-green-500/5',
      iconColor: 'text-green-400',
      titleColor: 'text-green-400',
    }
  } else if (type === 'warning') {
    return {
      icon: AlertCircle,
      borderColor: 'border-l-amber-500',
      bgColor: 'bg-amber-500/5',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-400',
    }
  } else {
    return {
      icon: Info,
      borderColor: 'border-l-cyan-500',
      bgColor: 'bg-cyan-500/5',
      iconColor: 'text-cyan-400',
      titleColor: 'text-cyan-400',
    }
  }
}

export function CalloutBox({ type, title, children }: CalloutBoxProps) {
  const config = getCalloutConfig(type)
  const IconComponent = config.icon

  return (
    <div className={`rounded-lg border-l-4 ${config.borderColor} ${config.bgColor} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <IconComponent className={`w-4 h-4 ${config.iconColor} shrink-0`} aria-hidden="true" />
        <h4 className={`font-heading font-bold text-sm ${config.titleColor}`}>{title}</h4>
      </div>
      <div className="text-sm text-slate-300 leading-relaxed pl-6">
        {children}
      </div>
    </div>
  )
}
