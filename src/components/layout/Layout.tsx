import { type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { SearchModal } from './SearchModal'
import { useSearch } from '../../hooks/useSearch'

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const search = useSearch()

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-navy-900 focus:font-heading focus:font-bold focus:rounded-lg focus:text-sm"
      >
        Skip to content
      </a>
      <Navbar onSearchOpen={search.open} />
      <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <SearchModal
        isOpen={search.isOpen}
        query={search.query}
        results={search.results}
        onQueryChange={search.setQuery}
        onClose={search.close}
      />
    </div>
  )
}
