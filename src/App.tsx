import { lazy, Suspense } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProgressProvider } from './hooks/useProgress'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

const Home = lazy(() => import('./pages/Home'))
const Technologies = lazy(() => import('./pages/Technologies'))
const DesignFlaws = lazy(() => import('./pages/DesignFlaws'))
const ImplementationFlaws = lazy(() => import('./pages/ImplementationFlaws'))
const ThreatModel = lazy(() => import('./pages/ThreatModel'))
const Defenses = lazy(() => import('./pages/Defenses'))
const Assessment = lazy(() => import('./pages/Assessment'))
const ThenVsNow = lazy(() => import('./pages/ThenVsNow'))
const Labs = lazy(() => import('./pages/Labs'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Checklist = lazy(() => import('./pages/Checklist'))
const References = lazy(() => import('./pages/References'))

function NotFound() {
  return (
    <div className="animate-fade-in text-center py-16">
      <div className="font-mono text-6xl font-bold text-teal-500 mb-4">404</div>
      <h1 className="text-2xl font-heading font-bold text-slate-100 mb-3">Page Not Found</h1>
      <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-4 py-2 bg-teal-500 text-navy-900 font-heading font-bold text-sm rounded-lg hover:bg-teal-400 transition-colors no-underline">
        Back to Home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/design-flaws" element={<DesignFlaws />} />
            <Route path="/implementation-flaws" element={<ImplementationFlaws />} />
            <Route path="/threat-model" element={<ThreatModel />} />
            <Route path="/defenses" element={<Defenses />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/then-vs-now" element={<ThenVsNow />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/references" element={<References />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ProgressProvider>
  )
}
