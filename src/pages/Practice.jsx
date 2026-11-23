import { useEffect, useMemo, useState } from 'react'
import {
  AlignLeft,
  Focus,
  Info,
  Keyboard,
  Quote,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Type,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { useTypingEngine } from '../hooks/useTypingEngine'
import { useSessionRecorder } from '../hooks/useSessionRecorder'
import { useTypingFeedback } from '../hooks/useTypingFeedback'
import { useKeyboard } from '../hooks/useKeyboard'
import {
  FOCUS_AREAS,
  PRACTICE_DURATIONS,
  generateDrill,
  generateParagraph,
  generateQuote,
  generateWords,
  getFocusArea,
} from '../data/exercises'
import { formatDuration } from '../data/exercises'
import TypingArea from '../components/typing/TypingArea'
import TypingStats from '../components/typing/TypingStats'
import TypingTimer from '../components/typing/TypingTimer'
import ResultPanel from '../components/typing/ResultPanel'
import KeyboardPanel from '../components/keyboard/KeyboardPanel'
import { OptionToggle, Segmented } from '../components/typing/TypingControls'

const SOURCES = [
  { value: 'words', label: 'Words', icon: Type },
  { value: 'quote', label: 'Quote', icon: Quote },
  { value: 'paragraph', label: 'Paragraph', icon: AlignLeft },
  { value: 'focus', label: 'Focus drill', icon: Focus },
]

const WORD_COUNTS = [10, 25, 50, 100]

function Practice() {
  const { stats } = useProgress()
  const { settings } = useSettings()

  const [source, setSource] = useState('words')
  const [mode, setMode] = useState('time')
  const [duration, setDuration] = useState(
    PRACTICE_DURATIONS.includes(settings.testDuration) ? settings.testDuration : 30
  )
  const [wordCount, setWordCount] = useState(25)
  const [focusId, setFocusId] = useState('home-row')
  const [punctuation, setPunctuation] = useState(settings.punctuation)
  const [numbers, setNumbers] = useState(settings.numbers)
  const [difficulty, setDifficulty] = useState(settings.difficulty)
  const [refresh, setRefresh] = useState(0)

  const isFixedSource = source === 'quote' || source === 'paragraph'

  const text = useMemo(() => {
    if (source === 'quote') return generateQuote().text
    if (source === 'paragraph') return generateParagraph()
    const count = mode === 'time' ? 100 : wordCount
    if (source === 'focus') return generateDrill(focusId, count)
    return generateWords(count, { punctuation, numbers, difficulty })
    // `refresh` intentionally forces a new sample.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, mode, wordCount, focusId, punctuation, numbers, difficulty, refresh])

  const session = useSessionRecorder(stats.bestWpm)
  const { result, personalBest, newAchievements, finish, reset } = session

  const sourceLabel =
    source === 'focus'
      ? `Focus: ${getFocusArea(focusId).label}`
      : source === 'quote'
        ? 'Quote practice'
        : source === 'paragraph'
          ? 'Paragraph practice'
          : 'Word practice'

  const handleFinish = (raw) => {
    finish(raw, {
      type: 'practice',
      mode: mode === 'time' && !isFixedSource ? 'time' : 'fixed',
      label: sourceLabel,
      punctuation,
      numbers,
      difficulty,
      focus: source === 'focus' ? focusId : null,
    })
  }

  const engine = useTypingEngine(text, {
    mode: mode === 'time' && !isFixedSource ? 'timed' : 'fixed',
    duration: mode === 'time' ? duration : 0,
    strict: settings.strictMode,
    allowBackspace: true,
    layout: settings.layout,
    onFinish: handleFinish,
  })
  useTypingFeedback(engine)

  const { pressed } = useKeyboard(settings.showKeyboard)

  useEffect(() => {
    reset()
    // Clear any previous results when the drill changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mode, duration, reset])

  const regenerate = () => {
    reset()
    setRefresh((value) => value + 1)
    engine.restart()
  }

  const handleRepeat = () => {
    reset()
    engine.restart()
  }

  const changeSource = (value) => {
    setSource(value)
    if (value === 'quote' || value === 'paragraph') setMode('words')
    reset()
  }

  const durationOptions = PRACTICE_DURATIONS.map((seconds) => ({
    value: seconds,
    label: formatDuration(seconds),
  }))

  const countOptions = WORD_COUNTS.map((count) => ({ value: count, label: `${count}` }))

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Keyboard size={14} /> Free practice
            </span>
            <h1 className="page-head__title">Practice room</h1>
            <p className="page-head__subtitle">
              Build your own drill. Pick the text, set a time or word target, and let the live
              guidance do the coaching.
            </p>
          </div>
          <div className="row" style={{ gap: '0.45rem' }}>
            <span className="chip chip--primary">
              <Sparkles size={13} /> {sourceLabel}
            </span>
            <span className="chip">
              {mode === 'time' && !isFixedSource ? `${duration}s sprint` : `${wordCount} words`}
            </span>
            <button type="button" className="btn btn--outline btn--sm" onClick={regenerate}>
              <Shuffle size={14} /> New text
            </button>
          </div>
        </div>

        <div className="practice-layout">
          <aside className="practice-side">
            <section className="practice-side__section">
              <div className="practice-side__title">
                <Type size={13} /> Text source
              </div>
              <div className="option-group" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {SOURCES.map(({ value, label, icon: SourceIcon }) => (
                  <button
                    key={value}
                    type="button"
                    className={`option-btn ${source === value ? 'active' : ''}`}
                    onClick={() => changeSource(value)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <SourceIcon size={13} /> {label}
                  </button>
                ))}
              </div>
            </section>

            <section className="practice-side__section">
              <div className="practice-side__title">
                <SlidersHorizontal size={13} /> Session mode
              </div>

              {!isFixedSource ? (
                <div className="stack" style={{ gap: '0.7rem' }}>
                  <Segmented
                    options={[
                      { value: 'time', label: 'Timed' },
                      { value: 'words', label: 'Words' },
                    ]}
                    value={mode}
                    onChange={setMode}
                    ariaLabel="Practice mode"
                  />
                  {mode === 'time' ? (
                    <Segmented options={durationOptions} value={duration} onChange={setDuration} ariaLabel="Time limit" />
                  ) : (
                    <Segmented options={countOptions} value={wordCount} onChange={setWordCount} ariaLabel="Word count" />
                  )}
                </div>
              ) : (
                <p className="small muted" style={{ marginBottom: '0.7rem' }}>
                  Quotes and paragraphs are fixed-length. Finish the whole passage to complete the run.
                </p>
              )}

              <div className="row" style={{ gap: '0.4rem', marginTop: '0.75rem' }}>
                <OptionToggle active={punctuation} onClick={() => setPunctuation((value) => !value)}>
                  Punctuation
                </OptionToggle>
                <OptionToggle active={numbers} onClick={() => setNumbers((value) => !value)}>
                  Numbers
                </OptionToggle>
              </div>

              <div className="setting-row" style={{ marginTop: '0.35rem' }}>
                <div>
                  <div className="setting-row__label">Vocabulary</div>
                  <div className="setting-row__hint">Common words or richer vocabulary</div>
                </div>
              </div>
              <Segmented
                options={[
                  { value: 'common', label: 'Common' },
                  { value: 'advanced', label: 'Advanced' },
                ]}
                value={difficulty}
                onChange={setDifficulty}
                ariaLabel="Difficulty"
              />
            </section>

            {source === 'focus' && (
              <section className="practice-side__section">
                <div className="practice-side__title">
                  <Focus size={13} /> Focus area
                </div>
                <div className="option-group">
                  {FOCUS_AREAS.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      className={`option-btn ${focusId === area.id ? 'active' : ''}`}
                      onClick={() => setFocusId(area.id)}
                      title={area.description}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
                <p className="small muted" style={{ marginTop: '0.6rem', fontSize: '0.72rem' }}>
                  {getFocusArea(focusId).description}
                </p>
              </section>
            )}

            <div className="practice-hint">
              <Info size={16} />
              <span>
                {settings.strictMode
                  ? 'Strict mode is on: wrong keys block the cursor until you correct them.'
                  : 'Soft mode is on: wrong keys are marked but the cursor keeps moving.'}
              </span>
            </div>
          </aside>

          <div className="practice-main">
            {result ? (
              <ResultPanel
                result={result}
                onRepeat={handleRepeat}
                onNext={regenerate}
                nextLabel="New drill"
                repeatLabel="Repeat drill"
                personalBest={personalBest}
                newAchievements={newAchievements}
                celebrate={personalBest || result.accuracy >= 98}
              />
            ) : (
              <>
                <div className="typing-panel">
                  <div className="typing-panel__head">
                    <div className="typing-panel__meta">
                      <Keyboard size={15} /> {sourceLabel}
                      <span className="chip" style={{ marginLeft: '0.35rem' }}>
                        {mode === 'time' && !isFixedSource ? `${duration}s` : `${text.split(' ').length} words`}
                      </span>
                    </div>
                    <div className="row" style={{ gap: '0.9rem' }}>
                      <TypingTimer
                        mode={mode === 'time' && !isFixedSource ? 'timed' : 'fixed'}
                        timeLeft={engine.timeLeft}
                        elapsed={engine.elapsedSeconds}
                      />
                      <button type="button" className="btn btn--ghost btn--sm" onClick={regenerate}>
                        <Shuffle size={14} /> New
                      </button>
                    </div>
                  </div>

                  <div className="typing-panel__body">
                    <TypingArea
                      text={text}
                      engine={engine}
                      onRestart={regenerate}
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

                <p className="test-start-hint">
                  Press <span className="kbd">Tab</span> to restart at any time. The timer starts on
                  your first keystroke.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Practice
