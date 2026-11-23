import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useTypingStats, countCorrectChars } from './useTypingStats'
import { useTypingTimer } from './useTypingTimer'
import { calculateAccuracy } from '../utils/calculateAccuracy'
import {
  calculateConsistency,
  calculateCPM,
  calculateRawWPM,
  calculateWPM,
} from '../utils/calculateWPM'
import { getKeyForChar } from '../utils/keyboardLayouts'

function createInitialState() {
  return {
    typed: '',
    errors: 0,
    keystrokes: 0,
    startedAt: null,
    finishedAt: null,
    finished: false,
    finishReason: null,
    keyStats: {},
    samples: [],
    lastSampleSecond: 0,
    stroke: 0,
    lastKey: '',
    lastKeyCorrect: null,
    errorKey: null,
    errorPulse: 0,
  }
}

/**
 * Core typing engine.
 *
 * - Starts the clock on the first keystroke.
 * - Tracks per-character state, per-key accuracy and per-second WPM samples.
 * - Supports free (soft) or strict error handling, backspace, timed or
 *   fixed-length sessions.
 */
export function useTypingEngine(
  text = '',
  {
    mode = 'fixed', // 'fixed' | 'timed'
    duration = 0, // seconds, only used when mode === 'timed'
    strict = false,
    allowBackspace = true,
    layout = 'qwerty',
    onFinish = null,
  } = {}
) {
  function reducer(state, action) {
    switch (action.type) {
      case 'reset':
        return createInitialState()

      case 'key': {
        if (state.finished) return state
        if (!text || state.typed.length >= text.length) return state
        if (typeof action.key !== 'string' || action.key.length !== 1) return state

        const expected = text[state.typed.length]
        const isCorrect = action.key === expected
        const now = action.now || Date.now()
        const startedAt = state.startedAt || now

        const keyStats = { ...state.keyStats }
        const prevKey = keyStats[expected] || { correct: 0, errors: 0 }
        keyStats[expected] = {
          correct: prevKey.correct + (isCorrect ? 1 : 0),
          errors: prevKey.errors + (isCorrect ? 0 : 1),
        }

        const base = {
          ...state,
          startedAt,
          keystrokes: state.keystrokes + 1,
          errors: state.errors + (isCorrect ? 0 : 1),
          keyStats,
          stroke: state.stroke + 1,
          lastKey: action.key,
          lastKeyCorrect: isCorrect,
          errorPulse: state.errorPulse + (isCorrect ? 0 : 1),
          errorKey: isCorrect ? null : expected,
        }

        // Strict mode blocks the cursor on a wrong key.
        if (strict && !isCorrect) return base

        const typed = state.typed + action.key
        const complete = typed.length >= text.length

        return {
          ...base,
          typed,
          finished: complete,
          finishedAt: complete ? now : null,
          finishReason: complete ? 'complete' : null,
        }
      }

      case 'backspace': {
        if (!allowBackspace || state.finished || state.typed.length === 0) return state
        return { ...state, typed: state.typed.slice(0, -1) }
      }

      case 'finish': {
        if (state.finished || !state.startedAt) return state
        return {
          ...state,
          finished: true,
          finishedAt: action.now || Date.now(),
          finishReason: action.reason || 'manual',
        }
      }

      case 'sample': {
        if (action.second <= state.lastSampleSecond) return state
        return {
          ...state,
          lastSampleSecond: action.second,
          samples: [
            ...state.samples,
            { t: action.second, wpm: action.wpm, raw: action.rawWpm },
          ],
        }
      }

      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const timer = useTypingTimer({
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
    duration: mode === 'timed' ? duration : 0,
  })

  const stats = useTypingStats({
    text,
    typed: state.typed,
    elapsedMs: timer.elapsedMs,
    keystrokes: state.keystrokes,
    errors: state.errors,
    samples: state.samples,
  })

  const reportedRef = useRef(false)
  const configRef = useRef('')

  // Reset whenever the content or rules change.
  const configKey = `${text}|${mode}|${duration}|${strict}`
  useEffect(() => {
    if (configRef.current === configKey) return
    configRef.current = configKey
    reportedRef.current = false
    dispatch({ type: 'reset' })
  }, [configKey])

  // Timed mode: end exactly at the duration boundary.
  useEffect(() => {
    if (mode !== 'timed' || !duration) return
    if (!state.startedAt || state.finished) return
    if (timer.elapsedMs >= duration * 1000) {
      dispatch({ type: 'finish', now: state.startedAt + duration * 1000, reason: 'time' })
    }
  }, [mode, duration, state.startedAt, state.finished, timer.elapsedMs])

  // Record one WPM sample per elapsed second.
  const elapsedSecond = Math.floor(timer.elapsedMs / 1000)
  useEffect(() => {
    if (!state.startedAt || state.finished) return
    if (elapsedSecond < 1 || elapsedSecond <= state.lastSampleSecond) return
    const correct = countCorrectChars(text, state.typed)
    dispatch({
      type: 'sample',
      second: elapsedSecond,
      wpm: calculateWPM(correct, elapsedSecond * 1000),
      rawWpm: calculateRawWPM(state.keystrokes, elapsedSecond * 1000),
    })
  }, [elapsedSecond, state.startedAt, state.finished, state.lastSampleSecond, state.typed, state.keystrokes, text])

  // Emit a single result per run.
  useEffect(() => {
    if (!state.finished || reportedRef.current) return
    reportedRef.current = true

    const elapsedMs = Math.max(1, (state.finishedAt || Date.now()) - (state.startedAt || Date.now()))
    const correct = countCorrectChars(text, state.typed)
    const strokes = state.keystrokes
    const clean = Math.max(0, strokes - state.errors)
    const wpm = calculateWPM(correct, elapsedMs)
    const rawWpm = calculateRawWPM(strokes, elapsedMs)
    const accuracy = calculateAccuracy(clean, strokes)

    const samples = [...state.samples]
    const finalSecond = Math.max(1, Math.round(elapsedMs / 1000))
    if (!samples.length || samples[samples.length - 1].t < finalSecond) {
      samples.push({ t: finalSecond, wpm, raw: rawWpm })
    }

    const result = {
      text,
      typed: state.typed,
      wpm,
      rawWpm,
      accuracy,
      consistency: calculateConsistency(samples),
      cpm: calculateCPM(correct, elapsedMs),
      correctChars: correct,
      incorrectChars: Math.max(0, state.typed.length - correct),
      keystrokes: strokes,
      errors: state.errors,
      duration: elapsedMs / 1000,
      elapsedMs,
      keyStats: state.keyStats,
      samples,
      completed: state.typed.length >= text.length,
      reason: state.finishReason,
      progress: text.length ? (state.typed.length / text.length) * 100 : 0,
    }

    if (typeof onFinish === 'function') onFinish(result)
    // The report must fire exactly once when `finished` flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.finished])

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return false
      if (stateRef.current.finished) return false

      const key = event.key

      if (key === 'Backspace') {
        if (!allowBackspace) return false
        event.preventDefault()
        dispatch({ type: 'backspace' })
        return true
      }

      if (key === 'Enter') {
        const expected = text[stateRef.current.typed.length]
        if (expected === '\n') {
          event.preventDefault()
          dispatch({ type: 'key', key: '\n', now: Date.now() })
          return true
        }
        return false
      }

      if (key.length !== 1) return false
      event.preventDefault()
      dispatch({ type: 'key', key, now: Date.now() })
      return true
    },
    [text, allowBackspace]
  )

  const typeKey = useCallback((key) => {
    if (typeof key !== 'string' || key.length !== 1) return
    dispatch({ type: 'key', key, now: Date.now() })
  }, [])

  const restart = useCallback(() => {
    reportedRef.current = false
    dispatch({ type: 'reset' })
  }, [])

  const finish = useCallback(() => {
    dispatch({ type: 'finish', now: Date.now(), reason: 'manual' })
  }, [])

  const nextChar = state.typed.length < text.length ? text[state.typed.length] : null
  const nextKey = nextChar ? getKeyForChar(nextChar, layout) : null

  return {
    ...stats,
    typed: state.typed,
    isFinished: state.finished,
    isStarted: Boolean(state.startedAt),
    status: state.finished ? 'finished' : state.startedAt ? 'running' : 'idle',
    finishReason: state.finishReason,
    startedAt: state.startedAt,
    elapsedMs: timer.elapsedMs,
    elapsedSeconds: timer.elapsedSeconds,
    timeLeft: timer.timeLeft,
    nextChar,
    nextKey,
    keyStats: state.keyStats,
    samples: state.samples,
    lastStroke: state.stroke,
    lastKey: state.lastKey,
    lastKeyCorrect: state.lastKeyCorrect,
    errorKey: state.errorKey,
    errorPulse: state.errorPulse,
    handleKeyDown,
    typeKey,
    restart,
    finish,
  }
}

export default useTypingEngine
