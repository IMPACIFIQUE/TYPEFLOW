import { useEffect, useMemo, useState } from 'react'
import { Gauge, Keyboard, RefreshCw, RotateCcw, Sparkles, Timer, Trophy, Type } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { useTypingEngine } from '../hooks/useTypingEngine'
import { useSessionRecorder } from '../hooks/useSessionRecorder'
import { useTypingFeedback } from '../hooks/useTypingFeedback'
import { useKeyboard } from '../hooks/useKeyboard'
import {
  TEST_DURATIONS,
  TEST_WORD_COUNTS,
  formatDuration,
  generateWords,
} from '../data/exercises'
import TypingArea from '../components/typing/TypingArea'
import TypingStats from '../components/typing/TypingStats'
import TypingTimer from '../components/typing/TypingTimer'
import ResultPanel from '../components/typing/ResultPanel'
import KeyboardPanel from '../components/keyboard/KeyboardPanel'
import { OptionToggle, Segmented } from '../components/typing/TypingControls'

function TypingTest() {
  const { stats } = useProgress()
  const { settings } = useSettings()

  const [mode, setMode] = useState('time')
  const [duration, setDuration] = useState(
    TEST_DURATIONS.includes(settings.testDuration) ? settings.testDuration : 30
  )
  const [wordCount, setWordCount] = useState(50)
  const [punctuation, setPunctuation] = useState(settings.punctuation)
  const [numbers, setNumbers] = useState(settings.numbers)
  const [refresh, setRefresh] = useState(0)

  const text = useMemo(
    () =>
      generateWords(mode === 'time' ? 150 : wordCount, {
        punctuation,
        numbers,
        difficulty: settings.difficulty,
      }),
    // `refresh` intentionally starts a fresh sample.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, wordCount, punctuation, numbers, settings.difficulty, refresh]
  )

  const session = useSessionRecorder(stats.bestWpm)
  const { result, personalBest, newAchievements, finish, reset } = session

  const handleFinish = (raw) => {
    finish(raw, {
      type: 'test',
      mode: mode === 'time' ? 'time' : 'fixed',
      label: mode === 'time' ? `${duration}s test` : `${wordCount} word test`,
      punctuation,
      numbers,
      target: mode === 'time' ? duration : wordCount,
    })
  }

  const engine = useTypingEngine(text, {
    mode: mode === 'time' ? 'timed' : 'fixed',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mode, duration, reset])

  const newTest = () => {
    reset()
    setRefresh((value) => value + 1)
    engine.restart()
  }

  const repeatTest = () => {
    reset()
    engine.restart()
  }

  const durationOptions = TEST_DURATIONS.map((seconds) => ({
    value: seconds,
    label: formatDuration(seconds),
  }))
  const countOptions = TEST_WORD_COUNTS.map((count) => ({ value: count, label: `${count}` }))

  if (result) {
    return (
      <main className="page test-page">
        <div className="container">
          <div className="test-stage">
            <ResultPanel
              result={result}
              onRepeat={repeatTest}
              onNext={newTest}
              nextLabel="New test"
              repeatLabel="Repeat test"
              personalBest={personalBest}
              newAchievements={newAchievements}
              celebrate={personalBest || result.wpm >= 60}
            />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page test-page">
      <div className="container">
        <div className="test-stage">
          <div className="test-topbar">
            <div>
              <span className="eyebrow">
                <Timer size={14} /> Typing test
              </span>
              <h1 className="page-head__title" style={{ marginTop: '0.3rem' }}>
                Find your true speed
              </h1>
            </div>

            <div className="test-config">
              <Segmented
                options={[
                  { value: 'time', label: 'Time' },
                  { value: 'words', label: 'Words' },
                ]}
                value={mode}
                onChange={setMode}
                ariaLabel="Test mode"
              />
              {mode === 'time' ? (
                <Segmented options={durationOptions} value={duration} onChange={setDuration} ariaLabel="Duration" />
              ) : (
                <Segmented options={countOptions} value={wordCount} onChange={setWordCount} ariaLabel="Word count" />
              )}
            </div>
          </div>

          <div className="test-livebar">
            <div className="test-livebar__stats">
              <div className="test-livebar__stat">
                <b>{Math.round(engine.wpm)}</b>
                <span>WPM</span>
              </div>
              <div className="test-livebar__stat">
                <b>{Math.round(engine.accuracy)}%</b>
                <span>Accuracy</span>
              </div>
              <div className="test-livebar__stat">
                <b>{Math.round(engine.rawWpm)}</b>
                <span>Raw</span>
              </div>
            </div>

            <div className="row" style={{ gap: '0.75rem' }}>
              <OptionToggle active={punctuation} onClick={() => setPunctuation((value) => !value)}>
                Punctuation
              </OptionToggle>
              <OptionToggle active={numbers} onClick={() => setNumbers((value) => !value)}>
                Numbers
              </OptionToggle>
              <button type="button" className="btn btn--ghost btn--sm" onClick={newTest}>
                <RefreshCw size={14} /> New text
              </button>
            </div>
          </div>

          <div className="typing-panel">
            <div className="typing-panel__head">
              <div className="typing-panel__meta">
                <Keyboard size={15} />
                {mode === 'time' ? `${duration} second test` : `${wordCount} word test`}
                <span className="chip" style={{ marginLeft: '0.35rem' }}>
                  <Type size={12} /> {text.split(' ').length} words loaded
                </span>
              </div>
              <div className="row" style={{ gap: '0.9rem' }}>
                <TypingTimer
                  mode={mode === 'time' ? 'timed' : 'fixed'}
                  timeLeft={engine.timeLeft}
                  elapsed={engine.elapsedSeconds}
                />
                <button type="button" className="btn btn--ghost btn--sm" onClick={repeatTest}>
                  <RotateCcw size={14} /> Restart
                </button>
              </div>
            </div>

            <div className="typing-panel__body">
              <TypingArea
                text={text}
                engine={engine}
                onRestart={repeatTest}
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

          <div className="test-footer">
            <div className="test-footer__hints">
              <span className="test-footer__hint">
                <span className="kbd">Tab</span> restart
              </span>
              <span className="test-footer__hint">
                <Gauge size={13} /> Personal best: {Math.round(stats.bestWpm)} WPM
              </span>
              <span className="test-footer__hint">
                <Trophy size={13} /> {stats.totalTests} tests recorded
              </span>
            </div>
            <span className="test-footer__hint">
              <Sparkles size={13} /> The clock starts with your first keystroke
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TypingTest
