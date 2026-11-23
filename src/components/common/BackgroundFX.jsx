import { useEffect, useRef } from 'react'
import { useSettings } from '../../context/SettingsContext'

/**
 * Decorative, pointer-reactive backdrop used by the dark theme. It lags behind
 * the cursor with a soft glow, a parallax dot grid and two slow aurora blobs.
 * Purely visual: it never captures pointer events and stays still when the
 * visitor prefers reduced motion.
 */
function BackgroundFX() {
  const { resolvedTheme } = useSettings()
  const isDark = resolvedTheme === 'dark'
  const rootRef = useRef(null)
  const primaryRef = useRef(null)
  const secondaryRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    if (!isDark) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return undefined
    }

    const primary = primaryRef.current
    const secondary = secondaryRef.current
    const grid = gridRef.current
    const root = rootRef.current

    let frame = 0
    let targetX = 0.72
    let targetY = 0.2
    let x = targetX
    let y = targetY

    const paint = () => {
      frame = 0

      if (primary) {
        primary.style.transform = `translate3d(${(x - 0.5) * 100}vw, ${(y - 0.5) * 100}vh, 0)`
      }
      if (secondary) {
        secondary.style.transform = `translate3d(${(0.5 - x) * 70}vw, ${(0.5 - y) * 60}vh, 0)`
      }
      if (grid) {
        grid.style.transform = `translate3d(${(0.5 - x) * 26}px, ${(0.5 - y) * 20}px, 0)`
      }

      if (Math.abs(targetX - x) > 0.0005 || Math.abs(targetY - y) > 0.0005) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    const tick = () => {
      x += (targetX - x) * 0.075
      y += (targetY - y) * 0.075
      paint()
    }

    const onPointerMove = (event) => {
      targetX = Math.min(1, Math.max(0, event.clientX / window.innerWidth))
      targetY = Math.min(1, Math.max(0, event.clientY / window.innerHeight))
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    const onPointerDown = () => root?.classList.add('bg-fx--pressed')
    const onPointerUp = () => root?.classList.remove('bg-fx--pressed')

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [isDark])

  if (!isDark) return null

  return (
    <div className="bg-fx" ref={rootRef} aria-hidden="true">
      <span className="bg-fx__blob bg-fx__blob--one" />
      <span className="bg-fx__blob bg-fx__blob--two" />
      <span className="bg-fx__grid" ref={gridRef} />
      <span className="bg-fx__spot bg-fx__spot--secondary" ref={secondaryRef} />
      <span className="bg-fx__spot bg-fx__spot--primary" ref={primaryRef} />
    </div>
  )
}

export default BackgroundFX
