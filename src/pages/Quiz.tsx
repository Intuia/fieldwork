import { useState, useEffect, useMemo, useCallback } from 'react'
import { useProgress } from '../hooks/useProgress'
import { quizQuestions } from '../content/quiz'
import { Badge } from '../components/ui/Badge'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import { CheckCircle, XCircle, RotateCcw, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'

const STORAGE_KEY = 'auth-study-quiz'

const SECTIONS = [
  { key: 'all', label: 'All' },
  { key: 'technologies', label: 'Technologies' },
  { key: 'design-flaws', label: 'Design Flaws' },
  { key: 'implementation-flaws', label: 'Impl. Flaws' },
  { key: 'defenses', label: 'Defenses' },
  { key: 'then-vs-now', label: 'Then vs Now' },
]

function getSectionBadgeVariant(section: string): 'info-leakage' | 'design-flaw' | 'implementation-flaw' | 'defense' | 'updated' {
  if (section === 'technologies') {
    return 'info-leakage'
  } else if (section === 'design-flaws') {
    return 'design-flaw'
  } else if (section === 'implementation-flaws') {
    return 'implementation-flaw'
  } else if (section === 'defenses') {
    return 'defense'
  } else {
    return 'updated'
  }
}

function getSectionLabel(section: string): string {
  if (section === 'technologies') {
    return 'Technologies'
  } else if (section === 'design-flaws') {
    return 'Design Flaws'
  } else if (section === 'implementation-flaws') {
    return 'Impl. Flaws'
  } else if (section === 'defenses') {
    return 'Defenses'
  } else if (section === 'then-vs-now') {
    return 'Then vs Now'
  } else {
    return section
  }
}

function loadAnswers(): Record<string, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // ignore
  }
  return {}
}

export default function Quiz() {
  const { markVisited } = useProgress()
  const [answers, setAnswers] = useState<Record<string, number>>(loadAnswers)
  const [activeSection, setActiveSection] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    markVisited('quiz')
    document.title = 'Quiz — Ch. 6'
  }, [markVisited])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    } catch {
      // ignore
    }
  }, [answers])

  const filteredQuestions = useMemo(() => {
    if (activeSection === 'all') {
      return quizQuestions
    }
    return quizQuestions.filter(q => q.section === activeSection)
  }, [activeSection])

  const currentQuestion = filteredQuestions[currentIndex]
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined
  const hasAnswered = selectedAnswer !== undefined

  const handleAnswer = useCallback((questionId: string, optionIndex: number) => {
    setAnswers(prev => {
      if (prev[questionId] !== undefined) {
        return prev
      }
      return { ...prev, [questionId]: optionIndex }
    })
  }, [])

  const handleSectionChange = useCallback((sectionKey: string) => {
    setActiveSection(sectionKey)
    setCurrentIndex(0)
    setShowSummary(false)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setShowSummary(true)
    }
  }, [currentIndex, filteredQuestions.length])

  const handleReset = useCallback(() => {
    setAnswers({})
    setCurrentIndex(0)
    setShowSummary(false)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const totalAnswered = useMemo(() => {
    return filteredQuestions.filter(q => answers[q.id] !== undefined).length
  }, [filteredQuestions, answers])

  const totalCorrect = useMemo(() => {
    return filteredQuestions.filter(q => answers[q.id] === q.correctIndex).length
  }, [filteredQuestions, answers])

  const sectionBreakdown = useMemo(() => {
    const uniqueSections = ['technologies', 'design-flaws', 'implementation-flaws', 'defenses', 'then-vs-now']
    return uniqueSections.map(section => {
      const sectionQuestions = quizQuestions.filter(q => q.section === section)
      const answered = sectionQuestions.filter(q => answers[q.id] !== undefined).length
      const correct = sectionQuestions.filter(q => answers[q.id] === q.correctIndex).length
      return { section, total: sectionQuestions.length, answered, correct }
    })
  }, [answers])

  return (
    <div className="animate-fade-in">
      <div className="mb-2">
        <span className="font-mono text-xs text-teal-500 uppercase tracking-wider">Quiz</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-100 mb-3">
        Section Quizzes
      </h1>
      <p className="text-slate-400 mb-6">
        {quizQuestions.length} scenario-based questions with instant feedback and score summary.
      </p>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Quiz section filter">
        {SECTIONS.map(section => {
          const isActive = activeSection === section.key
          return (
            <button
              key={section.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSectionChange(section.key)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                isActive
                  ? 'bg-teal-500/15 border border-teal-500/40 text-teal-300'
                  : 'bg-navy-800 border border-[var(--border-subtle)] text-slate-400 hover:border-teal-500/20 hover:text-slate-300'
              }`}
            >
              {section.label}
            </button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: filteredQuestions.length > 0 ? `${(totalAnswered / filteredQuestions.length) * 100}%` : '0%' }}
          />
        </div>
        <span className="font-mono text-xs text-slate-500">
          {totalAnswered}/{filteredQuestions.length} answered
        </span>
      </div>

      {showSummary ? (
        <div className="space-y-6">
          {/* Score card */}
          <div className="p-6 bg-navy-800 border border-[var(--border-subtle)] rounded-xl text-center space-y-4">
            <Trophy className="w-10 h-10 text-teal-400 mx-auto" aria-hidden="true" />
            <h2 className="text-2xl font-heading font-bold text-slate-100">Quiz Complete</h2>
            <div className="text-4xl font-heading font-bold text-teal-400">
              {totalCorrect}/{filteredQuestions.length}
            </div>
            <p className="text-slate-400 text-sm">
              {filteredQuestions.length > 0
                ? `${Math.round((totalCorrect / filteredQuestions.length) * 100)}% correct`
                : 'No questions in this section'
              }
            </p>
          </div>

          {/* Per-section breakdown */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-200">Section Breakdown</h3>
            {sectionBreakdown.map(entry => {
              const percent = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0
              return (
                <div key={entry.section} className="flex items-center gap-3 p-3 bg-navy-800 border border-[var(--border-subtle)] rounded-lg">
                  <Badge variant={getSectionBadgeVariant(entry.section)}>
                    {getSectionLabel(entry.section)}
                  </Badge>
                  <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-slate-400 w-20 text-right">
                    {entry.correct}/{entry.total} ({percent}%)
                  </span>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowSummary(false); setCurrentIndex(0) }}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--border-subtle)] text-slate-400 text-sm rounded-lg hover:bg-navy-700/50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Review Questions
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--border-subtle)] text-slate-400 text-sm rounded-lg hover:bg-navy-700/50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset Quiz
            </button>
          </div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-8 bg-navy-800 border border-[var(--border-subtle)] rounded-lg text-center text-slate-500">
          No questions in this section.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Question card */}
          <div className="p-5 sm:p-6 bg-navy-800 border border-[var(--border-subtle)] rounded-xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <Badge variant={getSectionBadgeVariant(currentQuestion.section)}>
                {getSectionLabel(currentQuestion.section)}
              </Badge>
              <span className="font-mono text-xs text-slate-500">
                {currentIndex + 1} of {filteredQuestions.length}
              </span>
            </div>

            {/* Question */}
            <p className="text-slate-200 leading-relaxed">{currentQuestion.question}</p>

            {/* Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex
                const isCorrectOption = optionIndex === currentQuestion.correctIndex
                let optionStyle = 'border-[var(--border-subtle)] bg-navy-900/50 text-slate-300 hover:border-teal-500/30 hover:bg-navy-700/30 cursor-pointer'

                if (hasAnswered) {
                  if (isCorrectOption) {
                    optionStyle = 'border-green-500/50 bg-green-500/10 text-green-300'
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'border-red-500/50 bg-red-500/10 text-red-300'
                  } else {
                    optionStyle = 'border-[var(--border-subtle)] bg-navy-900/30 text-slate-500'
                  }
                }

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswer(currentQuestion.id, optionIndex)}
                    disabled={hasAnswered}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-start gap-3 disabled:cursor-default ${optionStyle}`}
                  >
                    <span className="font-mono text-xs mt-0.5 shrink-0 w-5">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    <span className="flex-1">{option}</span>
                    {hasAnswered && isCorrectOption && (
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" aria-label="Correct answer" />
                    )}
                    {hasAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-label="Incorrect" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {hasAnswered && (
              <div className={`p-4 rounded-lg border ${
                selectedAnswer === currentQuestion.correctIndex
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-amber-500/30 bg-amber-500/5'
              }`}>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <span className="font-mono text-[10px] text-slate-500 mt-2 block">
                  Slide {currentQuestion.slideRef}
                </span>
              </div>
            )}
          </div>

          {/* Question navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 border border-[var(--border-subtle)] rounded-lg hover:bg-navy-700/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Previous
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-400 transition-colors"
              aria-label="Reset quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="flex items-center gap-2 px-4 py-2 text-sm font-heading font-bold bg-teal-500 text-navy-900 rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {currentIndex < filteredQuestions.length - 1 ? 'Next' : 'See Results'}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <PrevNextNav
          prev={{ path: '/labs', label: 'Labs' }}
          next={{ path: '/checklist', label: 'Checklist' }}
        />
      </div>
    </div>
  )
}
