import { useState, useCallback } from 'react'
import { authenticators, checkSorting, checkMfaValidity } from './server'
import { GripVertical, Check, X, Shield, AlertTriangle, Info, RotateCcw } from 'lucide-react'

const CATEGORIES = [
  { id: 'known', label: 'Something Known', color: 'border-amber-500/40 bg-amber-500/5' },
  { id: 'possessed', label: 'Something Possessed', color: 'border-cyan-500/40 bg-cyan-500/5' },
  { id: 'inherent', label: 'Something Inherent', color: 'border-purple-500/40 bg-purple-500/5' },
] as const

function getPhishingColor(resistance: string): string {
  if (resistance === 'high') {
    return 'text-green-400 bg-green-500/10'
  } else if (resistance === 'medium') {
    return 'text-amber-400 bg-amber-500/10'
  } else if (resistance === 'low') {
    return 'text-red-400 bg-red-500/10'
  } else {
    return 'text-slate-400 bg-slate-500/10'
  }
}

export function MfaSorterLab() {
  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const unplacedItems = authenticators.filter(item => !placements[item.id])
  const results = checked ? checkSorting(placements) : []

  function handleDragStart(itemId: string) {
    setDraggedItem(itemId)
  }

  function handleDrop(categoryId: string) {
    if (draggedItem) {
      setPlacements(prev => ({ ...prev, [draggedItem]: categoryId }))
      setDraggedItem(null)
      setChecked(false)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  // Click-to-place: cycle through categories
  function handleItemClick(itemId: string) {
    const currentCategory = placements[itemId]
    if (!currentCategory) {
      setPlacements(prev => ({ ...prev, [itemId]: 'known' }))
    } else if (currentCategory === 'known') {
      setPlacements(prev => ({ ...prev, [itemId]: 'possessed' }))
    } else if (currentCategory === 'possessed') {
      setPlacements(prev => ({ ...prev, [itemId]: 'inherent' }))
    } else {
      // Remove from placement
      setPlacements(prev => {
        const next = { ...prev }
        delete next[itemId]
        return next
      })
    }
    setChecked(false)
  }

  const handleCheck = useCallback(() => {
    setChecked(true)
  }, [])

  function handleReset() {
    setPlacements({})
    setChecked(false)
    setDraggedItem(null)
  }

  // Count correct placements
  const correctCount = results.filter(r => r.correct).length
  const allPlaced = Object.keys(placements).length === authenticators.length

  // Check MFA validity for password + PIN example
  const passwordPinCheck = checkMfaValidity('known', 'known')

  return (
    <div className="space-y-6">
      {/* What this teaches */}
      <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <h3 className="font-heading font-bold text-sm text-cyan-400">What this teaches</h3>
        </div>
        <p className="text-xs text-slate-400">
          MFA requires independent factor categories (known, possessed, or inherent).
          Two knowledge factors (password + PIN) do not qualify as true MFA.
          Factor type and protocol determine phishing resistance. (Slides 8, 55)
        </p>
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-400">
        Drag items into categories, or click to cycle placement. Then check your answers.
      </p>

      {/* Unplaced items */}
      {unplacedItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-mono text-xs text-slate-500 uppercase tracking-wider">
            Authenticators to sort ({unplacedItems.length} remaining)
          </h3>
          <div className="flex flex-wrap gap-2">
            {unplacedItems.map(item => (
              <button
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onClick={() => handleItemClick(item.id)}
                className="flex items-center gap-2 px-3 py-2 bg-navy-800 border border-[var(--border-subtle)] rounded-lg text-sm text-slate-300 hover:border-teal-500/30 transition-colors cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-3 h-3 text-slate-500" aria-hidden="true" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category drop zones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CATEGORIES.map(category => {
          const categoryItems = authenticators.filter(item => placements[item.id] === category.id)

          return (
            <div
              key={category.id}
              onDrop={() => handleDrop(category.id)}
              onDragOver={handleDragOver}
              className={`p-4 rounded-lg border-2 border-dashed min-h-[160px] transition-colors ${category.color} ${
                draggedItem ? 'border-opacity-100' : 'border-opacity-50'
              }`}
              role="region"
              aria-label={`${category.label} category`}
            >
              <h3 className="font-heading font-bold text-sm text-slate-200 mb-3">{category.label}</h3>
              <div className="space-y-2">
                {categoryItems.map(item => {
                  const result = results.find(r => r.itemId === item.id)
                  let borderClass = 'border-[var(--border-subtle)]'
                  if (result) {
                    borderClass = result.correct ? 'border-green-500/50' : 'border-red-500/50'
                  }

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      onClick={() => handleItemClick(item.id)}
                      className={`flex items-center justify-between gap-2 px-3 py-2 bg-navy-800 border ${borderClass} rounded text-xs text-slate-300 cursor-pointer`}
                    >
                      <span>{item.name}</span>
                      {result && (
                        result.correct
                          ? <Check className="w-3 h-3 text-green-400 shrink-0" aria-label="Correct" />
                          : <X className="w-3 h-3 text-red-400 shrink-0" aria-label="Incorrect" />
                      )}
                    </div>
                  )
                })}
                {categoryItems.length === 0 && (
                  <p className="text-xs text-slate-500 italic">Drop items here</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Check and Reset buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCheck}
          disabled={!allPlaced}
          className="px-4 py-2 bg-teal-500 text-navy-900 font-heading font-bold text-sm rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check Answers
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--border-subtle)] text-slate-400 text-sm rounded-lg hover:bg-navy-700/50 transition-colors"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" />
          Reset
        </button>
        {checked && (
          <span className="text-sm font-mono text-slate-400">
            {correctCount}/{authenticators.length} correct
          </span>
        )}
      </div>

      {/* Score results */}
      {checked && (
        <div className="space-y-4">
          {correctCount === authenticators.length && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm font-bold">All correct!</p>
            </div>
          )}

          {/* Phishing resistance breakdown */}
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-200 mb-3">Phishing Resistance Rating</h3>
            <div className="space-y-2">
              {authenticators.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 bg-navy-800 rounded text-xs"
                >
                  <span className="text-slate-300 w-40 shrink-0">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase ${getPhishingColor(item.phishingResistance)}`}>
                    {item.phishingResistance}
                  </span>
                  <span className="text-slate-500">{item.phishingDetail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MFA validity callout */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <h3 className="font-heading font-bold text-sm text-amber-400">
                Two knowledge factors is not MFA
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Password + PIN = {passwordPinCheck.reason}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <p className="text-xs text-teal-400">
                True MFA example: Password (known) + FIDO2 key (possessed) = independent categories.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
