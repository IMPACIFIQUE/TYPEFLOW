import { useCallback, useEffect, useRef, useState } from 'react'
import { useProgress } from '../context/ProgressContext'

/**
 * Turns a raw engine result into a stored session.
 *
 * Pages pass a `meta` object (type, mode, lesson info, score...) when the run
 * finishes. The hook also evaluates personal bests against the best WPM seen
 * *before* the session was saved, and forwards newly unlocked achievements.
 */
export function useSessionRecorder(bestWpm = 0) {
  const { addSession } = useProgress()
  const [result, setResult] = useState(null)
  const [personalBest, setPersonalBest] = useState(false)
  const [newAchievements, setNewAchievements] = useState([])
  const bestRef = useRef(bestWpm)

  useEffect(() => {
    bestRef.current = Math.max(bestRef.current, bestWpm)
  }, [bestWpm])

  const finish = useCallback(
    (raw, meta = {}) => {
      if (!raw) return
      const record = {
        type: 'test',
        mode: 'fixed',
        date: new Date().toISOString(),
        duration: raw.duration || 0,
        wpm: raw.wpm || 0,
        rawWpm: raw.rawWpm || 0,
        accuracy: raw.accuracy || 0,
        consistency: raw.consistency || 0,
        chars: raw.correctChars || 0,
        errors: raw.errors || 0,
        keystrokes: raw.keystrokes || 0,
        words: Math.round((raw.correctChars || 0) / 5),
        keyStats: raw.keyStats || null,
        completed: raw.completed !== false,
        ...meta,
      }

      const isBest = record.keystrokes > 0 && record.wpm > bestRef.current
      if (record.keystrokes > 0) {
        const saved = addSession(record)
        setNewAchievements(saved?.newAchievements || [])
        setPersonalBest(isBest)
        bestRef.current = Math.max(bestRef.current, record.wpm)
      } else {
        setNewAchievements([])
        setPersonalBest(false)
      }

      setResult({ ...raw, ...record })
    },
    [addSession]
  )

  const reset = useCallback(() => {
    setResult(null)
    setPersonalBest(false)
    setNewAchievements([])
  }, [])

  return { result, personalBest, newAchievements, finish, reset }
}

export default useSessionRecorder
