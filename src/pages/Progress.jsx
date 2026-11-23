import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Clock3,
  Flame,
  Gauge,
  Keyboard,
  Medal,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import {
  getActivityGrid,
  getPersonalBests,
  getWpmSeries,
} from '../services/progressService'
import { formatNumber, formatRelativeDay, formatShortDate, formatTime } from '../utils/format'
import ProgressBar from '../components/common/ProgressBar'
import Icon from '../components/common/Icon'
import { Segmented } from '../components/typing/TypingControls'

const TYPE_META = {
  test: { label: 'Test', icon: Gauge, tone: 'primary' },
  lesson: { label: 'Lesson', icon: Medal, tone: 'warning' },
  practice: { label: 'Practice', icon: Keyboard, tone: 'secondary' },
  challenge: { label: 'Challenge', icon: Trophy, tone: 'success' },
  game: { label: 'Game', icon: Zap, tone: 'info' },
}

const BEST_META = {
  test: { label: 'Test', icon: 'gauge' },
  lesson: { label: 'Lesson', icon: 'book-open' },
  practice: { label: 'Practice', icon: 'keyboard' },
  challenge: { label: 'Challenge', icon: 'trophy' },
  game: { label: 'Game', icon: 'gamepad-2' },
}

const RANGE_OPTIONS = [
  { value: 12, label: '12' },
  { value: 24, label: '24' },
  { value: 48, label: '48' },
]

function niceMax(value) {
  if (value <= 40) return 40
  return Math.ceil(value / 20) * 20
}

function buildPath(points) {
  if (!points.length) return ''
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

function TrendChart({ series }) {
  const [range, setRange] = useState(24)
  const [hover, setHover] = useState(null)

  const visible = useMemo(() => series.slice(-range), [series, range])

  const width = 760
  const height = 250
  const pad = { top: 18, right: 18, bottom: 28, left: 42 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const maxValue = useMemo(() => {
    const highest = visible.reduce(
      (max, session) => Math.max(max, session.wpm || 0, session.rawWpm || 0),
      0
    )
    return niceMax(highest)
  }, [visible])

  const points = useMemo(() => {
    if (!visible.length) return []
    return visible.map((session, index) => {
      const x =
        visible.length === 1
          ? pad.left + innerW / 2
          : pad.left + (index / (visible.length - 1)) * innerW
      return {
        ...session,
        x,
        y: pad.top + innerH - ((session.wpm || 0) / maxValue) * innerH,
        rawY: pad.top + innerH - ((session.rawWpm || 0) / maxValue) * innerH,
      }
    })
  }, [visible, innerW, innerH, maxValue, pad.left, pad.top])

  const hoveredPoint = hover != null ? points[hover] : null
  const step = points.length > 1 ? innerW / (points.length - 1) : innerW

  return (
    <div className="chart-card">
      <div className="chart-card__head">
        <div>
          <div className="chart-card__title">
            <TrendingUp size={16} /> Speed trend
          </div>
          <p className="chart-card__sub">Hover the line to inspect a session</p>
        </div>
        <div className="row">
          <div className="chart-legend">
            <span>
              <i /> WPM
            </span>
            <span>
              <i className="secondary" /> Raw
            </span>
          </div>
          <Segmented
            options={RANGE_OPTIONS}
            value={range}
            onChange={setRange}
            ariaLabel="Number of sessions to display"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="chart-empty">
          <div>
            <BarChart3 size={28} style={{ opacity: 0.45 }} />
            <p style={{ marginTop: '0.5rem' }}>Complete a session to start your trend line.</p>
          </div>
        </div>
      ) : (
        <div className="chart-frame">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`Speed trend across the last ${visible.length} sessions`}
            onMouseLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="wpm-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = pad.top + innerH * ratio
              const value = Math.round(maxValue * (1 - ratio))
              return (
                <g key={ratio}>
                  <line
                    className="chart-grid-line"
                    x1={pad.left}
                    y1={y}
                    x2={width - pad.right}
                    y2={y}
                  />
                  <text className="chart-axis-label" x={pad.left - 8} y={y + 3} textAnchor="end">
                    {value}
                  </text>
                </g>
              )
            })}

            {points.length > 1 && (
              <path
                d={`${buildPath(points)} L ${points[points.length - 1].x} ${
                  pad.top + innerH
                } L ${points[0].x} ${pad.top + innerH} Z`}
                fill="url(#wpm-area)"
                stroke="none"
              />
            )}
            <path className="chart-line-secondary" d={buildPath(points.map((point) => ({ ...point, y: point.rawY })))} />
            <path className="chart-line-primary" d={buildPath(points)} />

            {points.map((point, index) => (
              <circle
                key={`${point.date}-${index}`}
                className="chart-dot"
                cx={point.x}
                cy={point.y}
                r={hover === index ? 4.5 : 2.6}
              />
            ))}

            {points.length === 1 && (
              <text
                className="chart-axis-label"
                x={points[0].x}
                y={points[0].y - 12}
                textAnchor="middle"
              >
                {Math.round(points[0].wpm)} WPM
              </text>
            )}

            {[0, Math.floor((points.length - 1) / 2), points.length - 1]
              .filter((index, position, list) => index >= 0 && list.indexOf(index) === position)
              .map((index) => (
                <text
                  key={`label-${index}`}
                  className="chart-axis-label"
                  x={points[index].x}
                  y={height - 8}
                  textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
                >
                  {formatShortDate(points[index].date)}
                </text>
              ))}

            {points.map((point, index) => (
              <rect
                key={`hit-${point.date}-${index}`}
                x={point.x - Math.max(step / 2, 5)}
                y={pad.top}
                width={Math.max(step, 10)}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(index)}
              />
            ))}

            {hoveredPoint && (
              <g pointerEvents="none">
                <line
                  className="chart-grid-line"
                  x1={hoveredPoint.x}
                  y1={pad.top}
                  x2={hoveredPoint.x}
                  y2={pad.top + innerH}
                  strokeDasharray="2 4"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="5.5"
                  fill="var(--primary)"
                  stroke="var(--surface)"
                  strokeWidth="2"
                />
                <g
                  transform={`translate(${Math.min(
                    Math.max(hoveredPoint.x - 74, pad.left),
                    width - pad.right - 148
                  )}, ${Math.max(hoveredPoint.y - 78, pad.top)})`}
                >
                  <rect
                    width="148"
                    height="62"
                    rx="10"
                    fill="var(--surface)"
                    stroke="var(--border)"
                    filter="drop-shadow(0 8px 16px rgba(15, 23, 42, 0.16))"
                  />
                  <text x="12" y="18" className="chart-axis-label" fill="var(--muted)">
                    {formatRelativeDay(hoveredPoint.date)}
                  </text>
                  <text x="12" y="37" fill="var(--text)" fontSize="12" fontWeight="700">
                    {Math.round(hoveredPoint.wpm)} WPM
                  </text>
                  <text x="12" y="53" fill="var(--muted)" fontSize="10">
                    {Math.round(hoveredPoint.accuracy)}% accuracy · raw {Math.round(hoveredPoint.rawWpm)}
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>
      )}
    </div>
  )
}

function ActivityHeatmap({ progress }) {
  const [weeks, setWeeks] = useState(16)
  const cells = useMemo(() => getActivityGrid(progress, weeks), [progress, weeks])
  const activeDays = cells.filter((cell) => cell.sessions > 0).length
  const totalSeconds = cells.reduce((sum, cell) => sum + cell.seconds, 0)

  return (
    <div className="chart-card">
      <div className="chart-card__head">
        <div>
          <div className="chart-card__title">
            <CalendarDays size={16} /> Practice activity
          </div>
          <p className="chart-card__sub">
            {activeDays} active {activeDays === 1 ? 'day' : 'days'} · {formatTime(totalSeconds)} in this view
          </p>
        </div>
        <Segmented
          options={[
            { value: 8, label: '8w' },
            { value: 16, label: '16w' },
            { value: 26, label: '26w' },
          ]}
          value={weeks}
          onChange={setWeeks}
          ariaLabel="Heatmap range"
        />
      </div>

      <div className="heatmap-wrap">
        <div className="heatmap" role="img" aria-label="Typing activity heatmap">
          {cells.map((cell) => (
            <span
              key={cell.date}
              className="heatmap__cell"
              data-level={cell.level}
              title={`${formatRelativeDay(cell.date)} — ${cell.sessions} session${
                cell.sessions === 1 ? '' : 's'
              }, ${formatTime(cell.seconds)}`}
            />
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <i data-level="0" />
        <i data-level="1" />
        <i data-level="2" />
        <i data-level="3" />
        <i data-level="4" />
        <span>More</span>
      </div>
    </div>
  )
}

function StatCard({ icon: IconComponent, label, value, suffix, foot, tone = 'primary' }) {
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

function Progress() {
  const { progress, stats, nextAchievement } = useProgress()
  const { settings } = useSettings()
  const [sessionFilter, setSessionFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(8)

  const series = useMemo(() => getWpmSeries(progress, 48), [progress])
  const personalBests = useMemo(() => getPersonalBests(progress), [progress])
  const sessions = useMemo(() => progress.sessions || [], [progress])

  const filteredSessions = useMemo(() => {
    if (sessionFilter === 'all') return sessions
    return sessions.filter((session) => session.type === sessionFilter)
  }, [sessions, sessionFilter])

  const visibleSessions = filteredSessions.slice(0, visibleCount)

  const weakKeys = useMemo(() => {
    return Object.entries(stats.keyStats || {})
      .map(([key, data]) => {
        const correct = Number(data.correct) || 0
        const errors = Number(data.errors) || 0
        const total = correct + errors
        return {
          key,
          correct,
          errors,
          total,
          accuracy: total ? (correct / total) * 100 : 100,
        }
      })
      .filter((entry) => entry.total >= 5)
      .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
      .slice(0, 8)
  }, [stats.keyStats])

  const goalMinutes = Math.max(1, Number(settings.dailyGoal) || 15)
  const todayMinutes = stats.todaySeconds / 60
  const goalPercent = Math.min(100, (todayMinutes / goalMinutes) * 100)
  const goalComplete = todayMinutes >= goalMinutes

  const bestEntries = Object.entries(BEST_META)
    .map(([type, meta]) => ({ type, ...meta, session: personalBests[type] }))
    .filter((entry) => entry.session)

  const activeFilter = ['all', 'test', 'lesson', 'practice', 'challenge', 'game']

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <BarChart3 size={14} /> Your data
            </span>
            <h1 className="page-head__title">Progress that speaks for itself</h1>
            <p className="page-head__subtitle">
              Every session is measured, stored on this device and turned into a clearer picture of
              how you type.
            </p>
          </div>
          <div className="row">
            <Link to="/test" className="btn btn--primary">
              New test <ArrowRight size={16} />
            </Link>
            <Link to="/achievements" className="btn btn--outline">
              <Trophy size={16} /> Achievements
            </Link>
          </div>
        </div>

        <section className="progress-stats" aria-label="Key statistics">
          <StatCard
            icon={Activity}
            label="Sessions"
            value={formatNumber(stats.totalSessions)}
            foot={`${stats.activeDays} active days`}
          />
          <StatCard
            icon={Gauge}
            label="Best speed"
            value={Math.round(stats.bestWpm)}
            suffix="wpm"
            tone="secondary"
            foot={`Average ${Math.round(stats.avgWpm)} WPM`}
          />
          <StatCard
            icon={Target}
            label="Avg accuracy"
            value={Math.round(stats.avgAccuracy)}
            suffix="%"
            tone="success"
            foot={`${formatNumber(stats.perfectRuns)} flawless runs`}
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={stats.streak}
            suffix={stats.streak === 1 ? 'day' : 'days'}
            tone="warning"
            foot={`Best ${stats.bestStreak} days`}
          />
          <StatCard
            icon={Clock3}
            label="Time practiced"
            value={formatNumber(stats.totalMinutes)}
            suffix="min"
            tone="info"
            foot={`${formatNumber(stats.totalChars)} characters`}
          />
          <StatCard
            icon={Medal}
            label="Lessons"
            value={stats.lessonsCompleted}
            suffix="/ 30"
            foot={`${stats.lessonStars} / 90 stars earned`}
          />
        </section>

        {stats.totalSessions === 0 ? (
          <div className="empty-state" style={{ paddingBlock: '4rem' }}>
            <span className="empty-state__icon">
              <BarChart3 size={32} />
            </span>
            <h3>Your story starts with one session</h3>
            <p>
              Take a 30-second test or try your first lesson. Your speed, accuracy and consistency
              will appear here automatically.
            </p>
            <div className="row" style={{ justifyContent: 'center', marginTop: '1.25rem' }}>
              <Link to="/test" className="btn btn--primary">
                <Gauge size={16} /> Take a test
              </Link>
              <Link to="/lessons" className="btn btn--outline">
                <Medal size={16} /> Start learning
              </Link>
            </div>
          </div>
        ) : (
          <div className="progress-layout">
            <div className="stack" style={{ gap: '1.25rem' }}>
              <TrendChart series={series} />
              <ActivityHeatmap progress={progress} />

              <div className="chart-card">
                <div className="chart-card__head">
                  <div>
                    <div className="chart-card__title">
                      <Clock3 size={16} /> Recent sessions
                    </div>
                    <p className="chart-card__sub">
                      {filteredSessions.length} of {sessions.length} sessions
                    </p>
                  </div>
                  <div className="row" style={{ flexWrap: 'wrap' }}>
                    {activeFilter.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`chip ${sessionFilter === type ? 'chip--primary' : ''}`}
                        onClick={() => {
                          setSessionFilter(type)
                          setVisibleCount(8)
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {type === 'all' ? 'All' : TYPE_META[type].label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredSessions.length === 0 ? (
                  <div className="chart-empty">No {sessionFilter} sessions yet.</div>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>When</th>
                          <th>Session</th>
                          <th>WPM</th>
                          <th>Accuracy</th>
                          <th>Consistency</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleSessions.map((session) => {
                          const meta = TYPE_META[session.type] || TYPE_META.test
                          return (
                            <tr key={session.id}>
                              <td>{formatRelativeDay(session.date)}</td>
                              <td>
                                <span className={`chip chip--${meta.tone}`}>
                                  <Icon name={
                                    session.type === 'lesson'
                                      ? 'book-open'
                                      : session.type === 'game'
                                        ? 'gamepad-2'
                                        : session.type === 'challenge'
                                          ? 'trophy'
                                          : session.type === 'practice'
                                            ? 'keyboard'
                                            : 'gauge'
                                  } size={12} />
                                  {session.lessonTitle || session.label || meta.label}
                                </span>
                              </td>
                              <td className="num">{Math.round(session.wpm)}</td>
                              <td className="num">{Math.round(session.accuracy)}%</td>
                              <td className="num">{Math.round(session.consistency)}%</td>
                              <td>{formatTime(session.duration)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {visibleCount < filteredSessions.length && (
                  <div style={{ textAlign: 'center', marginTop: '0.9rem' }}>
                    <button
                      type="button"
                      className="btn btn--soft btn--sm"
                      onClick={() => setVisibleCount((count) => count + 10)}
                    >
                      Show {Math.min(10, filteredSessions.length - visibleCount)} more sessions
                    </button>
                  </div>
                )}
              </div>
            </div>

            <aside className="stack" style={{ gap: '1.25rem' }}>
              <div className="chart-card">
                <div className="chart-card__title" style={{ marginBottom: '0.75rem' }}>
                  <Target size={16} /> Today&apos;s goal
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="stat-card__value" style={{ fontSize: 'var(--text-2xl)' }}>
                    {todayMinutes < 10 ? todayMinutes.toFixed(1) : Math.round(todayMinutes)}
                  </span>
                  <span className="muted small">/ {goalMinutes} minutes</span>
                </div>
                <ProgressBar
                  value={goalPercent}
                  variant={goalComplete ? 'success' : ''}
                  className="achievement__progress"
                />
                <p className="small muted" style={{ marginTop: '0.65rem' }}>
                  {goalComplete
                    ? 'Goal complete — anything else is a bonus.'
                    : `${Math.max(0, Math.round(goalMinutes - todayMinutes))} minutes left to hit today's goal.`}
                </p>
                <div className="row" style={{ marginTop: '0.85rem' }}>
                  <Link to="/practice" className="btn btn--soft btn--sm">
                    <Keyboard size={14} /> Practice now
                  </Link>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-card__title" style={{ marginBottom: '0.85rem' }}>
                  <Trophy size={16} /> Personal bests
                </div>
                {bestEntries.length === 0 ? (
                  <p className="small muted">Your best runs will appear after your first session.</p>
                ) : (
                  <div className="best-grid">
                    {bestEntries.map((entry) => (
                      <div className="best-item" key={entry.type}>
                        <span className="best-item__icon">
                          <Icon name={entry.icon} size={17} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="best-item__label">{entry.label}</div>
                          <div className="best-item__value">
                            {Math.round(entry.session.wpm)} <small>WPM</small>
                          </div>
                        </div>
                        <span className="chip chip--success">
                          {Math.round(entry.session.accuracy)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="chart-card">
                <div className="chart-card__head" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <div className="chart-card__title">
                      <Keyboard size={16} /> Trickier keys
                    </div>
                    <p className="chart-card__sub">Lowest accuracy, min. 5 attempts</p>
                  </div>
                </div>
                {weakKeys.length === 0 ? (
                  <p className="small muted">
                    Complete a few more sessions to unlock per-key accuracy insights.
                  </p>
                ) : (
                  <div className="stack" style={{ gap: '0.55rem' }}>
                    {weakKeys.map((entry) => (
                      <div className="weak-key" key={entry.key}>
                        <span className="key-heatmap__key">{entry.key === ' ' ? 'space' : entry.key}</span>
                        <div className="weak-key__body">
                          <ProgressBar
                            value={entry.accuracy}
                            variant={
                              entry.accuracy >= 95 ? 'success' : entry.accuracy >= 85 ? '' : ''
                            }
                          />
                          <div className="weak-key__meta">
                            <span>{entry.correct}/{entry.total} correct</span>
                            <b style={{ color: entry.accuracy < 90 ? 'var(--error)' : 'var(--text)' }}>
                              {Math.round(entry.accuracy)}%
                            </b>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {nextAchievement && (
                <div className="chart-card" style={{ background: 'var(--gradient-soft, var(--surface))' }}>
                  <div className="chart-card__title" style={{ marginBottom: '0.6rem' }}>
                    <Sparkles size={16} /> Next up
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span
                      className="achievement__medal"
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 13,
                        color: 'var(--primary)',
                        background: 'var(--primary-soft)',
                      }}
                    >
                      <Icon name={nextAchievement.icon} size={20} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700 }}>{nextAchievement.title}</div>
                      <div className="small muted">{nextAchievement.description}</div>
                    </div>
                  </div>
                  <div className="achievement__progress">
                    <div className="achievement__progress-label">
                      <span>
                        {nextAchievement.current} / {nextAchievement.target}
                      </span>
                      <span>{nextAchievement.progress}%</span>
                    </div>
                    <ProgressBar value={nextAchievement.progress} />
                  </div>
                  <Link
                    to="/achievements"
                    className="btn btn--ghost btn--sm"
                    style={{ marginTop: '0.6rem' }}
                  >
                    See all achievements <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              <div className="chart-card">
                <div className="chart-card__title" style={{ marginBottom: '0.5rem' }}>
                  <Zap size={16} /> Session mix
                </div>
                <div className="stack" style={{ gap: '0.5rem' }}>
                  {[
                    ['Tests', stats.totalTests, Gauge],
                    ['Practice', stats.totalPractice, Keyboard],
                    ['Lessons', stats.totalLessonRuns, Medal],
                    ['Games', stats.totalGames, Zap],
                  ].map(([label, value, IconComponent]) => (
                    <div className="spread" key={label}>
                      <span className="small muted">
                        <IconComponent size={13} style={{ verticalAlign: '-2px', marginRight: 5 }} />
                        {label}
                      </span>
                      <b className="mono small">{formatNumber(value)}</b>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default Progress
