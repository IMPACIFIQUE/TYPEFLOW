import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Flame,
  Gauge,
  KeyRound,
  LogIn,
  LogOut,
  Mail,
  Pencil,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserPlus,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import AuthModal from '../components/common/AuthModal'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import ProgressBar from '../components/common/ProgressBar'
import Icon from '../components/common/Icon'
import { formatDate, formatRelativeDay, formatTime } from '../utils/format'
import { getPersonalBests } from '../services/progressService'

const AVATAR_COLORS = [
  'linear-gradient(135deg, #6D4AFF, #A855F7)',
  'linear-gradient(135deg, #F59E0B, #DC2626)',
  'linear-gradient(135deg, #16A34A, #0D9488)',
  'linear-gradient(135deg, #6D4AFF, #0E7490)',
  'linear-gradient(135deg, #EC4899, #F59E0B)',
]

const RANKS = [
  { min: 1, label: 'Novice', tone: 'bronze' },
  { min: 4, label: 'Apprentice', tone: 'silver' },
  { min: 8, label: 'Practitioner', tone: 'silver' },
  { min: 13, label: 'Specialist', tone: 'gold' },
  { min: 19, label: 'Expert', tone: 'gold' },
  { min: 26, label: 'Master', tone: 'platinum' },
  { min: 34, label: 'Grandmaster', tone: 'platinum' },
]

function getLevel(stats) {
  const xp =
    stats.totalSessions * 20 +
    stats.lessonsCompleted * 40 +
    stats.lessonStars * 12 +
    stats.perfectRuns * 15
  const level = Math.floor(Math.sqrt(xp / 50)) + 1
  const currentFloor = 50 * (level - 1) ** 2
  const nextFloor = 50 * level ** 2
  const progress = Math.min(100, ((xp - currentFloor) / (nextFloor - currentFloor)) * 100)
  const rank = RANKS.filter((item) => level >= item.min).at(-1) || RANKS[0]
  return { xp, level, progress, rank, nextXp: nextFloor - xp }
}

function LevelRing({ level, progress }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="level-ring">
      <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="42" r={radius} fill="none" stroke="var(--surface-3)" strokeWidth="8" />
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s var(--ease-out)' }}
        />
      </svg>
      <div className="level-ring__text">
        <b>{level}</b>
        <span>Level</span>
      </div>
    </div>
  )
}

function PersonalBestTile({ label, value, suffix }) {
  return (
    <div className="pb-tile">
      <div className="pb-tile__label">{label}</div>
      <div className="pb-tile__value">
        {value}
        {suffix && <small> {suffix}</small>}
      </div>
    </div>
  )
}

function Profile() {
  const { user, isAuthenticated, updateProfile, signOut } = useAuth()
  const { stats, progress, achievements, unlockedAchievements } = useProgress()
  const { settings } = useSettings()

  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signup')
  const [editOpen, setEditOpen] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftColor, setDraftColor] = useState(AVATAR_COLORS[0])
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState(false)

  const level = useMemo(() => getLevel(stats), [stats])
  const personalBests = useMemo(() => getPersonalBests(progress), [progress])
  const recentSessions = progress.sessions.slice(0, 6)
  const recentUnlocks = useMemo(
    () => unlockedAchievements.slice().reverse().slice(0, 4),
    [unlockedAchievements]
  )

  const openAuth = (mode) => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  const openEdit = () => {
    setDraftName(user?.name || '')
    setDraftColor(user?.avatarColor || AVATAR_COLORS[0])
    setFormError('')
    setSaved(false)
    setEditOpen(true)
  }

  const handleSave = (event) => {
    event.preventDefault()
    setFormError('')
    try {
      updateProfile({ name: draftName, avatarColor: draftColor })
      setEditOpen(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2600)
    } catch (error) {
      setFormError(error.message || 'Could not update your profile.')
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-head">
            <div>
              <span className="eyebrow">
                <UserPlus size={14} /> Your profile
              </span>
              <h1 className="page-head__title">Make TypeFlow yours</h1>
              <p className="page-head__subtitle">
                Create a local account to keep a named profile, a personal best board and a
                progress history that survives reloads.
              </p>
            </div>
          </div>

          <section className="profile-hero">
            <div className="profile-hero__banner" />
            <div className="profile-hero__body">
              <div className="profile-hero__identity">
                <span
                  className="avatar profile-hero__avatar"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  TF
                </span>
                <div>
                  <h2 className="profile-hero__name">Guest typist</h2>
                  <div className="profile-hero__meta">
                    <span className="chip">
                      <KeyRound size={12} /> Guest session
                    </span>
                    <span>Progress stored on this device</span>
                  </div>
                </div>
              </div>
              <div className="profile-hero__actions">
                <Button onClick={() => openAuth('signup')}>
                  <UserPlus size={16} /> Create account
                </Button>
                <Button variant="outline" onClick={() => openAuth('signin')}>
                  <LogIn size={16} /> Sign in
                </Button>
              </div>
            </div>
          </section>

          <div className="progress-stats">
            <div className="stat-card">
              <div className="stat-card__label">Sessions so far</div>
              <div className="stat-card__value">{stats.totalSessions}</div>
              <div className="stat-card__foot">Guest progress on this device</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Best speed</div>
              <div className="stat-card__value">
                {Math.round(stats.bestWpm)}
                <small>wpm</small>
              </div>
              <div className="stat-card__foot">Keep the momentum going</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Current streak</div>
              <div className="stat-card__value">
                {stats.streak}
                <small>days</small>
              </div>
              <div className="stat-card__foot">Best {stats.bestStreak} days</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Achievements</div>
              <div className="stat-card__value">
                {unlockedAchievements.length}
                <small>/ {achievements.length}</small>
              </div>
              <div className="stat-card__foot">Unlocked as a guest</div>
            </div>
          </div>

          <div className="profile-grid">
            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.8rem' }}>
                <Sparkles size={16} /> Why create an account?
              </div>
              <div className="stack" style={{ gap: '0.85rem' }}>
                {[
                  ['A named profile', 'Your name, initials and avatar gradient across the app.'],
                  ['Separate progress', 'Keep progress for each person on this device, fully offline.'],
                  ['A real profile page', 'Personal bests, recent sessions and level progression in one place.'],
                ].map(([title, text]) => (
                  <div key={title} style={{ display: 'flex', gap: '0.65rem' }}>
                    <span className="best-item__icon" style={{ width: 32, height: 32 }}>
                      <Check size={15} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 650, fontSize: 'var(--text-sm)' }}>{title}</div>
                      <div className="small muted">{text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="auth-guest" style={{ marginTop: '1rem', cursor: 'default' }}>
                <ShieldCheck size={14} /> Accounts and passwords stay in this browser only.
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.75rem' }}>
                <Trophy size={16} /> Guest highlights
              </div>
              <div className="pb-grid">
                <PersonalBestTile label="Best WPM" value={Math.round(stats.bestWpm)} suffix="wpm" />
                <PersonalBestTile
                  label="Accuracy"
                  value={Math.round(stats.bestAccuracy)}
                  suffix="%"
                />
                <PersonalBestTile label="Minutes" value={stats.totalMinutes} suffix="min" />
                <PersonalBestTile label="Lessons" value={stats.lessonsCompleted} suffix="/ 30" />
              </div>
              <Link to="/progress" className="btn btn--soft btn--sm" style={{ marginTop: '0.9rem' }}>
                Explore full progress <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">
        {saved && (
          <div className="chip chip--success" style={{ marginBottom: '1rem' }}>
            <Check size={14} /> Profile updated
          </div>
        )}

        <section className="profile-hero">
          <div className="profile-hero__banner" />
          <div className="profile-hero__body">
            <div className="profile-hero__identity">
              <span
                className="avatar profile-hero__avatar"
                style={{ background: user.avatarColor }}
                aria-hidden="true"
              >
                {user.initials}
              </span>
              <div>
                <h1 className="profile-hero__name">{user.name}</h1>
                <div className="profile-hero__meta">
                  <span className="chip chip--primary">
                    <Sparkles size={12} /> Level {level.level} · {level.rank.label}
                  </span>
                  <span className="chip">
                    <CalendarDays size={12} /> Joined {formatDate(user.createdAt)}
                  </span>
                  <span className="chip chip--success">
                    <Flame size={12} /> {stats.streak} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="profile-hero__actions">
              <Button variant="soft" onClick={openEdit}>
                <Pencil size={15} /> Edit profile
              </Button>
              <Link to="/settings" className="btn btn--outline">
                <SettingsIcon size={15} /> Settings
              </Link>
              <Button variant="ghost" onClick={signOut} title="Sign out of this local account">
                <LogOut size={15} /> Sign out
              </Button>
            </div>
          </div>
        </section>

        <div className="profile-grid">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <div className="chart-card level-card">
              <LevelRing level={level.level} progress={level.progress} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="spread">
                  <div>
                    <div className="eyebrow" style={{ marginBottom: '0.15rem' }}>
                      {level.rank.label}
                    </div>
                    <h2 style={{ fontSize: 'var(--text-lg)' }}>Level {level.level}</h2>
                  </div>
                  <span className="chip chip--primary">{Math.round(level.xp)} XP</span>
                </div>
                <ProgressBar value={level.progress} className="achievement__progress" />
                <p className="small muted" style={{ marginTop: '0.5rem' }}>
                  {level.nextXp} XP until level {level.level + 1}. Sessions, lessons and flawless
                  runs all add XP.
                </p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card__head" style={{ marginBottom: '0.85rem' }}>
                <div>
                  <div className="chart-card__title">
                    <BarChart3 size={16} /> Recent sessions
                  </div>
                  <p className="chart-card__sub">Your last six runs across every mode</p>
                </div>
                <Link to="/progress" className="btn btn--ghost btn--sm">
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              {recentSessions.length === 0 ? (
                <div className="chart-empty">
                  <div>
                    <Gauge size={26} style={{ opacity: 0.45 }} />
                    <p style={{ marginTop: '0.45rem' }}>No sessions yet. Your first run is waiting.</p>
                    <Link to="/test" className="btn btn--primary btn--sm" style={{ marginTop: '0.75rem' }}>
                      Take a test
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="profile-recent">
                  {recentSessions.map((session) => (
                    <div className="profile-recent__row" key={session.id}>
                      <span className="muted" style={{ minWidth: 82 }}>
                        {formatRelativeDay(session.date)}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {session.lessonTitle || session.label || session.type}
                      </span>
                      <b>{Math.round(session.wpm)} WPM</b>
                      <span className="chip chip--success" style={{ fontSize: '0.65rem' }}>
                        {Math.round(session.accuracy)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="chart-card">
              <div className="chart-card__head" style={{ marginBottom: '0.85rem' }}>
                <div className="chart-card__title">
                  <Trophy size={16} /> Achievements
                </div>
                <Link to="/achievements" className="btn btn--ghost btn--sm">
                  All {unlockedAchievements.length} <ArrowRight size={14} />
                </Link>
              </div>
              {recentUnlocks.length === 0 ? (
                <p className="small muted">
                  Finish a session to unlock your first achievement — it will show up here.
                </p>
              ) : (
                <div className="stack" style={{ gap: '0.55rem' }}>
                  {recentUnlocks.map((achievement) => (
                    <div className="best-item" key={achievement.id}>
                      <span className="best-item__icon">
                        <Icon name={achievement.icon} size={17} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 650, fontSize: 'var(--text-sm)' }}>
                          {achievement.title}
                        </div>
                        <div className="small muted">{achievement.description}</div>
                      </div>
                      <span className="chip chip--success">
                        <Check size={12} /> Unlocked
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="stack" style={{ gap: '1.25rem' }}>
            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.75rem' }}>
                <Gauge size={16} /> Personal bests
              </div>
              <div className="pb-grid">
                <PersonalBestTile label="Best WPM" value={Math.round(stats.bestWpm)} suffix="wpm" />
                <PersonalBestTile
                  label="Best accuracy"
                  value={Math.round(stats.bestAccuracy)}
                  suffix="%"
                />
                <PersonalBestTile label="Streak" value={stats.bestStreak} suffix="days" />
                <PersonalBestTile
                  label="Lessons"
                  value={stats.lessonsCompleted}
                  suffix="/ 30"
                />
                <PersonalBestTile label="Tests" value={stats.totalTests} />
                <PersonalBestTile label="Games" value={stats.gamesPlayed} />
              </div>
              {personalBests.test && (
                <p className="small muted" style={{ marginTop: '0.75rem' }}>
                  Best test: {Math.round(personalBests.test.wpm)} WPM at{' '}
                  {Math.round(personalBests.test.accuracy)}% accuracy.
                </p>
              )}
            </div>

            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.75rem' }}>
                <Target size={16} /> This month
              </div>
              <div className="stack" style={{ gap: '0.7rem' }}>
                <div className="spread">
                  <span className="small muted">Sessions</span>
                  <b className="mono small">{stats.totalSessions}</b>
                </div>
                <div className="spread">
                  <span className="small muted">Practice time</span>
                  <b className="mono small">{formatTime(stats.totalSeconds)}</b>
                </div>
                <div className="spread">
                  <span className="small muted">Characters typed</span>
                  <b className="mono small">{stats.totalChars.toLocaleString()}</b>
                </div>
                <div className="spread">
                  <span className="small muted">Daily goal</span>
                  <b className="mono small">{settings.dailyGoal} min</b>
                </div>
                <div className="spread">
                  <span className="small muted">Completed today</span>
                  <b className="mono small">{Math.round(stats.todaySeconds / 60)} min</b>
                </div>
              </div>
              <div className="achievement__progress" style={{ marginTop: '0.6rem' }}>
                <ProgressBar
                  value={Math.min(
                    100,
                    (stats.todaySeconds / 60 / Math.max(1, settings.dailyGoal)) * 100
                  )}
                  variant="success"
                />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.75rem' }}>
                <Mail size={16} /> Account
              </div>
              <div className="stack" style={{ gap: '0.6rem' }}>
                <div>
                  <div className="small muted">Name</div>
                  <div style={{ fontWeight: 650 }}>{user.name}</div>
                </div>
                <div>
                  <div className="small muted">Email</div>
                  <div style={{ wordBreak: 'break-word', fontSize: 'var(--text-sm)' }}>
                    {user.email}
                  </div>
                </div>
                <div className="auth-guest" style={{ cursor: 'default' }}>
                  <ShieldCheck size={14} /> Local account · stored in this browser
                </div>
              </div>
            </div>

            <div className="chart-card" style={{ background: 'var(--gradient-soft)' }}>
              <div className="chart-card__title" style={{ marginBottom: '0.5rem' }}>
                <Zap size={16} /> Keep the flow
              </div>
              <p className="small muted">
                The best improvements come from short, regular sessions. Try a 15-minute practice
                block, then log a test.
              </p>
              <div className="row" style={{ marginTop: '0.75rem' }}>
                <Link to="/practice" className="btn btn--primary btn--sm">
                  Practice <ArrowRight size={14} />
                </Link>
                <Link to="/test" className="btn btn--soft btn--sm">
                  Test
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <Modal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit your profile"
          subtitle="Change how your name and initials appear across TypeFlow."
        >
          <form className="auth-form" onSubmit={handleSave}>
            <label className="field">
              <span className="field__label">Display name</span>
              <input
                className="input"
                value={draftName}
                onChange={(event) => {
                  setDraftName(event.target.value)
                  setFormError('')
                }}
                placeholder="Your name"
                autoFocus
                maxLength={40}
              />
              <span className="field__hint">At least 2 characters. Initials update automatically.</span>
            </label>

            <div className="field">
              <span className="field__label">Avatar gradient</span>
              <div className="row" style={{ gap: '0.5rem', marginTop: '0.2rem' }}>
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setDraftColor(color)}
                    aria-label="Choose avatar colour"
                    aria-pressed={draftColor === color}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: color,
                      border: draftColor === color ? '3px solid var(--text)' : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {formError && <div className="auth-error">{formError}</div>}

            <div className="row" style={{ justifyContent: 'flex-end', marginTop: '0.35rem' }}>
              <Button variant="ghost" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Check size={15} /> Save changes
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </main>
  )
}

export default Profile
