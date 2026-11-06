import { useEffect, useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { glossaryTerms } from '../content/glossary'
import { PrevNextNav } from '../components/ui/PrevNextNav'
import { ExternalLink, BookOpen, Search } from 'lucide-react'

export default function References() {
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited('references')
    document.title = 'References — Ch. 6'
  }, [markVisited])

  const sources = [
    {
      title: 'The Web Application Hacker\'s Handbook, 2nd ed.',
      authors: 'Dafydd Stuttard and Marcus Pinto',
      publisher: 'Wiley, 2011',
      description: 'Primary source: Chapter 6, Attacking Authentication (pp. 159–202)',
    },
    {
      title: 'NIST SP 800-63-4 / 63B-4',
      description: 'Digital Identity Guidelines (final, July 2025)',
      url: 'https://pages.nist.gov/800-63-4/',
    },
    {
      title: 'OWASP Authentication & Password Storage Cheat Sheets',
      description: 'Practical guidance for authentication implementation',
      url: 'https://cheatsheetseries.owasp.org/',
    },
    {
      title: 'FIDO Alliance — Passkeys: The Journey to Prevent Phishing',
      description: 'Parts 1–2 (2025)',
      url: 'https://fidoalliance.org/',
    },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-2">
        <span className="font-mono text-xs text-teal-500 uppercase tracking-wider">References</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-100 mb-3">
        References &amp; Source Transparency
      </h1>
      <p className="text-slate-400 mb-8">Primary chapter source plus current standards and technical guidance</p>
      <div className="space-y-4">
        {sources.map((source, index) => (
          <div
            key={index}
            className="p-5 bg-navy-800 border border-[var(--border-subtle)] rounded-lg"
          >
            <h3 className="font-heading font-bold text-slate-200 mb-1">{source.title}</h3>
            {'authors' in source && (
              <p className="text-xs text-slate-500 mb-1">{source.authors} &bull; {source.publisher}</p>
            )}
            <p className="text-sm text-slate-400 mb-2">{source.description}</p>
            {'url' in source && source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 no-underline font-mono"
              >
                {source.url}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            )}
          </div>
        ))}
      </div>
      {/* Glossary */}
      <GlossarySection />

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-500 font-mono">Sources checked 29 October 2026</p>
      </div>

      <PrevNextNav
        prev={{ path: '/checklist', label: 'Checklist' }}
        next={{ path: '/', label: 'Home' }}
      />
    </div>
  )
}

function GlossarySection() {
  const [filter, setFilter] = useState('')

  const filtered = filter.trim()
    ? glossaryTerms.filter(t =>
        t.term.toLowerCase().includes(filter.toLowerCase()) ||
        t.definition.toLowerCase().includes(filter.toLowerCase())
      )
    : glossaryTerms

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-teal-400" aria-hidden="true" />
        <h2 className="text-xl font-heading font-bold text-slate-100">Glossary</h2>
        <span className="font-mono text-xs text-slate-500">{glossaryTerms.length} terms</span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter glossary terms..."
          className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-[var(--border-subtle)] rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-teal-500/50"
          aria-label="Filter glossary terms"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(term => (
          <div
            key={term.term}
            className="p-4 bg-navy-800 border border-[var(--border-subtle)] rounded-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-sm text-teal-400">{term.term}</span>
              <span className="font-mono text-[10px] text-slate-500">Slide {term.slideRef}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{term.definition}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">No matching terms.</p>
        )}
      </div>
    </section>
  )
}
