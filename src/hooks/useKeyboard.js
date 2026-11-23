import { useEffect, useState } from 'react'

/**
 * Tracks physically pressed keys (KeyboardEvent.code) for the virtual keyboard.
 */
export function useKeyboard(enabled = true) {
  const [pressed, setPressed] = useState(() => new Set())
  const [lastCode, setLastCode] = useState(null)

  useEffect(() => {
    if (!enabled) {
      setPressed(new Set())
      return undefined
    }

    const onDown = (event) => {
      if (!event.code) return
      setLastCode(event.code)
      setPressed((prev) => {
        if (prev.has(event.code)) return prev
        const next = new Set(prev)
        next.add(event.code)
        return next
      })
    }

    const onUp = (event) => {
      if (!event.code) return
      setPressed((prev) => {
        if (!prev.has(event.code)) return prev
        const next = new Set(prev)
        next.delete(event.code)
        return next
      })
    }

    const clear = () => setPressed(new Set())

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', clear)
    }
  }, [enabled])

  return { pressed, lastCode }
}

export default useKeyboard
