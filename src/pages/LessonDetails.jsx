import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  ChevronRight,
  CircleCheck,
  Keyboard,
  Star,
  Trophy,
  Zap,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { useTypingEngine } from '../hooks/useTypingEngine'
import { useSessionRecorder } from '../hooks/useSessionRecorder'
import { useTypingFeedback } from '../hooks/useTypingFeedback'
import { useKeyboard } from '../hooks/useKeyboard'
import {
  LEVEL_META,
  calculateLessonStars,
  getLessonById,
  getLessonProgress,
  getNextLesson,
  getPreviousLesson,
} from '../services/lessonService'
import { getFingerForChar } from '../utils/keyboardLayouts'
import { getFingerMeta } from '../utils/fingerMapping'
import TypingArea from '../components/typing/TypingArea'
import TypingStats from '../components/typing/TypingStats'
import TypingTimer from '../components/typing/TypingTimer'
import ResultPanel from '../components/typing/ResultPanel'
import KeyboardPanel from '../components/keyboard/KeyboardPanel'
import LearnShell from '../components/learn/LearnShell'

function LessonDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { stats, progress } = useProgress()
  const { settings } = useSettings()

  const lesson = getLessonById(id)
  const [exerciseIndex, setExerciseIndex] = useState(0)

  const exercise = lesson?.exercises?.[exerciseIndex] || lesson?.exercises?.[0] || null
  const text = exercise?.text || ''

  const session = useSessionRecorder(stats.bestWpm)
  const { result, personalBest, newAchievements, finish, reset } = session

  const handleFinish = useCallback(
    (raw) => {
      if (!lesson) return
      const current = lesson.exercises[exerciseIndex]
      finish(raw, {
        type: 'lesson',
        mode: 'fixed',
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        label: current?.title || lesson.title,
        stars: calculateLessonStars(lesson, raw),
      })
    },
    [lesson, exerciseIndex, finish]
  )

  const engine = useTypingEngine(text, {
    mode: 'fixed',
    strict: settings.strictMode,
    allowBackspace: true,
    layout: settings.layout,
    onFinish: handleFinish,
  })
  useTypingFeedback(engine)

  const { pressed } = useKeyboard(settings.showKeyboard)
  const { errorKey, nextChar, errorPulse } = engine

  const nextLesson = useMemo(() => (lesson ? getNextLesson(lesson.id) : null), [lesson])
  const previousLesson = useMemo(() => (lesson ? getPreviousLesson(lesson.id) : null), [lesson])
  const entry = lesson ? getLessonProgress(progress, lesson.id) : null
  const fingerMeta = nextChar ? getFingerMeta(getFingerForChar(nextChar, settings.layout)) : null

  useEffect(() => {
    setExerciseIndex(0)
    reset()
  }, [id, reset])

  if (!lesson) {
    return <Navigate to="/lessons" replace />
  }

  const meta = LEVEL_META[lesson.level] || LEVEL_META.beginner
  const nextExercise = lesson.exercises[exerciseIndex + 1] || null
  const isLastExercise = !nextExercise

  const handleRestart = () => {
    reset()
    engine.restart()
  }

  const selectExercise = (index) => {
    if (index === exerciseIndex) return
    setExerciseIndex(index)
    reset()
  }

  const handleNext = () => {
    reset()
    if (nextExercise) {
      setExerciseIndex((index) => index + 1)
    } else if (nextLesson) {
      navigate(`/lessons/${nextLesson.id}`)
    } else {
      navigate('/lessons')
    }
  }

  return (
    <LearnShell
      breadcrumb={
        <>
          <Link to="/lessons">Lessons</Link>
          <ChevronRight size={12} />
          <span>Unit {lesson.unitNumber}</span>
          <ChevronRight size={12} />
          <span className="current">{lesson.title}</span>
        </>
      }
      actions={
        <>
          <span className="chip">
            Drill {exerciseIndex + 1}/{lesson.exercises.length}
          </span>
          <button type="button" className="btn btn--outline btn--sm" onClick={handleRestart}>
            Restart <span className="kbd">Tab</span>
          </button>
        </>
      }
      aside={
        <>
          <div className="aside-panel">
            <div className="aside-panel__head">
              <div>
                <h2>Drills</h2>
                <p>{lesson.exercises.length} short drills in this lesson</p>
              </div>
              <span className="chip chip--success">
                <span className="dot" /> Active
              </span>
            </div>
            <div className="aside-drills">
              {lesson.exercises.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  className={`aside-drill ${index === exerciseIndex ? 'active' : ''}`}
                  onClick={() => selectExercise(index)}
                  aria-pressed={index === exerciseIndex}
                >
                  <span className="aside-drill__num">{index + 1}</span>
                  <span>{item.title}</span>
                  <span className="aside-drill__count">{item.text.split(' ').length}w</span>
                </button>
              ))}
            </div>
          </div>

          <div className="aside-panel">
            <h2 className="aside-panel__title">Keyboard guide</h2>
            <div className="aside-finger">
              Use your{' '}
              <strong style={{ color: fingerMeta?.color || 'var(--text)' }}>
                {fingerMeta ? fingerMeta.label.toLowerCase() : 'next finger'}
              </strong>{' '}
              for
              <span className="finger-tip__key">
                {nextChar === ' ' ? 'space' : nextChar || '—'}
              </span>
            </div>
            <p className="small muted">{lesson.tip}</p>
            <Link to="/guide" className="aside-link">
              Quickstart guide <ArrowRight size={14} />
            </Link>
          </div>

          {previousLesson || nextLesson ? (
            <div className="aside-panel aside-panel--nav">
              {previousLesson ? (
                <Link to={`/lessons/${previousLesson.id}`} className="btn btn--ghost btn--sm">
                  Previous
                </Link>
              ) : null}
              {nextLesson ? (
                <Link to={`/lessons/${nextLesson.id}`} className="btn btn--ghost btn--sm">
                  Next lesson <ArrowRight size={14} />
                </Link>
              ) : null}
            </div>
          ) : null}
        </>
      }
    >
      <div className="lesson-stage">
        <div className="lesson-stage__head">
          <h1>
            {lesson.title} <span aria-hidden="true">👋</span>
          </h1>
          <div className="lesson-stage__actions">
            <button type="button" className="btn btn--soft btn--sm" onClick={handleNext}>
              {isLastExercise ? 'Skip lesson' : 'Skip drill'}
            </button>
            {nextLesson ? (
              <Link to={`/lessons/${nextLesson.id}`} className="btn btn--outline btn--sm">
                {nextLesson.title}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="lesson-meta-row">
          <span className="chip chip--warning">
            <Zap size={12} /> {exercise?.title}
          </span>
          <span className={`chip ${entry?.completed ? 'chip--success' : ''}`}>
            <CircleCheck size={12} /> {entry?.completed ? 'Completed' : 'In progress'}
          </span>
          <span className="chip">
            <Trophy size={12} /> Unit {lesson.unitNumber}
          </span>
          <span className="chip">{meta.label}</span>
          <TypingTimer mode="fixed" elapsed={engine.elapsedSeconds} />
        </div>

        {result ? (
          <ResultPanel
            result={result}
            onRepeat={handleRestart}
            onNext={handleNext}
            repeatLabel="Retry drill"
            nextLabel={
              nextExercise ? 'Next drill' : nextLesson ? 'Next lesson' : 'Back to lessons'
            }
            personalBest={personalBest}
            newAchievements={newAchievements}
            celebrate={(result.stars || 0) >= 2 || personalBest}
          >
            <div
              className="row"
              style={{
                gap: '0.5rem',
                marginBottom: '1.25rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
              }}
            >
              <span className="row" style={{ gap: 2, color: 'var(--warning)' }}>
                {[0, 1, 2].map((index) => (
                  <Star
                    key={index}
                    size={22}
                    fill={index < (result.stars || 0) ? 'currentColor' : 'none'}
                    style={{ opacity: index < (result.stars || 0) ? 1 : 0.3 }}
                  />
                ))}
              </span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>
                  {result.stars === 3
                    ? 'Perfect lesson rating'
                    : result.stars === 2
                      ? 'Great run — one star to go'
                      : 'Lesson complete'}
                </strong>
                <span className="small muted">
                  Beat {lesson.targetWpm} WPM with 97% accuracy for three stars.
                </span>
              </div>
            </div>
          </ResultPanel>
        ) : (
          <>
            <div className="lesson-stats">
              <div
                className="lesson-stat-ring"
                style={{ '--pct': Math.max(0, Math.min(100, Math.round(engine.accuracy))) }}
              >
                <span>{Math.round(engine.accuracy)}%</span>
              </div>

              <div className="lesson-stat lesson-stat--speed">
                <span className="lesson-stat__label">Speed this drill</span>
                <div>
                  <strong>{Math.round(engine.wpm)}</strong>
                  <small>/ {lesson.targetWpm} WPM target</small>
                </div>
              </div>

              <div className="lesson-stat">
                <span className="lesson-stat__label">Correct</span>
                <strong>{engine.correctChars}</strong>
              </div>
              <div className="lesson-stat">
                <span className="lesson-stat__label">Incorrect</span>
                <strong>{engine.incorrectChars}</strong>
              </div>
              <div className="lesson-stat">
                <span className="lesson-stat__label">Typed</span>
                <strong>{engine.totalTyped}</strong>
              </div>
              <div className="lesson-stat">
                <span className="lesson-stat__label">Best</span>
                <strong>{entry?.bestWpm ? Math.round(entry.bestWpm) : '—'}</strong>
              </div>
            </div>

            <div className="typing-panel lesson-typing">
              <div className="typing-panel__body">
                <TypingArea
                  text={text}
                  engine={engine}
                  onRestart={handleRestart}
                  blindMode={settings.blindMode}
                />
              </div>

              <TypingStats
                wpm={engine.wpm}
                accuracy={engine.accuracy}
                correctChars={engine.correctChars}
                incorrectChars={engine.incorrectChars}
                totalChars={engine.totalTyped}
                errors={engine.errors}
              />
            </div>

            {settings.showKeyboard && (
              <KeyboardPanel
                nextChar={nextChar}
                errorKey={errorPulse ? errorKey : null}
                pressed={pressed}
                compact
              />
            )}
          </>
        )}
      </div>
    </LearnShell>
  )
}

export default LessonDetails
