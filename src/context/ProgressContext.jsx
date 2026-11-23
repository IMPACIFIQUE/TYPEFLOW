import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { evaluateAchievements } from '../data/achievements'
import {
  applySession,
  clearProgress,
  createEmptyProgress,
  getDerivedStats,
  loadProgress,
  saveProgress,
} from '../services/progressService'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'

  const [progress, setProgress] = useState(() => loadProgress(userId))
  const progressRef = useRef(progress)

  useEffect(() => {
    const loaded = loadProgress(userId)
    progressRef.current = loaded
    setProgress(loaded)
  }, [userId])

  const stats = useMemo(() => getDerivedStats(progress), [progress])
  const achievements = useMemo(() => evaluateAchievements(stats), [stats])
  const unlockedAchievements = useMemo(
    () => achievements.filter((achievement) => achievement.unlocked),
    [achievements]
  )
  const nextAchievement = useMemo(
    () =>
      achievements
        .filter((achievement) => !achievement.unlocked)
        .sort((a, b) => b.progress - a.progress)[0] || null,
    [achievements]
  )

  const addSession = useCallback(
    (record) => {
      const current = progressRef.current
      const beforeUnlocked = new Set(
        evaluateAchievements(getDerivedStats(current))
          .filter((achievement) => achievement.unlocked)
          .map((achievement) => achievement.id)
      )

      const next = applySession(current, record)
      progressRef.current = next
      saveProgress(userId, next)
      setProgress(next)

      const nextStats = getDerivedStats(next)
      const newAchievements = evaluateAchievements(nextStats).filter(
        (achievement) => achievement.unlocked && !beforeUnlocked.has(achievement.id)
      )

      return { stats: nextStats, newAchievements }
    },
    [userId]
  )

  const resetProgress = useCallback(() => {
    clearProgress(userId)
    const empty = createEmptyProgress()
    progressRef.current = empty
    saveProgress(userId, empty)
    setProgress(empty)
  }, [userId])

  const value = useMemo(
    () => ({
      progress,
      stats,
      achievements,
      unlockedAchievements,
      nextAchievement,
      addSession,
      resetProgress,
      userId,
    }),
    [progress, stats, achievements, unlockedAchievements, nextAchievement, addSession, resetProgress, userId]
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used inside a ProgressProvider')
  return context
}

export default ProgressContext
