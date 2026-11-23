import { useMemo } from 'react'
import { calculateAccuracy } from '../utils/calculateAccuracy'
import { calculateCPM, calculateConsistency, calculateRawWPM, calculateWPM } from '../utils/calculateWPM'

export function countCorrectChars(text = '', typed = '') {
  const length = Math.min(text.length, typed.length)
  let correct = 0
  for (let i = 0; i < length; i += 1) {
    if (text[i] === typed[i]) correct += 1
  }
  return correct
}

export function getCharacterStatus(text, typed, index) {
  if (index < typed.length) {
    return text[index] === typed[index] ? 'correct' : 'incorrect'
  }
  if (index === typed.length) return 'current'
  return 'pending'
}

/**
 * Derives live typing metrics from raw engine state.
 */
export function useTypingStats({
  text = '',
  typed = '',
  elapsedMs = 0,
  keystrokes = 0,
  errors = 0,
  samples = [],
}) {
  return useMemo(() => {
    const correctChars = countCorrectChars(text, typed)
    const incorrectChars = Math.max(0, typed.length - correctChars)
    const totalTyped = typed.length
    const strokes = keystrokes || totalTyped
    const cleanStrokes = Math.max(0, strokes - errors)

    const wpm = calculateWPM(correctChars, elapsedMs)
    const rawWpm = calculateRawWPM(strokes, elapsedMs)
    const accuracy = calculateAccuracy(cleanStrokes, strokes)
    const consistency = calculateConsistency(samples)
    const cpm = calculateCPM(correctChars, elapsedMs)
    const progress = text.length ? (typed.length / text.length) * 100 : 0

    return {
      wpm,
      rawWpm,
      accuracy,
      consistency,
      cpm,
      correctChars,
      incorrectChars,
      totalTyped,
      keystrokes: strokes,
      errors,
      progress: Math.min(100, progress),
      samples,
    }
  }, [text, typed, elapsedMs, keystrokes, errors, samples])
}

export default useTypingStats
