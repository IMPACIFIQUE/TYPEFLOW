import { useCallback, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'

/**
 * Lightweight synthesized sound effects. No audio assets required — the
 * AudioContext is created lazily on the first keystroke (a user gesture).
 */
export function useSound() {
  const { settings } = useSettings()
  const contextRef = useRef(null)

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return null
    const AudioCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioCtor) return null
    if (!contextRef.current) contextRef.current = new AudioCtor()
    if (contextRef.current.state === 'suspended') {
      contextRef.current.resume().catch(() => {})
    }
    return contextRef.current
  }, [])

  const tone = useCallback(
    (frequency, duration, { type = 'sine', gain = 0.04, delay = 0, endFrequency = null } = {}) => {
      if (!settings.sound) return
      const ctx = getContext()
      if (!ctx) return
      const volume = Math.max(0, Math.min(1, settings.volume ?? 0.5))
      const now = ctx.currentTime + delay

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, now)
      if (endFrequency) {
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration)
      }

      const peak = Math.max(0.0001, gain * volume)
      gainNode.gain.setValueAtTime(0.0001, now)
      gainNode.gain.exponentialRampToValueAtTime(peak, now + 0.008)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.start(now)
      oscillator.stop(now + duration + 0.02)
    },
    [getContext, settings.sound, settings.volume]
  )

  const playKey = useCallback(() => {
    if (!settings.sound) return
    const pitch = 520 + Math.random() * 120
    tone(pitch, 0.045, { type: 'triangle', gain: 0.035 })
  }, [settings.sound, tone])

  const playBackspace = useCallback(() => {
    tone(300, 0.05, { type: 'triangle', gain: 0.025, endFrequency: 220 })
  }, [tone])

  const playError = useCallback(() => {
    if (!settings.sound) return
    tone(190, 0.12, { type: 'sawtooth', gain: 0.05, endFrequency: 110 })
  }, [settings.sound, tone])

  const playSuccess = useCallback(() => {
    tone(523.25, 0.12, { type: 'sine', gain: 0.05 })
    tone(659.25, 0.12, { type: 'sine', gain: 0.05, delay: 0.09 })
    tone(783.99, 0.18, { type: 'sine', gain: 0.05, delay: 0.18 })
  }, [tone])

  const playFinish = useCallback(() => {
    tone(523.25, 0.14, { type: 'sine', gain: 0.06 })
    tone(659.25, 0.14, { type: 'sine', gain: 0.06, delay: 0.1 })
    tone(783.99, 0.14, { type: 'sine', gain: 0.06, delay: 0.2 })
    tone(1046.5, 0.3, { type: 'sine', gain: 0.06, delay: 0.3 })
  }, [tone])

  return { playKey, playBackspace, playError, playSuccess, playFinish, enabled: settings.sound }
}

export default useSound
