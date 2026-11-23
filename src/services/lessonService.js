import {
  LEVEL_META,
  TOTAL_LESSONS,
  allLessons,
  getLessonById,
  getUnitById,
  lessonUnits,
} from '../data/lessons'

export { LEVEL_META, TOTAL_LESSONS, allLessons, getLessonById, getUnitById, lessonUnits }

export function getLessonProgress(progress, lessonId) {
  return progress?.lessons?.[lessonId] || null
}

export function isLessonComplete(progress, lessonId) {
  return Boolean(getLessonProgress(progress, lessonId)?.completed)
}

/**
 * Star rating — completion earns one star, pace and accuracy earn the rest.
 */
export function calculateLessonStars(lesson, { wpm = 0, accuracy = 0, completed = true }) {
  if (!completed) return 0
  if (wpm >= lesson.targetWpm && accuracy >= 97) return 3
  if (wpm >= lesson.targetWpm * 0.75 && accuracy >= 93) return 2
  return 1
}

export function getUnitProgress(progress, unit) {
  const lessons = unit.lessons
  const completed = lessons.filter((lesson) => isLessonComplete(progress, lesson.id)).length
  const stars = lessons.reduce((sum, lesson) => {
    const entry = getLessonProgress(progress, lesson.id)
    return sum + (entry?.stars || 0)
  }, 0)
  return {
    completed,
    total: lessons.length,
    percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
    stars,
    maxStars: lessons.length * 3,
  }
}

export function getOverallLessonProgress(progress) {
  let completed = 0
  let stars = 0
  lessonUnits.forEach((unit) => {
    const result = getUnitProgress(progress, unit)
    completed += result.completed
    stars += result.stars
  })
  return {
    completed,
    total: TOTAL_LESSONS,
    percent: TOTAL_LESSONS ? Math.round((completed / TOTAL_LESSONS) * 100) : 0,
    stars,
    maxStars: TOTAL_LESSONS * 3,
  }
}

/** The next lesson a learner should open: first incomplete, then lowest stars. */
export function getRecommendedLesson(progress) {
  const firstIncomplete = allLessons.find((lesson) => !isLessonComplete(progress, lesson.id))
  if (firstIncomplete) return firstIncomplete

  let weakest = allLessons[0]
  let weakestStars = 4
  allLessons.forEach((lesson) => {
    const stars = getLessonProgress(progress, lesson.id)?.stars ?? 0
    if (stars < weakestStars) {
      weakest = lesson
      weakestStars = stars
    }
  })
  return weakest
}

export function getNextLesson(lessonId) {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId)
  if (index === -1) return null
  return allLessons[index + 1] || null
}

export function getPreviousLesson(lessonId) {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId)
  if (index <= 0) return null
  return allLessons[index - 1] || null
}

export function getExerciseTexts(lesson) {
  return (lesson?.exercises || []).map((exercise) => exercise.text)
}

export function getLessonByUnit(unitId) {
  const unit = getUnitById(unitId)
  return unit ? unit.lessons : []
}
