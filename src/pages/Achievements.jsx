import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Filter,
  Lock,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { ACHIEVEMENTS, TIERS } from '../data/achievements'
import { formatNumber } from '../utils/format'
import ProgressBar from '../components/common/ProgressBar'
import Icon from '../components/common/Icon'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'unlocked', label: 'Unlocked' },
  { value: 'locked', label: 'Locked' },
]

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

function AchievementCard({ achievement }) {
  const tier = TIERS[achievement.tier] || TIERS.bronze
  const accentStyle = { '--accent': tier.accent, '--accent-soft': tier.soft }

  return (
    <article
      className={`achievement ${achievement.unlocked ? 'achievement--unlocked' : 'achievement--locked'}`}
      style={accentStyle}
    >
      <div className="achievement__medal" aria-hidden="true">
        {achievement.unlocked ? (
          <Icon name={achievement.icon} size={24} />
        ) : (
          <Lock size={21} />
        )}
      </div>

      <div className="achievement__body" style={{ flex: 1 }}>
        <div className="achievement__title">
          {achievement.title}
          {achievement.unlocked && (
            <span className="badge" style={{ color: 'var(--success)' }}>
              <Check size={12} />
            </span>
          )}
        </div>
        <p className="achievement__desc">{achievement.description}</p>

        <div className="row" style={{ gap: '0.35rem', marginTop: '0.55rem', flexWrap: 'wrap' }}>
          <span
            className="chip"
            style={{ color: tier.accent, background: tier.soft, borderColor: 'transparent' }}
          >
            {tier.label}
          </span>
          {achievement.unlocked ? (
            <span className="chip chip--success">
              <Check size={12} /> Unlocked
            </span>
          ) : (
            <span className="chip">
              <Lock size={12} /> In progress
            </span>
          )}
        </div>

        <div className="achievement__progress">
          <div className="achievement__progress-label">
            <span>
              {formatNumber(achievement.current)} / {formatNumber(achievement.target)}
            </span>
            <span>{achievement.progress}%</span>
          </div>
          <ProgressBar
            value={achievement.progress}
            variant={achievement.unlocked ? 'success' : ''}
          />
        </div>
      </div>
    </article>
  )
}

function Achievements() {
  const { achievements, unlockedAchievements, nextAchievement } = useProgress()
  const [status, setStatus] = useState('all')
  const [tier, setTier] = useState('all')
  const [query, setQuery] = useState('')

  const total = achievements.length
  const unlockedCount = unlockedAchievements.length
  const percent = total ? Math.round((unlockedCount / total) * 100) : 0

  const tierCounts = useMemo(() => {
    const counts = { all: ACHIEVEMENTS.length }
    Object.keys(TIERS).forEach((key) => {
      counts[key] = ACHIEVEMENTS.filter((achievement) => achievement.tier === key).length
    })
    return counts
  }, [])

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    return achievements
      .filter((achievement) => {
        if (status === 'unlocked' && !achievement.unlocked) return false
        if (status === 'locked' && achievement.unlocked) return false
        if (tier !== 'all' && achievement.tier !== tier) return false
        if (
          search &&
          !`${achievement.title} ${achievement.description}`.toLowerCase().includes(search)
        ) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
        return b.progress - a.progress
      })
  }, [achievements, status, tier, query])

  const hasFilters = status !== 'all' || tier !== 'all' || query.trim().length > 0

  const clearFilters = () => {
    setStatus('all')
    setTier('all')
    setQuery('')
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Trophy size={14} /> Milestones
            </span>
            <h1 className="page-head__title">Achievements</h1>
            <p className="page-head__subtitle">
              A map of everything you have earned so far. Every session moves at least one bar
              forward.
            </p>
          </div>
          <div className="row">
            <Link to="/progress" className="btn btn--outline">
              View progress <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <section className="achievement-summary" aria-label="Achievement summary">
          <SummaryCard
            label="Unlocked"
            value={unlockedCount}
            suffix={`/ ${total}`}
            foot={`${total - unlockedCount} still to go`}
            icon={Trophy}
            tone="warning"
          />
          <SummaryCard
            label="Completion"
            value={percent}
            suffix="%"
            foot={`${percent === 100 ? 'Full collection' : 'Keep stacking wins'}`}
            icon={Target}
            tone="success"
          />
          <SummaryCard
            label="Closest"
            value={nextAchievement ? nextAchievement.progress : 100}
            suffix="%"
            foot={nextAchievement ? nextAchievement.title : 'Every achievement unlocked'}
            icon={Sparkles}
            tone="secondary"
          />
          <SummaryCard
            label="Platinum"
            value={achievements.filter((item) => item.tier === 'platinum' && item.unlocked).length}
            suffix={`/ ${tierCounts.platinum}`}
            foot="The rarest tier"
            icon={Sparkles}
            tone="primary"
          />
        </section>

        <div className="chart-card" style={{ marginBottom: '1.25rem' }}>
          <div className="chart-card__head" style={{ marginBottom: '0.9rem' }}>
            <div className="row" style={{ gap: '0.35rem', flexWrap: 'wrap' }}>
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`chip ${status === option.value ? 'chip--primary' : ''}`}
                  onClick={() => setStatus(option.value)}
                  style={{ cursor: 'pointer' }}
                >
                  {option.label}
                  <b style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                    {option.value === 'all'
                      ? total
                      : option.value === 'unlocked'
                        ? unlockedCount
                        : total - unlockedCount}
                  </b>
                </button>
              ))}
            </div>

            <div className="row" style={{ gap: '0.4rem' }}>
              <div className="input-with-icon" style={{ minWidth: 210 }}>
                <Search size={15} />
                <input
                  className="input"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search achievements"
                  aria-label="Search achievements"
                  style={{ height: 38 }}
                />
                {query && (
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: 26, height: 26, right: 6 }}
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              {hasFilters && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={clearFilters}>
                  <Filter size={14} /> Reset
                </button>
              )}
            </div>
          </div>

          <div className="row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`chip ${tier === 'all' ? 'chip--primary' : ''}`}
              onClick={() => setTier('all')}
              style={{ cursor: 'pointer' }}
            >
              All tiers <b className="mono" style={{ fontSize: '0.68rem' }}>{tierCounts.all}</b>
            </button>
            {Object.entries(TIERS).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                className={`chip ${tier === key ? 'chip--primary' : ''}`}
                onClick={() => setTier(key)}
                style={{
                  cursor: 'pointer',
                  color: tier === key ? undefined : meta.accent,
                  background: tier === key ? undefined : meta.soft,
                  borderColor: 'transparent',
                }}
              >
                {meta.label}
                <b className="mono" style={{ fontSize: '0.68rem' }}>{tierCounts[key]}</b>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state" style={{ paddingBlock: '3.5rem' }}>
            <span className="empty-state__icon">
              <Trophy size={30} />
            </span>
            <h3>No achievements match those filters</h3>
            <p>Try a different tier or search term — or clear everything and start fresh.</p>
            <button type="button" className="btn btn--outline" onClick={clearFilters} style={{ marginTop: '1rem' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="spread" style={{ marginBottom: '0.8rem' }}>
              <span className="small muted">
                Showing {filtered.length} of {total} achievements
              </span>
              <span className="small muted">Unlocked first, closest next</span>
            </div>
            <div className="achievement-grid">
              {filtered.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Achievements
