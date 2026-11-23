import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Crosshair,
  Flame,
  Keyboard,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trophy,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { useTypingEngine } from '../hooks/useTypingEngine'
import { useSessionRecorder } from '../hooks/useSessionRecorder'
import { useTypingFeedback } from '../hooks/useTypingFeedback'
import { useKeyboard } from '../hooks/useKeyboard'
import { generateParagraph, generateWords, getDailyChallenge } from '../data/exercises'
import { todayKey } from '../utils/format'
import TypingArea from '../components/typing/TypingArea'
import TypingStats from '../components/typing/TypingStats'
import TypingTimer from '../components/typing/TypingTimer'
import ResultPanel from '../components/typing/ResultPanel'
import KeyboardPanel from '../components/keyboard/KeyboardPanel'
import Icon from '../components/common/Icon'

function buildChallenges(daily) {
  return [
    {
      id: 'daily',
      title: daily.variant.label,
      description:
        'A fresh passage every day. Hit the pace and accuracy target to keep your daily streak alive.',
      badge: 'Daily challenge',
      tone: 'primary',
      icon: 'trophy',
      text: daily.text,
      mode: 'fixed',
      duration: 0,
      targetWpm: daily.targetWpm,
      targetAccuracy: daily.targetAccuracy,
      allowBackspace: true,
    },
    {
      id: 'precision',
      title: 'Precision 98',
      description:
        'Thirty words of punctuation and capitals. Speed does not matter — only a clean line at 98% accuracy.',
      badge: 'Accuracy',
      tone: 'success',
      icon: 'crosshair',
      makeText: () => generateWords(30, { punctuation: true }),
      mode: 'fixed',
      duration: 0,
      targetWpm: 0,
      targetAccuracy: 98,
      allowBackspace: true,
    },
    {
      id: 'sprint',
      title: '60-second sprint',
      description:
        'One minute, no excuses. Push your pace while keeping accuracy above 95%.',
      badge: 'Speed',
      tone: 'warning',
      icon: 'zap',
      makeText: () => generateWords(150, { punctuation: true }),
      mode: 'timed',
      duration: 60,
      targetWpm: 60,
      targetAccuracy: 95,
      allowBackspace: true,
    },
    {
      id: 'endurance',
      title: 'Two-minute endurance',
      description:
        'A long-form flow test. Stay relaxed through two full paragraphs without losing your rhythm.',
      badge: 'Endurance',
      tone: 'info',
      icon: 'clock',
      makeText: () => [generateParagraph(), generateParagraph()].join(' '),
      mode: 'timed',
      duration: 120,
      targetWpm: 45,
      targetAccuracy: 95,
      allowBackspace: true,
    },
    {
      id: 'iron-fingers',
      title: 'Iron fingers',
      description:
        'No backspace. Every mistake stays on screen, so make each keystroke count.',
      badge: 'Discipline',
      tone: 'error',
      icon: 'shield-check',
      makeText: () => generateWords(30, { punctuation: true, difficulty: 'advanced' }),
      mode: 'fixed',
      duration: 0,
      targetWpm: 35,
      targetAccuracy: 96,
      allowBackspace: false,
    },
  ]
}

function goalLabel(challenge) {
  if (!challenge) return ''
  const parts = []
  if (challenge.targetWpm) parts.push(`${challenge.targetWpm} WPM`)
  parts.push(`${challenge.targetAccuracy}% accuracy`)
  return parts.join(' + ')
}

function Challenges() {
  const { progress, stats } = useProgress()
  const { settings } = useSettings()
  const daily = useMemo(() => getDailyChallenge(), [])
  const challenges = useMemo(() => buildChallenges(daily), [daily])

  const [active, setActive] = useState(null)
  const stageRef = useRef(null)

  const session = useSessionRecorder(stats.bestWpm)
  const { result, personalBest, newAchievements, finish, reset } = session

  const text = active?.text || ''

  const handleFinish = (raw) => {
    if (!active) return
    const goalMet =
      raw.accuracy >= active.targetAccuracy && (!active.targetWpm || raw.wpm >= active.targetWpm)
    finish(raw, {
      type: 'challenge',
      mode: active.mode === 'timed' ? 'time' : 'fixed',
      label: active.title,
      targetWpm: active.targetWpm,
      targetAccuracy: active.targetAccuracy,
      goalMet,
      score: Math.round(raw.wpm * raw.accuracy),
    })
  }

  const engine = useTypingEngine(text, {
    mode: active?.mode || 'fixed',
    duration: active?.duration || 0,
    strict: settings.strictMode,
    allowBackspace: active?.allowBackspace !== false,
    layout: settings.layout,
    onFinish: handleFinish,
  })
  useTypingFeedback(engine)
  const { pressed } = useKeyboard(settings.showKeyboard)

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reset])

  const startChallenge = (challenge) => {
    reset()
    const next = {
      ...challenge,
      text: challenge.makeText ? challenge.makeText() : challenge.text,
    }
    setActive(next)
    window.setTimeout(() => {
      stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    engine.restart()
  }

  const repeatChallenge = () => {
    if (!active) return
    reset()
    engine.restart()
  }

  const today = todayKey()
  const doneTitles = useMemo(() => {
    const set = new Set()
    progress.sessions
      .filter((item) => item.type === 'challenge' && item.day === today)
      .forEach((item) => set.add(item.label))
    return set
  }, [progress.sessions, today])

  const week = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - index))
      const key = todayKey(date)
      return {
        key,
        label: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
        day: date.getDate(),
        done: (progress.dailyActivity?.[key]?.sessions || 0) > 0,
        isToday: key === today,
      }
    })
  }, [progress.dailyActivity, today])

  const dailyChallenge = challenges[0]

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Trophy size={14} /> Challenges
            </span>
            <h1 className="page-head__title">Test yourself daily</h1>
            <p className="page-head__subtitle">
              Short, focused goals that keep practice interesting. Every challenge feeds your
              streak, your stats and your achievements.
            </p>
          </div>
          <div className="row" style={{ gap: '0.45rem' }}>
            <span className="chip chip--warning">
              <Flame size={13} /> {stats.streak} day streak
            </span>
            <span className="chip">
              <Trophy size={13} /> Best {Math.round(stats.bestWpm)} WPM
            </span>
          </div>
        </div>

        <section className="daily-banner">
          <div>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <Sparkles size={14} /> Today&apos;s challenge
            </span>
            <h2 style={{ marginTop: '0.5rem' }}>{daily.variant.label}</h2>
            <p>
              {daily.text.split(' ').length} words. Reach {daily.targetWpm} WPM with at least{' '}
              {daily.targetAccuracy}% accuracy to complete today&apos;s goal.
            </p>
            <div className="daily-stats">
              <div className="daily-stat">
                <b>{daily.text.split(' ').length}</b>
                <span>words</span>
              </div>
              <div className="daily-stat">
                <b>{daily.targetWpm}</b>
                <span>WPM target</span>
              </div>
              <div className="daily-stat">
                <b>{daily.targetAccuracy}%</b>
                <span>accuracy</span>
              </div>
              <div className="daily-stat">
                <b>{doneTitles.has(dailyChallenge.title) ? 'Done' : 'Open'}</b>
                <span>today</span>
              </div>
            </div>
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn--lg"
              onClick={() => startChallenge(dailyChallenge)}
            >
              <Play size={18} /> {doneTitles.has(dailyChallenge.title) ? 'Try again' : 'Take the challenge'}
            </button>
          </div>
        </section>

        <div className="card card--pad" style={{ marginBottom: '1.75rem' }}>
          <div className="spread" style={{ flexWrap: 'wrap' }}>
            <div className="streak-row">
              <div>
                <div className="row" style={{ gap: '0.4rem' }}>
                  <CalendarCheck size={16} style={{ color: 'var(--success)' }} />
                  <strong>Last seven days</strong>
                </div>
                <p className="small muted" style={{ marginTop: '0.2rem' }}>
                  {stats.streak > 0
                    ? `${stats.streak} day streak · best ${stats.bestStreak} days`
                    : 'Complete any session today to start a streak.'}
                </p>
              </div>
              <div className="streak-days">
                {week.map((day) => (
                  <div
                    key={day.key}
                    className={`streak-day ${day.done ? 'is-done' : ''} ${day.isToday ? 'is-today' : ''}`}
                    title={`${day.key}${day.done ? ' · practiced' : ''}`}
                  >
                    <span>{day.label}</span>
                    <b>{day.day}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="row" style={{ gap: '0.4rem' }}>
              <span className="chip chip--success">
                <Check size={13} /> {doneTitles.size} challenge{doneTitles.size === 1 ? '' : 's'} today
              </span>
              <span className="chip">
                <Target size={13} /> {stats.totalPractice} practice runs
              </span>
            </div>
          </div>
        </div>

        {active && (
          <section ref={stageRef} style={{ marginBottom: '2rem', scrollMarginTop: '90px' }}>
            {result ? (
              <ResultPanel
                result={result}
                onRepeat={repeatChallenge}
                onNext={() => setActive(null)}
                nextLabel="All challenges"
                repeatLabel="Retry challenge"
                personalBest={personalBest}
                newAchievements={newAchievements}
                celebrate={Boolean(result.goalMet) || personalBest}
              >
                <div
                  className="row"
                  style={{
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: result.goalMet ? 'var(--success-soft)' : 'var(--warning-soft)',
                    border: `1px solid color-mix(in srgb, ${
                      result.goalMet ? 'var(--success)' : 'var(--warning)'
                    } 35%, transparent)`,
                  }}
                >
                  <span
                    className="icon-tile"
                    style={{
                      width: 38,
                      height: 38,
                      background: 'var(--surface)',
                      color: result.goalMet ? 'var(--success)' : 'var(--warning)',
                    }}
                  >
                    {result.goalMet ? <Check size={18} /> : <Target size={18} />}
                  </span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem' }}>
                      {result.goalMet ? 'Challenge complete' : 'Goal not reached yet'}
                    </strong>
                    <span className="small muted">
                      Target: {goalLabel(active)}. You hit {Math.round(result.wpm)} WPM at{' '}
                      {Math.round(result.accuracy)}% accuracy.
                    </span>
                  </div>
                </div>
              </ResultPanel>
            ) : (
              <>
                <div className="test-livebar">
                  <div>
                    <span className="eyebrow">
                      <Trophy size={14} /> Active challenge
                    </span>
                    <h2 style={{ fontSize: 'var(--text-2xl)', marginTop: '0.25rem' }}>{active.title}</h2>
                  </div>
                  <div className="row" style={{ gap: '0.45rem' }}>
                    <span className="chip chip--primary">
                      <Target size={13} /> {goalLabel(active)}
                    </span>
                    <span className="chip">
                      {active.mode === 'timed' ? (
                        <>
                          <Timer size={13} /> {active.duration}s limit
                        </>
                      ) : (
                        <>
                          <Keyboard size={13} /> {active.text.split(' ').length} words
                        </>
                      )}
                    </span>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => setActive(null)}>
                      Close
                    </button>
                  </div>
                </div>

                <div className="typing-panel">
                  <div className="typing-panel__head">
                    <div className="typing-panel__meta">
                      <Trophy size={15} /> {active.title}
                      {!active.allowBackspace && (
                        <span className="chip chip--error" style={{ marginLeft: '0.35rem' }}>
                          <ShieldCheck size={12} /> No backspace
                        </span>
                      )}
                    </div>
                    <div className="row" style={{ gap: '0.9rem' }}>
                      <TypingTimer
                        mode={active.mode === 'timed' ? 'timed' : 'fixed'}
                        timeLeft={engine.timeLeft}
                        elapsed={engine.elapsedSeconds}
                      />
                      <button type="button" className="btn btn--ghost btn--sm" onClick={repeatChallenge}>
                        Restart
                      </button>
                    </div>
                  </div>

                  <div className="typing-panel__body">
                    <TypingArea
                      text={text}
                      engine={engine}
                      onRestart={repeatChallenge}
                      blindMode={settings.blindMode}
                    />
                  </div>

                  <TypingStats
                    wpm={engine.wpm}
                    accuracy={engine.accuracy}
                    consistency={engine.consistency}
                    correctChars={engine.correctChars}
                    incorrectChars={engine.incorrectChars}
                    totalChars={engine.totalTyped}
                    errors={engine.errors}
                  />
                </div>

                {settings.showKeyboard && (
                  <KeyboardPanel
                    nextChar={engine.nextChar}
                    errorKey={engine.errorPulse ? engine.errorKey : null}
                    pressed={pressed}
                  />
                )}
              </>
            )}
          </section>
        )}

        <div className="challenge-grid">
          {challenges.map((challenge) => {
            const done = doneTitles.has(challenge.title)
            return (
              <article
                key={challenge.id}
                className={`challenge-card card card--hover ${done ? 'challenge-card--done' : ''}`}
              >
                <div className="challenge-card__head">
                  <span className={`icon-tile icon-tile--${challenge.tone}`} style={{ width: 38, height: 38 }}>
                    <Icon name={challenge.icon} size={18} />
                  </span>
                  <span className={`chip chip--${challenge.tone}`}>{challenge.badge}</span>
                </div>
                <h3 className="challenge-card__title">{challenge.title}</h3>
                <p className="challenge-card__desc">{challenge.description}</p>
                <div className="row" style={{ gap: '0.35rem' }}>
                  <span className="chip">
                    <Target size={12} /> {goalLabel(challenge)}
                  </span>
                  {challenge.mode === 'timed' && (
                    <span className="chip">
                      <Clock size={12} /> {challenge.duration}s
                    </span>
                  )}
                  {!challenge.allowBackspace && (
                    <span className="chip chip--error">
                      <ShieldCheck size={12} /> No backspace
                    </span>
                  )}
                </div>
                <div className="challenge-card__foot">
                  <span className="small muted">
                    {done ? (
                      <span className="row" style={{ gap: '0.3rem', color: 'var(--success)' }}>
                        <Check size={13} /> Done today
                      </span>
                    ) : (
                      'Not attempted today'
                    )}
                  </span>
                  <button
                    type="button"
                    className={`btn btn--sm ${active?.id === challenge.id ? 'btn--primary' : 'btn--outline'}`}
                    onClick={() => startChallenge(challenge)}
                  >
                    {active?.id === challenge.id ? (
                      <>
                        <Play size={13} /> Active
                      </>
                    ) : (
                      <>
                        Start <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', marginTop: '2.5rem' }}>
          {[
            {
              icon: Crosshair,
              title: 'Accuracy before speed',
              text: 'A 98% run beats a fast sloppy one. The target accuracy is what makes a challenge count.',
            },
            {
              icon: Flame,
              title: 'Keep the streak',
              text: 'Any finished session marks the day. A daily challenge is the quickest way to keep the fire alive.',
            },
            {
              icon: Trophy,
              title: 'Chase the badges',
              text: 'Challenge sessions count toward accuracy, speed, session and streak achievements.',
            },
          ].map(({ icon: CardIcon, title, text }) => (
            <article key={title} className="card card--pad">
              <span className="icon-tile" style={{ marginBottom: '0.7rem' }}>
                <CardIcon size={20} />
              </span>
              <h3 style={{ fontSize: 'var(--text-base)' }}>{title}</h3>
              <p className="small muted" style={{ marginTop: '0.3rem' }}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Challenges
