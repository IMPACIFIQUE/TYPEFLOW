import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  LayoutGrid,
  Timer,
  Trophy,
} from 'lucide-react'
import Logo from '../common/Logo'
import ProgressBar from '../common/ProgressBar'
import { useAuth } from '../../context/AuthContext'
import { useProgress } from '../../context/ProgressContext'
import {
  LEVEL_META,
  getLessonProgress,
  getOverallLessonProgress,
  getRecommendedLesson,
} from '../../services/lessonService'

const NAV_ITEMS = [
  { id: 'lesson', label: 'Lesson', icon: BookOpen },
  { id: 'all', label: 'All lessons', icon: LayoutGrid, to: '/lessons' },
  { id: 'test', label: 'Speed test', icon: Timer, to: '/test', badge: 'NEW' },
  { id: 'progress', label: 'Progress', icon: BarChart3, to: '/progress' },
]

/**
 * Dashboard chrome shared by the lesson library and the lesson runner:
 * left navigation rail, top bar and an optional right-hand aside.
 */
function LearnShell({ breadcrumb, actions, aside, children }) {
  const { pathname } = useLocation()
  const { progress, stats } = useProgress()
  const { user } = useAuth()

  const overall = getOverallLessonProgress(progress)
  const recommended = getRecommendedLesson(progress)
  const recommendedEntry = getLessonProgress(progress, recommended.id)
  const level = LEVEL_META[recommended.level] || LEVEL_META.beginner

  const activeId =
    pathname === '/lessons'
      ? 'all'
      : pathname.startsWith('/lessons/')
        ? 'lesson'
        : pathname === '/test'
          ? 'test'
          : pathname === '/progress'
            ? 'progress'
            : ''

  const items = NAV_ITEMS.map((item) =>
    item.id === 'lesson' ? { ...item, to: `/lessons/${recommended.id}` } : item
  )

  return (
    <main className={`learn-shell ${aside ? 'learn-shell--aside' : ''}`}>
      <aside className="learn-rail" aria-label="Learn navigation">
        <div className="learn-rail__brand">
          <Logo />
          <span className="learn-level">{level.label}</span>
        </div>

        <nav className="learn-nav" aria-label="Learn dashboard">
          <p className="learn-nav__label">Learn</p>
          {items.map(({ id, to, label, icon: Icon, badge }) => (
            <Link
              key={id}
              to={to}
              className={`learn-nav__item ${activeId === id ? 'active' : ''}`}
              aria-current={activeId === id ? 'page' : undefined}
            >
              <span className="learn-nav__icon">
                <Icon size={15} />
              </span>
              <span>{label}</span>
              {badge ? <span className="learn-nav__badge">{badge}</span> : null}
            </Link>
          ))}
        </nav>

        <div className="learn-goal">
          <div className="learn-goal__head">
            <span className="learn-goal__label">
              <Trophy size={13} /> Lesson goal
            </span>
            <span className="chip chip--warning">
              {overall.stars}/{overall.maxStars} stars
            </span>
          </div>
          <p>
            Hit {recommended.targetWpm} WPM with clean strokes to earn the next star.
          </p>
          <div className="learn-goal__grid">
            <div>
              <span>Target</span>
              <strong>{recommended.targetWpm} WPM</strong>
            </div>
            <div>
              <span>Best</span>
              <strong>
                {recommendedEntry?.bestWpm ? `${Math.round(recommendedEntry.bestWpm)} WPM` : '—'}
              </strong>
            </div>
          </div>
          <ProgressBar value={overall.percent} />
          <Link to={`/lessons/${recommended.id}`} className="btn btn--primary btn--block">
            {recommendedEntry?.completed ? 'Practice next lesson' : 'Next lesson'}
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="learn-user">
          {user ? (
            <span className="avatar" style={{ background: user.avatarColor }}>
              {user.initials}
            </span>
          ) : (
            <span className="avatar">GT</span>
          )}
          <div className="learn-user__body">
            <strong>{user ? user.name : 'Guest typist'}</strong>
            <span>
              {stats.streak > 0 ? `${stats.streak} day streak` : 'Progress saved locally'}
            </span>
          </div>
          <Link to="/profile" className="learn-user__link" aria-label="Open profile">
            <ArrowRight size={14} />
          </Link>
        </div>
      </aside>

      <div className="learn-main">
        <header className="learn-topbar">
          <nav className="learn-crumbs" aria-label="Breadcrumb">
            {breadcrumb}
          </nav>
          {actions ? <div className="learn-topbar__actions">{actions}</div> : null}
        </header>
        <div className="learn-content">{children}</div>
      </div>

      {aside ? (
        <aside className="learn-aside" aria-label="Lesson details">
          {aside}
        </aside>
      ) : null}
    </main>
  )
}

export default LearnShell
