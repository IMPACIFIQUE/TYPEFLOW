import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import TypingArea from './TypingArea'
import { formatTime } from '../../utils/format'

const DEMO_TEXT = 'the quick brown fox jumps over the lazy dog while typing'
const RESULT_HOLD = 5200
const FINISH_DELAY = 600

function delayFor(index) {
  const char = DEMO_TEXT[index]
  const base = char === ' ' ? 155 : 95
  return base + ((index * 37) % 55)
}

/**
 * A decorative, self-running typing demo for the home hero. It types on its
 * own, freezes into a result summary and then loops. It never accepts input.
 */
function HeroPreview() {
  const [typed, setTyped] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [result, setResult] = useState(null)
  const startedAtRef = useRef(0)
  const reducedMotionRef = useRef(false)

  // Respect reduced-motion: jump straight to the finished result.
  useEffect(() => {
    reducedMotionRef.current =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

    if (reducedMotionRef.current) {
      setTyped(DEMO_TEXT)
      setElapsed(8)
      setResult({
        wpm: 84,
        accuracy: 100,
        consistency: 96,
        characters: DEMO_TEXT.length,
        duration: 8,
      })
      return undefined
    }

    startedAtRef.current = performance.now()
    return undefined
  }, [])

  // Type the demo one character at a time.
  useEffect(() => {
    if (result) return undefined

    if (typed.length >= DEMO_TEXT.length) {
      const timer = window.setTimeout(() => {
        const duration = Math.max(elapsed, 1)
        setResult({
          wpm: Math.max(1, Math.round(DEMO_TEXT.length / 5 / (duration / 60))),
          accuracy: 100,
          consistency: 96,
          characters: DEMO_TEXT.length,
          duration,
        })
      }, FINISH_DELAY)
      return () => window.clearTimeout(timer)
    }

    const index = typed.length
    const timer = window.setTimeout(() => {
      setTyped(DEMO_TEXT.slice(0, index + 1))
      setElapsed((performance.now() - startedAtRef.current) / 1000)
    }, delayFor(index))

    return () => window.clearTimeout(timer)
  }, [typed, elapsed, result])

  // Hold the result for a moment, then replay the demo.
  useEffect(() => {
    if (!result || reducedMotionRef.current) return undefined
    const timer = window.setTimeout(() => {
      startedAtRef.current = performance.now()
      setTyped('')
      setElapsed(0)
      setResult(null)
    }, RESULT_HOLD)
    return () => window.clearTimeout(timer)
  }, [result])

  const engine = useMemo(
    () => ({
      typed,
      isFinished: Boolean(result),
      handleKeyDown: () => {},
      typeKey: () => {},
    }),
    [typed, result],
  )

  const liveWpm = typed.length
    ? Math.round(typed.length / 5 / (Math.max(elapsed, 0.45) / 60))
    : 0
  const progress = Math.round((typed.length / DEMO_TEXT.length) * 100)

  return (
    <div className="hero-demo">
      <div className="hero-demo__bar">
        <span className="hero-demo__dot" />
        <span className="hero-demo__dot" />
        <span className="hero-demo__dot" />
        <span className="hero-demo__label">typeflow / preview</span>
        <span
          className={`chip ${result ? 'chip--success' : 'chip--primary'}`}
          style={{ marginLeft: 'auto', fontSize: '0.62rem' }}
        >
          {result ? (
            <>
              <Check size={11} /> result
            </>
          ) : (
            <>
              <span className="hero-demo__pulse" /> auto typing
            </>
          )}
        </span>
      </div>

      {result ? (
        <div className="hero-demo__result">
          <div className="hero-demo__result-head">
            <span className="chip chip--success">
              <Check size={12} /> Session complete
            </span>
            <span className="chip chip--secondary">{formatTime(result.duration)}</span>
          </div>

          <div className="hero-demo__result-main">
            <div className="hero-demo__result-wpm">
              <b>{result.wpm}</b>
              <span>WPM</span>
            </div>
            <div className="hero-demo__result-metrics">
              <div>
                <b>{result.accuracy}%</b>
                <span>Accuracy</span>
              </div>
              <div>
                <b>{result.consistency}%</b>
                <span>Consistency</span>
              </div>
              <div>
                <b>{result.characters}</b>
                <span>Characters</span>
              </div>
            </div>
          </div>

          <div className="hero-demo__result-foot">
            <RotateCcw size={12} /> Replaying demo…
          </div>
        </div>
      ) : (
        <>
          <div className="hero-demo__body">
            <TypingArea
              text={DEMO_TEXT}
              engine={engine}
              autoFocus={false}
              showOverlay={false}
              readOnly
              animateCaret
            />
          </div>

          <div className="hero-demo__stats">
            <span>
              <b>{liveWpm}</b> wpm
            </span>
            <span>
              <b>100%</b> accuracy
            </span>
            <span>
              <b>{progress}%</b> done
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default HeroPreview
