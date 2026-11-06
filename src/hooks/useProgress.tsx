import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface ProgressState {
  [pageId: string]: boolean;
}

interface ProgressContextType {
  progress: ProgressState;
  markVisited: (pageId: string) => void;
  getVisitedCount: () => number;
  totalPages: number;
}

const STORAGE_KEY = 'auth-study-progress'
const TOTAL_PAGES = 12

const ProgressContext = createContext<ProgressContextType | null>(null)

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return {}
}

function saveProgress(progress: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Ignore storage errors
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const markVisited = useCallback((pageId: string) => {
    setProgress(prev => {
      if (prev[pageId]) {
        return prev
      }
      return { ...prev, [pageId]: true }
    })
  }, [])

  const getVisitedCount = useCallback(() => {
    return Object.values(progress).filter(Boolean).length
  }, [progress])

  return (
    <ProgressContext.Provider value={{ progress, markVisited, getVisitedCount, totalPages: TOTAL_PAGES }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
