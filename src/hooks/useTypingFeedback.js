import { useEffect, useRef } from 'react'
import { useSound } from './useSound'

/**
 * Plays keystroke / error / finish sounds for a typing engine instance.
 * The effect observes the engine's monotonically increasing stroke counter so
 * it never replays a sound for the same keystroke.
 */
export function useTypingFeedback(engine) {
  const { playKey, playError, playFinish } = useSound()
  const strokeRef = useRef(0)
  const finishedRef = useRef(false)

  useEffect(() => {
    if (engine.lastStroke === strokeRef.current) return
    strokeRef.current = engine.lastStroke
    if (!engine.lastStroke) return
    if (engine.lastKeyCorrect) playKey()
    else playError()
  }, [engine.lastStroke, engine.lastKeyCorrect, playKey, playError])

  useEffect(() => {
    if (engine.isFinished) {
      if (!finishedRef.current) {
        finishedRef.current = true
        playFinish()
      }
    } else {
      finishedRef.current = false
    }
  }, [engine.isFinished, playFinish])

  return null
}

export default useTypingFeedback
