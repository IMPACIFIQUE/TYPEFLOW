import { Timer } from 'lucide-react'

/**
 * Countdown timer for timed sessions; elapsed timer for fixed drills.
 */
function TypingTimer({ mode = 'timed', timeLeft = 0, elapsed = 0, className = '' }) {
  const isTimed = mode === 'timed'
  const value = isTimed ? Math.max(0, Math.ceil(timeLeft)) : Math.floor(elapsed)
  const danger = isTimed && timeLeft <= 5 && timeLeft > 0

  return (
    <div
      className={`typing-timer ${danger ? 'typing-timer--danger' : ''} ${className}`}
      aria-live="off"
      aria-label={isTimed ? `${value} seconds left` : `${value} seconds elapsed`}
    >
      <Timer size={16} style={{ alignSelf: 'center', color: 'var(--muted)' }} />
      <span className="typing-timer__value">{value}</span>
      <span className="typing-timer__unit">{isTimed ? 'sec left' : 'sec'}</span>
    </div>
  )
}

export default TypingTimer
