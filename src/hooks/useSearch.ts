import { useState, useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'

export interface SearchItem {
  title: string;
  description: string;
  path: string;
  section: string;
  keywords: string[];
}

const searchData: SearchItem[] = [
  { title: 'Home', description: 'Identity, evidence, trust — overview and learning objectives', path: '/', section: 'Home', keywords: ['authentication', 'access chain', 'overview'] },
  { title: 'Authentication Technologies', description: 'Forms login, MFA, certificates, HTTP auth, federation', path: '/technologies', section: 'Technologies', keywords: ['forms', 'multifactor', 'certificates', 'smartcards', 'HTTP Basic', 'Digest', 'federated', 'IdP'] },
  { title: 'Design Flaws', description: 'Bad passwords, brute force, enumeration, recovery, remember-me', path: '/design-flaws', section: 'Design Flaws', keywords: ['password', 'brute force', 'stuffing', 'spraying', 'enumeration', 'lockout', 'rate limit', 'transport', 'recovery', 'impersonation'] },
  { title: 'Implementation Flaws', description: 'Fail-open logic, multistage state machine, credential storage', path: '/implementation-flaws', section: 'Implementation', keywords: ['fail-open', 'state machine', 'multistage', 'hidden field', 'credential storage', 'hashing'] },
  { title: 'Threat Model', description: 'Map weaknesses to attacker capabilities', path: '/threat-model', section: 'Threat Model', keywords: ['oracle', 'client state', 'database disclosure', 'recovery path'] },
  { title: 'Defenses', description: 'Credential, protocol, lifecycle, and operations layers', path: '/defenses', section: 'Defenses', keywords: ['strong credentials', 'secret handling', 'password hashing', 'validation', 'leakage', 'guessing', 'monitoring', 'Argon2id', 'bcrypt'] },
  { title: 'Assessment', description: 'Safe testing workflow and worked case analyses', path: '/assessment', section: 'Assessment', keywords: ['testing', 'enumeration', 'multistage', 'authorized', 'case analysis'] },
  { title: 'Then vs Now', description: '2011 textbook vs current NIST/OWASP/FIDO standards', path: '/then-vs-now', section: 'Then vs Now', keywords: ['NIST', '800-63B', 'passkeys', 'FIDO2', 'rotation', 'composition rules', 'blocklist'] },
  { title: 'Interactive Labs', description: '8 client-side simulated security labs', path: '/labs', section: 'Labs', keywords: ['access chain', 'enumeration', 'rate limit', 'state machine', 'password storage', 'policy checker', 'MFA sorter'] },
  { title: 'Quiz', description: 'Section quizzes with instant feedback', path: '/quiz', section: 'Quiz', keywords: ['test', 'questions', 'score'] },
  { title: 'Review Checklist', description: 'Interactive authentication review checklist', path: '/checklist', section: 'Checklist', keywords: ['checklist', 'review', 'register', 'login', 'recovery'] },
  { title: 'References', description: 'NIST, OWASP, FIDO Alliance source links', path: '/references', section: 'References', keywords: ['NIST', 'OWASP', 'FIDO', 'sources'] },
]

export function useSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const fuse = useMemo(() => {
    return new Fuse(searchData, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1.5 },
        { name: 'keywords', weight: 1 },
        { name: 'section', weight: 0.5 },
      ],
      threshold: 0.4,
      includeScore: true,
    })
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) {
      return []
    }
    return fuse.search(query).map(result => result.item)
  }, [fuse, query])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
  }, [])

  return { query, setQuery, results, isOpen, open, close }
}
