import { storage } from './api'
import { calculateConsistency } from '../utils/calculateWPM'
import { todayKey } from '../utils/format'

const MAX_SESSIONS = 800

export function createEmptyProgress() {
  return {
    version: 1,
    sessions: [],
    lessons: {},
    keyStats: {},
    games: { played: 0, bestScore: 0 },
    dailyActivity: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function normalizeProgress(raw) {
  const base = createEmptyProgress()
  if (!raw || typeof raw !== 'object') return base
  return {
    ...base,
    ...raw,
    sessions: Array.isArray(raw.sessions) ? raw.sessions : [],
    lessons: raw.lessons && typeof raw.lessons === 'object' ? raw.lessons : {},
    keyStats: raw.keyStats && typeof raw.keyStats === 'object' ? raw.keyStats : {},
    games: { ...base.games, ...(raw.games || {}) },
    dailyActivity: raw.dailyActivity && typeof raw.dailyActivity === 'object' ? raw.dailyActivity : {},
  }
}

export function loadProgress(userId = 'guest') {
  const raw = storage.get(`progress:${userId}`, null)
  return normalizeProgress(raw)
}

export function saveProgress(userId, progress) {
  storage.set(`progress:${userId}`, { ...progress, updatedAt: new Date().toISOString() })
}

export function clearProgress(userId = 'guest') {
  storage.remove(`progress:${userId}`)
}

function dayKeyOf(session) {
  if (session.day) return session.day
  const date = session.date ? new Date(session.date) : new Date()
  return todayKey(date)
}

function mergeKeyStats(current, incoming) {
  if (!incoming || typeof incoming !== 'object') return current
  const next = { ...current }
  for (const [char, data] of Object.entries(incoming)) {
    const prev = next[char] || { correct: 0, errors: 0 }
    next[char] = {
      correct: prev.correct + (Number(data.correct) || 0),
      errors: prev.errors + (Number(data.errors) || 0),
    }
  }
  return next
}

/** Add a finished session and fold its results into lessons / activity. */
export function applySession(progress, session) {
  const date = session.date || new Date().toISOString()
  const day = dayKeyOf({ ...session, date })

  const normalized = {
    id: session.id || `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    type: session.type || 'test',
    mode: session.mode || 'time',
    date,
    day,
    duration: Math.max(0, Number(session.duration) || 0),
    wpm: Math.max(0, Number(session.wpm) || 0),
    rawWpm: Math.max(0, Number(session.rawWpm) || 0),
    accuracy: Math.min(100, Math.max(0, Number(session.accuracy) || 0)),
    consistency: Math.min(100, Math.max(0, Number(session.consistency) || 0)),
    chars: Math.max(0, Number(session.chars) || 0),
    errors: Math.max(0, Number(session.errors) || 0),
    keystrokes: Math.max(0, Number(session.keystrokes) || 0),
    words: Math.max(0, Number(session.words) || 0),
    keyStats: session.keyStats || null,
    lessonId: session.lessonId || null,
    lessonTitle: session.lessonTitle || null,
    stars: Math.max(0, Number(session.stars) || 0),
    score: Math.max(0, Number(session.score) || 0),
    completed: session.completed !== false,
    label: session.label || '',
  }

  const dailyActivity = { ...progress.dailyActivity }
  const activity = dailyActivity[day] || { seconds: 0, chars: 0, sessions: 0 }
  dailyActivity[day] = {
    seconds: Math.round(activity.seconds + normalized.duration),
    chars: activity.chars + normalized.chars,
    sessions: activity.sessions + 1,
  }

  let lessons = progress.lessons
  if (normalized.type === 'lesson' && normalized.lessonId) {
    const prev = progress.lessons[normalized.lessonId] || {
      attempts: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      stars: 0,
      completed: false,
    }
    lessons = {
      ...progress.lessons,
      [normalized.lessonId]: {
        attempts: prev.attempts + 1,
        bestWpm: Math.max(prev.bestWpm, normalized.wpm),
        bestAccuracy: Math.max(prev.bestAccuracy, normalized.accuracy),
        stars: Math.max(prev.stars, normalized.stars),
        completed: prev.completed || normalized.completed,
        lastAt: date,
        title: normalized.lessonTitle || prev.title,
      },
    }
  }

  let games = progress.games
  if (normalized.type === 'game') {
    games = {
      played: (progress.games?.played || 0) + 1,
      bestScore: Math.max(progress.games?.bestScore || 0, normalized.score),
      lastAt: date,
    }
  }

  return {
    ...progress,
    sessions: [normalized, ...progress.sessions].slice(0, MAX_SESSIONS),
    lessons,
    games,
    dailyActivity,
    keyStats: mergeKeyStats(progress.keyStats, normalized.keyStats),
    updatedAt: new Date().toISOString(),
  }
}

function parseDay(key) {
  return new Date(`${key}T00:00:00`).getTime()
}

function computeStreaks(dailyActivity) {
  const active = Object.keys(dailyActivity)
    .filter((key) => (dailyActivity[key]?.sessions || 0) > 0)
    .sort()

  if (active.length === 0) return { current: 0, best: 0 }

  let best = 1
  let run = 1
  for (let i = 1; i < active.length; i += 1) {
    const diff = Math.round((parseDay(active[i]) - parseDay(active[i - 1])) / 86400000)
    if (diff === 1) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 1
    }
  }

  const today = todayKey()
  const yesterday = todayKey(new Date(Date.now() - 86400000))
  let cursor = null
  if (active.includes(today)) cursor = today
  else if (active.includes(yesterday)) cursor = yesterday
  if (!cursor) return { current: 0, best }

  let current = 0
  const activeSet = new Set(active)
  const date = new Date(`${cursor}T00:00:00`)
  while (activeSet.has(todayKey(date))) {
    current += 1
    date.setDate(date.getDate() - 1)
  }

  return { current, best }
}

export function getDerivedStats(progress) {
  const sessions = progress.sessions || []
  const scored = sessions.filter((session) => session.wpm > 0)
  const recent = scored.slice(0, 20)

  const totalSessions = sessions.length
  const totalTests = sessions.filter((s) => s.type === 'test').length
  const totalPractice = sessions.filter((s) => s.type === 'practice' || s.type === 'challenge').length
  const totalGames = sessions.filter((s) => s.type === 'game').length
  const totalLessonRuns = sessions.filter((s) => s.type === 'lesson').length

  const totalSeconds = sessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0)
  const totalChars = sessions.reduce((sum, s) => sum + (Number(s.chars) || 0), 0)
  const totalErrors = sessions.reduce((sum, s) => sum + (Number(s.errors) || 0), 0)

  const bestWpm = scored.reduce((max, s) => Math.max(max, s.wpm), 0)
  const bestAccuracy = sessions.reduce((max, s) => Math.max(max, s.accuracy), 0)
  const avgWpm = recent.length ? recent.reduce((sum, s) => sum + s.wpm, 0) / recent.length : 0
  const avgAccuracy = recent.length ? recent.reduce((sum, s) => sum + s.accuracy, 0) / recent.length : 0
  const avgConsistency = recent.length
    ? recent.reduce((sum, s) => sum + (Number(s.consistency) || 0), 0) / recent.length
    : 0

  const lessonEntries = Object.values(progress.lessons || {})
  const lessonsCompleted = lessonEntries.filter((entry) => entry.completed).length
  const lessonStars = lessonEntries.reduce((sum, entry) => sum + (entry.stars || 0), 0)

  const { current: streak, best: bestStreak } = computeStreaks(progress.dailyActivity || {})

  const today = todayKey()
  const todayActivity = progress.dailyActivity?.[today] || { seconds: 0, chars: 0, sessions: 0 }
  const todaySessions = sessions.filter((s) => dayKeyOf(s) === today)
  const todayWpm = todaySessions.reduce((max, s) => Math.max(max, s.wpm), 0)

  const perfectRuns = sessions.filter(
    (s) => s.accuracy >= 99.95 && (s.keystrokes || s.chars) >= 20
  ).length

  const activeDays = Object.keys(progress.dailyActivity || {}).filter(
    (key) => (progress.dailyActivity[key]?.sessions || 0) > 0
  ).length

  return {
    totalSessions,
    totalTests,
    totalPractice,
    totalGames,
    totalLessonRuns,
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
    totalChars,
    totalErrors,
    bestWpm,
    bestAccuracy,
    avgWpm,
    avgAccuracy,
    avgConsistency,
    lessonsCompleted,
    lessonStars,
    streak,
    bestStreak,
    todaySeconds: todayActivity.seconds,
    todaySessions: todayActivity.sessions,
    todayChars: todayActivity.chars,
    todayWpm,
    perfectRuns,
    activeDays,
    gamesPlayed: progress.games?.played || 0,
    bestGameScore: progress.games?.bestScore || 0,
    lastSession: sessions[0] || null,
    keyStats: progress.keyStats || {},
  }
}

/** Data for a GitHub-style contribution heatmap. */
export function getActivityGrid(progress, weeks = 16) {
  const daily = progress.dailyActivity || {}
  const cells = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const end = new Date(today)
  const start = new Date(today)
  start.setDate(start.getDate() - (weeks * 7 - 1))
  // Align the start to Sunday so columns are full weeks.
  start.setDate(start.getDate() - start.getDay())

  const cursor = new Date(start)
  while (cursor <= end) {
    const key = todayKey(cursor)
    const activity = daily[key] || { seconds: 0, sessions: 0, chars: 0 }
    let level = 0
    if (activity.sessions > 0) {
      if (activity.seconds >= 600) level = 4
      else if (activity.seconds >= 300) level = 3
      else if (activity.seconds >= 120) level = 2
      else level = 1
    }
    cells.push({
      date: key,
      level,
      seconds: activity.seconds,
      sessions: activity.sessions,
      chars: activity.chars,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return cells
}

/** Per-day aggregates for the progress charts (oldest → newest). */
export function getDailySeries(progress, days = 14) {
  const daily = progress.dailyActivity || {}
  const sessions = progress.sessions || []
  const byDay = {}

  sessions.forEach((session) => {
    const key = dayKeyOf(session)
    if (!byDay[key]) byDay[key] = { wpm: [], accuracy: [], seconds: 0 }
    if (session.wpm > 0) byDay[key].wpm.push(session.wpm)
    if (session.accuracy > 0) byDay[key].accuracy.push(session.accuracy)
    byDay[key].seconds += session.duration || 0
  })

  const series = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = todayKey(date)
    const entry = byDay[key] || { wpm: [], accuracy: [], seconds: daily[key]?.seconds || 0 }
    const avg = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0)
    series.push({
      date: key,
      wpm: avg(entry.wpm),
      accuracy: avg(entry.accuracy),
      seconds: entry.seconds,
      sessions: daily[key]?.sessions || 0,
    })
  }
  return series
}

/** Raw session series for the WPM trend line (oldest → newest). */
export function getWpmSeries(progress, limit = 24) {
  return (progress.sessions || [])
    .filter((session) => session.wpm > 0)
    .slice(0, limit)
    .reverse()
    .map((session) => ({
      date: session.date,
      wpm: session.wpm,
      rawWpm: session.rawWpm,
      accuracy: session.accuracy,
      type: session.type,
    }))
}

/** Fold a per-session consistency estimate when a hook does not provide one. */
export function estimateConsistency(samples, fallback = 85) {
  if (!samples || samples.length < 2) return fallback
  return calculateConsistency(samples)
}

export function getPersonalBests(progress) {
  const sessions = progress.sessions || []
  const bestByType = {}
  sessions.forEach((session) => {
    const key = session.type || 'test'
    if (!bestByType[key] || session.wpm > bestByType[key].wpm) bestByType[key] = session
  })
  return bestByType
}
