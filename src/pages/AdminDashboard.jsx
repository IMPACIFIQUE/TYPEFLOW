import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  Clock3,
  Database,
  Gauge,
  HardDrive,
  KeyRound,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Trophy,
  UserRound,
  Users,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { listAccounts } from '../services/authService'
import { getDerivedStats, loadProgress } from '../services/progressService'
import { getOverallLessonProgress, getUnitProgress, lessonUnits } from '../services/lessonService'
import { storage } from '../services/api'
import { formatDate, formatNumber, formatRelativeDay, formatTime } from '../utils/format'
import ProgressBar from '../components/common/ProgressBar'

function SummaryCard({ label, value, suffix, foot, icon: IconComponent, tone = 'primary' }) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">
        <span
          className="best-item__icon"
          style={{
            width: 30,
            height: 30,
            background: `var(--${tone}-soft)`,
            color: `var(--${tone})`,
            borderRadius: 9,
          }}
        >
          <IconComponent size={16} />
        </span>
        {label}
      </div>
      <div className="stat-card__value">
        {value}
        {suffix && <small>{suffix}</small>}
      </div>
      {foot && <div className="stat-card__foot">{foot}</div>}
    </div>
  )
}

function AdminDashboard() {
  const { progress: currentProgress, userId } = useProgress()
  const { settings } = useSettings()
  const [refresh, setRefresh] = useState(0)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  // `refresh` is read here so the manual refresh button re-reads localStorage.
  void refresh

  const accounts = listAccounts()
  const profiles = accounts.map((account) => {
    const progress = account.id === userId ? currentProgress : loadProgress(account.id)
    return {
      ...account,
      guest: false,
      progress,
      stats: getDerivedStats(progress),
    }
  })

  const guestProgress = loadProgress('guest')
  const guestStats = getDerivedStats(guestProgress)
  if (guestStats.totalSessions > 0 || accounts.length === 0) {
    profiles.push({
      id: 'guest',
      name: 'Guest profile',
      email: 'Not signed in',
      initials: 'G',
      avatarColor: 'linear-gradient(135deg, #64748B, #334155)',
      createdAt: null,
      guest: true,
      progress: guestProgress,
      stats: guestStats,
    })
  }

  profiles.sort((a, b) => {
    const aDate = a.stats.lastSession?.date || a.createdAt || ''
    const bDate = b.stats.lastSession?.date || b.createdAt || ''
    return new Date(bDate).getTime() - new Date(aDate).getTime()
  })

  const search = query.trim().toLowerCase()
  const filtered = search
    ? profiles.filter((profile) =>
        `${profile.name} ${profile.email}`.toLowerCase().includes(search)
      )
    : profiles

  const activeProfile =
    profiles.find((profile) => profile.id === selectedId) || profiles[0] || null

  const totals = profiles.reduce(
    (accumulator, profile) => ({
      sessions: accumulator.sessions + profile.stats.totalSessions,
      seconds: accumulator.seconds + profile.stats.totalSeconds,
      chars: accumulator.chars + profile.stats.totalChars,
      bestWpm: Math.max(accumulator.bestWpm, profile.stats.bestWpm),
      lessons: accumulator.lessons + profile.stats.lessonsCompleted,
    }),
    { sessions: 0, seconds: 0, chars: 0, bestWpm: 0, lessons: 0 }
  )

  const activityRows = []
  profiles.forEach((profile) => {
    profile.progress.sessions.slice(0, 8).forEach((session) => {
      activityRows.push({ ...session, accountName: profile.name, accountId: profile.id })
    })
  })
  const recentActivity = activityRows
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  const storageKeys = storage.keys()
  const storageEntries = storageKeys
    .map((key) => {
      const value = storage.get(key, null)
      let bytes = 0
      try {
        bytes = new Blob([JSON.stringify(value)]).size
      } catch {
        bytes = 0
      }
      return { key, bytes }
    })
    .sort((a, b) => b.bytes - a.bytes)
  const storageInfo = {
    entries: storageEntries,
    total: storageEntries.reduce((sum, entry) => sum + entry.bytes, 0),
  }

  const overall = activeProfile
    ? getOverallLessonProgress(activeProfile.progress)
    : { completed: 0, total: 30, percent: 0, stars: 0, maxStars: 90 }

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <ShieldCheck size={14} /> Local admin
            </span>
            <h1 className="page-head__title">Admin dashboard</h1>
            <p className="page-head__subtitle">
              A read-only overview of every local account on this browser: activity, lesson
              progress and storage use.
            </p>
          </div>
          <div className="row">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => setRefresh((value) => value + 1)}
            >
              <RefreshCw size={15} /> Refresh data
            </button>
            <Link to="/settings" className="btn btn--ghost">
              <SettingsIcon size={15} /> Settings
            </Link>
          </div>
        </div>

        <section className="admin-grid" aria-label="Admin summary">
          <SummaryCard
            label="Local accounts"
            value={profiles.filter((profile) => !profile.guest).length}
            foot={`${profiles.length} profiles including guest`}
            icon={Users}
            tone="primary"
          />
          <SummaryCard
            label="Total sessions"
            value={formatNumber(totals.sessions)}
            foot={`${formatTime(totals.seconds)} practiced`}
            icon={Activity}
            tone="secondary"
          />
          <SummaryCard
            label="Best speed"
            value={Math.round(totals.bestWpm)}
            suffix="wpm"
            foot={`${formatNumber(totals.chars)} characters typed`}
            icon={Gauge}
            tone="success"
          />
          <SummaryCard
            label="Lessons completed"
            value={totals.lessons}
            suffix="/ 30"
            foot={`${formatNumber(storageInfo.total / 1024)} KB in local storage`}
            icon={Trophy}
            tone="warning"
          />
        </section>

        <div className="progress-layout">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <div className="chart-card">
              <div className="chart-card__head" style={{ marginBottom: '0.9rem' }}>
                <div>
                  <div className="chart-card__title">
                    <Users size={16} /> Accounts
                  </div>
                  <p className="chart-card__sub">
                    Select a row to inspect that profile&apos;s lesson progress
                  </p>
                </div>
                <div className="input-with-icon" style={{ minWidth: 220 }}>
                  <Search size={15} />
                  <input
                    className="input"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search accounts"
                    aria-label="Search accounts"
                    style={{ height: 38 }}
                  />
                </div>
              </div>

              {profiles.length === 0 ? (
                <div className="chart-empty">
                  <div>
                    <UserRound size={28} style={{ opacity: 0.45 }} />
                    <p style={{ marginTop: '0.5rem' }}>No local accounts yet.</p>
                    <Link to="/profile" className="btn btn--primary btn--sm" style={{ marginTop: '0.75rem' }}>
                      Create the first account
                    </Link>
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="chart-empty">No accounts match “{query}”.</div>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Sessions</th>
                        <th>Best WPM</th>
                        <th>Accuracy</th>
                        <th>Lessons</th>
                        <th>Last active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((profile) => (
                        <tr
                          key={profile.id}
                          onClick={() => setSelectedId(profile.id)}
                          style={{
                            cursor: 'pointer',
                            background:
                              activeProfile?.id === profile.id ? 'var(--primary-softer)' : undefined,
                          }}
                        >
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <span
                                className="avatar"
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 9,
                                  fontSize: '0.65rem',
                                  background: profile.avatarColor,
                                }}
                              >
                                {profile.initials}
                              </span>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ color: 'var(--text)', fontWeight: 650 }}>
                                  {profile.name}
                                  {profile.id === userId && (
                                    <span className="chip chip--primary" style={{ marginLeft: 6 }}>
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="small muted" style={{ fontSize: '0.68rem' }}>
                                  {profile.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="num">{profile.stats.totalSessions}</td>
                          <td className="num">{Math.round(profile.stats.bestWpm)}</td>
                          <td className="num">{Math.round(profile.stats.avgAccuracy)}%</td>
                          <td className="num">
                            {profile.stats.lessonsCompleted}/{overall.total}
                          </td>
                          <td>
                            {profile.stats.lastSession
                              ? formatRelativeDay(profile.stats.lastSession.date)
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {activeProfile && (
              <div className="chart-card">
                <div className="chart-card__head" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span
                      className="avatar"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 13,
                        background: activeProfile.avatarColor,
                      }}
                    >
                      {activeProfile.initials}
                    </span>
                    <div>
                      <div className="chart-card__title">
                        {activeProfile.name}
                        {activeProfile.guest && <span className="chip"><KeyRound size={12} /> Guest</span>}
                      </div>
                      <p className="chart-card__sub">
                        {activeProfile.createdAt
                          ? `Joined ${formatDate(activeProfile.createdAt)}`
                          : 'No account needed · local guest data'}
                      </p>
                    </div>
                  </div>
                  <div className="row" style={{ flexWrap: 'wrap' }}>
                    <span className="chip chip--primary">{Math.round(activeProfile.stats.bestWpm)} WPM best</span>
                    <span className="chip chip--success">
                      {Math.round(activeProfile.stats.avgAccuracy)}% avg
                    </span>
                    <span className="chip chip--warning">
                      {activeProfile.stats.streak} day streak
                    </span>
                  </div>
                </div>

                <div className="spread" style={{ marginBottom: '0.35rem' }}>
                  <span className="small muted">Curriculum progress</span>
                  <span className="small muted">
                    {overall.completed}/{overall.total} lessons · {overall.stars}/{overall.maxStars}{' '}
                    stars
                  </span>
                </div>
                <ProgressBar value={overall.percent} variant="success" />

                <div className="admin-bars" style={{ marginTop: '1.25rem' }}>
                  {lessonUnits.map((unit) => {
                    const unitProgress = getUnitProgress(activeProfile.progress, unit)
                    return (
                      <div key={unit.id}>
                        <div className="admin-bar__head">
                          <span>
                            Unit {unit.number} · {unit.title}
                          </span>
                          <b>
                            {unitProgress.completed}/{unitProgress.total} · {unitProgress.stars}★
                          </b>
                        </div>
                        <ProgressBar value={unitProgress.percent} />
                      </div>
                    )
                  })}
                </div>

                <div className="divider" />

                <div className="spread" style={{ marginBottom: '0.65rem' }}>
                  <div className="chart-card__title">
                    <Clock3 size={15} /> Recent sessions
                  </div>
                  <span className="small muted">
                    {activeProfile.stats.totalSessions} total ·{' '}
                    {formatTime(activeProfile.stats.totalSeconds)}
                  </span>
                </div>

                {activeProfile.progress.sessions.length === 0 ? (
                  <p className="small muted">This profile has not completed a session yet.</p>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>When</th>
                          <th>Session</th>
                          <th>WPM</th>
                          <th>Accuracy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeProfile.progress.sessions.slice(0, 6).map((session) => (
                          <tr key={session.id}>
                            <td>{formatRelativeDay(session.date)}</td>
                            <td>{session.lessonTitle || session.label || session.type}</td>
                            <td className="num">{Math.round(session.wpm)}</td>
                            <td className="num">{Math.round(session.accuracy)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="stack" style={{ gap: '1.25rem' }}>
            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.75rem' }}>
                <Database size={16} /> Storage
              </div>
              <div className="spread" style={{ marginBottom: '0.35rem' }}>
                <span className="small muted">Total local data</span>
                <b className="mono small">{(storageInfo.total / 1024).toFixed(1)} KB</b>
              </div>
              <ProgressBar value={Math.min(100, (storageInfo.total / (5 * 1024 * 1024)) * 100)} />
              <div className="stack" style={{ gap: '0.4rem', marginTop: '0.8rem' }}>
                {storageInfo.entries.slice(0, 6).map((entry) => (
                  <div className="spread" key={entry.key}>
                    <span className="small muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.key}
                    </span>
                    <b className="mono" style={{ fontSize: '0.68rem' }}>
                      {(entry.bytes / 1024).toFixed(1)} KB
                    </b>
                  </div>
                ))}
              </div>
              <p className="small muted" style={{ marginTop: '0.7rem' }}>
                Data never leaves this browser. Clearing site data removes every profile.
              </p>
            </div>

            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.7rem' }}>
                <Activity size={16} /> Recent activity
              </div>
              {recentActivity.length === 0 ? (
                <p className="small muted">No sessions across any profile yet.</p>
              ) : (
                <div className="stack" style={{ gap: '0.5rem' }}>
                  {recentActivity.map((session) => (
                    <div key={`${session.accountId}-${session.id}`} className="profile-recent__row">
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 650, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {session.accountName}
                        </div>
                        <div className="small muted" style={{ fontSize: '0.65rem' }}>
                          {formatRelativeDay(session.date)} · {session.type}
                        </div>
                      </div>
                      <b>{Math.round(session.wpm)} WPM</b>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.7rem' }}>
                <BarChart3 size={16} /> App defaults
              </div>
              <div className="stack" style={{ gap: '0.45rem' }}>
                <div className="spread">
                  <span className="small muted">Theme</span>
                  <b className="small" style={{ textTransform: 'capitalize' }}>{settings.theme}</b>
                </div>
                <div className="spread">
                  <span className="small muted">Layout</span>
                  <b className="small" style={{ textTransform: 'uppercase' }}>{settings.layout}</b>
                </div>
                <div className="spread">
                  <span className="small muted">Strict mode</span>
                  <b className="small">{settings.strictMode ? 'On' : 'Off'}</b>
                </div>
                <div className="spread">
                  <span className="small muted">Sound</span>
                  <b className="small">{settings.sound ? 'On' : 'Off'}</b>
                </div>
                <div className="spread">
                  <span className="small muted">Daily goal</span>
                  <b className="small">{settings.dailyGoal} min</b>
                </div>
              </div>
              <Link to="/settings" className="btn btn--soft btn--sm" style={{ marginTop: '0.8rem' }}>
                <SettingsIcon size={14} /> Edit defaults
              </Link>
            </div>

            <div className="chart-card">
              <div className="chart-card__title" style={{ marginBottom: '0.5rem' }}>
                <HardDrive size={16} /> About this dashboard
              </div>
              <p className="small muted">
                TypeFlow has no server. This dashboard reads only the localStorage scoped to this
                origin, which makes it useful for demos and local classrooms.
              </p>
              <div className="row" style={{ marginTop: '0.7rem' }}>
                <span className="chip chip--success">
                  <ShieldCheck size={12} /> Offline
                </span>
                <span className="chip">
                  <HardDrive size={12} /> Browser storage
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default AdminDashboard
