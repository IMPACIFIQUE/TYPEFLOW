import { useMemo, useState } from 'react'
import { ArrowRight, Check, Copy, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import TypingChart from './TypingChart'
import { formatTime } from '../../utils/format'
import Icon from '../common/Icon'

const CONFETTI_COLORS = ['#6D4AFF', '#A855F7', '#16A34A', '#F59E0B', '#EC4899', '#2DD4BF']

function ratingFor(wpm) {
  if (wpm >= 100) return { label: 'Elite speed', tone: 'secondary', icon: 'crown' }
  if (wpm >= 80) return { label: 'Blazing fast', tone: 'secondary', icon: 'rocket' }
  if (wpm >= 65) return { label: 'Very fast', tone: 'primary', icon: 'zap' }
  if (wpm >= 50) return { label: 'Solid pace', tone: 'primary', icon: 'gauge' }
  if (wpm >= 35) return { label: 'Getting there', tone: 'info', icon: 'target' }
  if (wpm >= 20) return { label: 'Building rhythm', tone: 'warning', icon: 'flame' }
  return { label: 'Keep going', tone: 'warning', icon: 'sparkles' }
}

/**
 * Full post-session summary, including chart, breakdown, achievements and
 * shareable results.
 */
function ResultPanel({
  result,
  onRepeat,
  onNext,
  nextLabel = 'Next test',
  repeatLabel = 'Repeat',
  personalBest = false,
  newAchievements = [],
  celebrate = false,
  children,
}) {
  const [copied, setCopied] = useState(false)

  const confetti = useMemo(() => {
    if (!celebrate) return []
    return Array.from({ length: 28 }).map((_, index) => ({
      id: index,
      left: `${(index * 37) % 100}%`,
      delay: `${(index % 7) * 0.09}s`,
      duration: `${1.3 + (index % 5) * 0.18}s`,
      drift: `${-70 + ((index * 53) % 140)}px`,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      rotate: `${(index * 47) % 360}deg`,
    }))
  }, [celebrate])

  if (!result) return null

  const wpm = Math.round(result.wpm)
  const accuracy = Math.round(result.accuracy)
  const consistency = Math.round(result.consistency || 0)
  const rawWpm = Math.round(result.rawWpm || 0)
  const rating = ratingFor(wpm)

  const handleShare = async () => {
    const shareText = `TypeFlow — ${wpm} WPM, ${accuracy}% accuracy, ${consistency}% consistency. ${result.correctChars} correct characters in ${formatTime(result.duration)}.`
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="result-panel" aria-label="Session results">
      {confetti.map((piece) => (
        <span
          key={piece.id}
          className="confetti"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            transform: `rotate(${piece.rotate})`,
            '--drift': piece.drift,
          }}
        />
      ))}

      <div className="result-panel__head">
        <div>
          <span className="eyebrow">
            <Check size={14} /> Session complete
          </span>
          <div className="result-wpm" style={{ marginTop: '0.35rem' }}>
            <span className="result-wpm__value">{wpm}</span>
            <span className="result-wpm__label">WPM</span>
          </div>
          <div className="row" style={{ marginTop: '0.65rem' }}>
            <span className={`chip chip--${rating.tone}`}>
              <Icon name={rating.icon} size={13} /> {rating.label}
            </span>
            {personalBest && (
              <span className="chip chip--warning">
                <Trophy size={13} /> New personal best
              </span>
            )}
          </div>
        </div>

        <div className="row" style={{ alignSelf: 'flex-end' }}>
          <span className="chip">
            <Sparkles size={13} /> {result.completed ? 'Completed' : 'Time up'}
          </span>
          <span className="chip chip--secondary">{formatTime(result.duration)}</span>
        </div>
      </div>

      <div className="result-panel__body">
        <div className="result-grid">
          <div className="result-metric">
            <div className="result-metric__label">Accuracy</div>
            <div className="result-metric__value">{accuracy}%</div>
          </div>
          <div className="result-metric">
            <div className="result-metric__label">Consistency</div>
            <div className="result-metric__value">{consistency}%</div>
          </div>
          <div className="result-metric">
            <div className="result-metric__label">Raw WPM</div>
            <div className="result-metric__value">{rawWpm}</div>
          </div>
          <div className="result-metric">
            <div className="result-metric__label">Characters</div>
            <div className="result-metric__value">
              {result.correctChars}
              <small style={{ fontSize: '0.55em', color: 'var(--muted)' }}> / {result.keystrokes}</small>
            </div>
          </div>
          <div className="result-metric">
            <div className="result-metric__label">Errors</div>
            <div className="result-metric__value" style={{ color: result.errors ? 'var(--error)' : undefined }}>
              {result.errors}
            </div>
          </div>
          <div className="result-metric">
            <div className="result-metric__label">Time</div>
            <div className="result-metric__value" style={{ fontSize: 'var(--text-lg)' }}>
              {formatTime(result.duration)}
            </div>
          </div>
        </div>

        <div className="result-chart">
          <div className="result-chart__head">
            <span>Words per minute over time</span>
            <div className="chart-legend">
              <span>
                <i /> WPM
              </span>
              <span>
                <i className="secondary" /> Raw
              </span>
            </div>
          </div>
          <TypingChart samples={result.samples} showRaw />
        </div>

        {newAchievements.length > 0 && (
          <div
            className="stack"
            style={{
              gap: '0.5rem',
              marginBottom: '1.25rem',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--warning-soft)',
              border: '1px solid color-mix(in srgb, var(--warning) 30%, transparent)',
            }}
          >
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <Trophy size={15} /> Achievement unlocked
            </strong>
            <div className="row" style={{ gap: '0.4rem' }}>
              {newAchievements.map((achievement) => (
                <span key={achievement.id} className="chip chip--warning" title={achievement.description}>
                  <Icon name={achievement.icon} size={13} /> {achievement.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {children}

        <div className="result-actions">
          {onNext && (
            <button type="button" className="btn btn--primary btn--lg" onClick={onNext}>
              {nextLabel} <ArrowRight size={17} />
            </button>
          )}
          {onRepeat && (
            <button type="button" className="btn btn--outline btn--lg" onClick={onRepeat}>
              <RotateCcw size={16} /> {repeatLabel}
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={handleShare}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Share result'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ResultPanel
