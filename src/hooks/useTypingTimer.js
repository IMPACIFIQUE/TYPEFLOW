import { useEffect, useState } from 'react'

/**
 * Wall-clock timer driven by an explicit start/finish timestamp so it stays
 * accurate even when the tab throttles intervals.
 */
export function useTypingTimer({ startedAt = null, finishedAt = null, duration = 0 } = {}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!startedAt || finishedAt) return undefined
    const id = window.setInterval(() => setNow(Date.now()), 200)
    return () => window.clearInterval(id)
  }, [startedAt, finishedAt])

  const end = finishedAt || (startedAt ? now : 0)
  const elapsedMs = startedAt ? Math.max(0, end - startedAt) : 0
  const elapsedSeconds = elapsedMs / 1000
  const timeLeft = duration > 0 ? Math.max(0, duration - elapsedSeconds) : 0
  const isExpired = duration > 0 && startedAt ? elapsedMs >= duration * 1000 : false

  return {
    now,
    elapsedMs,
    elapsedSeconds,
    timeLeft,
    isExpired,
  }
}

export default useTypingTimer
