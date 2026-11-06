import { glossaryTerms } from '../../content/glossary'
import { GlossaryTooltip } from './GlossaryTooltip'

const termMap = new Map(
  glossaryTerms.map(t => [t.term.toLowerCase(), t])
)

interface GlossaryHighlighterProps {
  text: string
}

export function GlossaryHighlighter({ text }: GlossaryHighlighterProps) {
  const terms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length)
  const pattern = new RegExp(`\\b(${terms.map(escapeRegex).join('|')})\\b`, 'gi')

  const parts: (string | { term: string; match: string })[] = []
  let lastIndex = 0
  const matched = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const termKey = match[1].toLowerCase()
    if (matched.has(termKey)) {
      continue
    }
    matched.add(termKey)

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push({ term: termKey, match: match[1] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  if (parts.length === 0) {
    return <>{text}</>
  }

  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          return <span key={index}>{part}</span>
        }
        const glossaryTerm = termMap.get(part.term)!
        return (
          <GlossaryTooltip
            key={index}
            term={glossaryTerm.term}
            definition={glossaryTerm.definition}
          >
            {part.match}
          </GlossaryTooltip>
        )
      })}
    </>
  )
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
