import { useEffect, useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { defenseFramework, defenses, architectureSynthesis, defenseLayers } from '../content/defenses'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Tabs } from '../components/ui/Tabs'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import { Shield, Lock, RefreshCw, Eye, Layers } from 'lucide-react'

function getLayerIcon(layer: string) {
  if (layer === 'credential') {
    return Lock
  } else if (layer === 'protocol') {
    return Shield
  } else if (layer === 'lifecycle') {
    return RefreshCw
  } else if (layer === 'operations') {
    return Eye
  } else {
    return Layers
  }
}

function getLayerColor(layer: string): string {
  if (layer === 'credential') {
    return 'text-teal-400'
  } else if (layer === 'protocol') {
    return 'text-cyan-400'
  } else if (layer === 'lifecycle') {
    return 'text-purple-400'
  } else if (layer === 'operations') {
    return 'text-amber-400'
  } else {
    return 'text-slate-400'
  }
}

function getLayerBorderColor(layer: string): string {
  if (layer === 'credential') {
    return 'border-teal-500/30'
  } else if (layer === 'protocol') {
    return 'border-cyan-500/30'
  } else if (layer === 'lifecycle') {
    return 'border-purple-500/30'
  } else if (layer === 'operations') {
    return 'border-amber-500/30'
  } else {
    return 'border-[var(--border-subtle)]'
  }
}

export default function Defenses() {
  const { markVisited } = useProgress()
  const [activeLayer, setActiveLayer] = useState<string | null>(null)

  useEffect(() => {
    markVisited('defenses')
    document.title = 'Defenses — Ch. 6'
  }, [markVisited])

  // Build tabs by defense layer
  const layerTabs = defenseLayers.map(layer => {
    const layerDefenses = defenses.filter(d => d.layer === layer.id)
    const IconComponent = getLayerIcon(layer.id)
    const colorClass = getLayerColor(layer.id)

    return {
      id: layer.id,
      label: layer.label,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <IconComponent className={`w-5 h-5 ${colorClass}`} aria-hidden="true" />
            <div>
              <h3 className="font-heading font-bold text-slate-200">{layer.label}</h3>
              <p className="text-xs text-slate-500">{layer.description}</p>
            </div>
          </div>

          {layerDefenses.map(defense => (
            <Card key={defense.id} glowing>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-heading font-bold text-slate-100">{defense.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{defense.subtitle}</p>
                </div>
                <Badge variant="defense">{defense.layer}</Badge>
              </div>
              <ol className="space-y-2.5">
                {defense.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex gap-3 text-sm text-slate-300">
                    <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                      {String(pointIndex + 1).padStart(2, '0')}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 text-right">
                <span className="font-mono text-[10px] text-slate-500">Slide {defense.slideRef}</span>
              </div>
            </Card>
          ))}
        </div>
      ),
    }
  })

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Secure Authentication Defenses"
        subtitle={defenseFramework.subtitle}
        badge={<Badge variant="defense">Defense Framework</Badge>}
      />

      {/* Framework overview */}
      <Card>
        <h3 className="font-heading text-base font-bold text-slate-200 mb-3">
          Defense framework principles
        </h3>
        <ol className="space-y-2">
          {defenseFramework.points.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-300">
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slide {defenseFramework.slideRef}</span>
        </div>
      </Card>

      {/* Architecture diagram — the 4 layers */}
      <section>
        <h2 className="text-xl font-heading font-bold text-slate-100 mb-4">Layered Architecture</h2>
        <p className="text-sm text-slate-400 mb-6">{architectureSynthesis.subtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {defenseLayers.map(layer => {
            const IconComponent = getLayerIcon(layer.id)
            const colorClass = getLayerColor(layer.id)
            const borderClass = getLayerBorderColor(layer.id)
            const isSelected = activeLayer === layer.id

            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(isSelected ? null : layer.id)}
                className={`p-4 rounded-lg border text-left transition-all ${borderClass} ${
                  isSelected
                    ? 'bg-navy-700 shadow-[var(--glow-teal)]'
                    : 'bg-navy-800 hover:bg-navy-700/50'
                }`}
                aria-pressed={isSelected}
              >
                <IconComponent className={`w-5 h-5 ${colorClass} mb-2`} aria-hidden="true" />
                <div className="font-heading font-bold text-sm text-slate-200">{layer.label}</div>
                <div className="text-xs text-slate-500 mt-1">{layer.description}</div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Detailed defenses by layer */}
      <section>
        <h2 className="text-xl font-heading font-bold text-slate-100 mb-4">Defense Details by Layer</h2>
        <Tabs tabs={layerTabs} />
      </section>

      {/* Architecture synthesis */}
      <Card glowing>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-teal-500" aria-hidden="true" />
          <h3 className="font-heading font-bold text-slate-100">{architectureSynthesis.title}</h3>
        </div>
        <ol className="space-y-2">
          {architectureSynthesis.points.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-300">
              <span className="font-mono text-xs text-teal-500 mt-0.5 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slide {architectureSynthesis.slideRef}</span>
        </div>
      </Card>

      <PrevNextNav
        prev={{ path: '/threat-model', label: 'Threat Model' }}
        next={{ path: '/assessment', label: 'Assessment' }}
      />
    </div>
  )
}
