import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import Navbar from './components/common/Navbar'
import BackgroundFX from './components/common/BackgroundFX'
import Home from './pages/Home'

// Each page is split into its own chunk. Home stays eager because it is the
// most common first paint; the rest load on first visit.
const Lessons = lazy(() => import('./pages/Lessons'))
const LessonDetails = lazy(() => import('./pages/LessonDetails'))
const Practice = lazy(() => import('./pages/Practice'))
const KeyboardGuide = lazy(() => import('./pages/KeyboardGuide'))
const TypingTest = lazy(() => import('./pages/TypingTest'))
const Games = lazy(() => import('./pages/Games'))
const Challenges = lazy(() => import('./pages/Challenges'))
const Progress = lazy(() => import('./pages/Progress'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <main className="page route-loader" aria-busy="true" aria-live="polite">
      <div className="container">
        <span className="route-loader__spinner" />
        <span className="route-loader__label">Loading TypeFlow…</span>
      </div>
    </main>
  )
}

function SiteChrome() {
  const { pathname } = useLocation()
  // The Learn dashboard renders its own app shell, so the site navbar is hidden.
  const isLearnDashboard = /^\/lessons(\/|$)/.test(pathname)
  if (isLearnDashboard) return null
  return <Navbar />
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ProgressProvider>
          <BackgroundFX />
          <BrowserRouter>
            <ScrollToTop />
            <SiteChrome />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/lessons/:id" element={<LessonDetails />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/guide" element={<KeyboardGuide />} />
                <Route path="/test" element={<TypingTest />} />
                <Route path="/games" element={<Games />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ProgressProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}

export default App
