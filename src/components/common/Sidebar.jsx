import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, BarChart3, Flame, Gamepad2, Keyboard, Target, Timer, Trophy } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { useSettings } from '../../context/SettingsContext'
import ProgressBar from './ProgressBar'
import Icon from './Icon'

const LINKS = [
  { to: '/practice', label: 'Practice drills', icon: Keyboard },
  { to: '/test', label: 'Typing test', icon: Timer },
  { to: '/games', label: 'Typing games', icon: Gamepad2 },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
]

function Sidebar({ className = '' }) {
  const { pathname } = useLocation()
  const { stats, nextAchievement } = useProgress()
  const { settings } = useSettings()

  const goal = settings.dailyGoal || 15
  const todayMinutes = stats.todaySeconds / 60
  const goalPercent = Math.min(100, Math.round((todayMinutes / goal) * 100))

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-card">
        <div className="sidebar-card__title">
          <Keyboard size={14} /> Quick links
        </div>
        <nav className="sidebar-links" aria-label="Quick links">
          {LINKS.map(({ to, label, icon: LinkIcon }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${pathname === to || pathname.startsWith(`${to}/`) ? 'active' : ''}`}
            >
              <LinkIcon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-card">
        <div className="sidebar-card__title">
          <Target size={14} /> Daily goal
        </div>
        <div className="spread" style={{ marginBottom: '0.55rem' }}>
          <strong style={{ fontSize: '0.9rem' }}>
            {Math.round(todayMinutes)} / {goal} min
          </strong>
          <span className="chip chip--primary">{goalPercent}%</span>
        </div>
        <ProgressBar value={goalPercent} />
        <p className="small muted" style={{ marginTop: '0.6rem', fontSize: '0.72rem' }}>
          {goalPercent >= 100
            ? 'Goal complete. Beautiful work today.'
            : `${Math.max(0, Math.ceil(goal - todayMinutes))} minutes to hit today's target.`}
        </p>
      </div>

      <div className="sidebar-card">
        <div className="sidebar-card__title">
          <Flame size={14} /> Streak
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700 }}>
              {stats.streak} <span className="small muted">days</span>
            </div>
            <span className="small muted" style={{ fontSize: '0.72rem' }}>
              Best: {stats.bestStreak} days
            </span>
          </div>
          <Flame size={34} style={{ color: 'var(--warning)' }} />
        </div>
      </div>

      {nextAchievement && (
        <div className="sidebar-card">
          <div className="sidebar-card__title">
            <Trophy size={14} /> Next achievement
          </div>
          <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
            <span
              className="icon-tile"
              style={{ width: 36, height: 36, background: 'var(--surface-2)', color: 'var(--primary)' }}
            >
              <Icon name={nextAchievement.icon} size={17} />
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <strong style={{ fontSize: '0.82rem', display: 'block' }}>{nextAchievement.title}</strong>
              <p className="small muted" style={{ fontSize: '0.7rem', marginBottom: '0.45rem' }}>
                {nextAchievement.progress}% complete
              </p>
              <ProgressBar value={nextAchievement.progress} />
            </div>
          </div>
          <Link
            to="/achievements"
            className="sidebar-link"
            style={{ marginTop: '0.65rem', fontSize: '0.75rem', paddingInline: 0 }}
          >
            View all achievements <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
