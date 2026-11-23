/** Words-per-minute calculations used across tests, lessons and games. */

const CHARS_PER_WORD = 5

/**
 * Net WPM: only correctly typed characters count.
 * @param {number} correctChars
 * @param {number} elapsedMs
 */
export function calculateWPM(correctChars, elapsedMs) {
  if (!elapsedMs || elapsedMs <= 0) return 0
  const minutes = elapsedMs / 60000
  if (!minutes) return 0
  return Math.max(0, (correctChars / CHARS_PER_WORD) / minutes)
}

/**
 * Raw WPM: every typed character counts, right or wrong.
 */
export function calculateRawWPM(totalChars, elapsedMs) {
  if (!elapsedMs || elapsedMs <= 0) return 0
  const minutes = elapsedMs / 60000
  return Math.max(0, (totalChars / CHARS_PER_WORD) / minutes)
}

/**
 * Consistency score (0–100) based on the coefficient of variation of the
 * per-second WPM samples. Lower variance → higher consistency.
 */
export function calculateConsistency(samples) {
  const values = samples.map((s) => (typeof s === 'number' ? s : s.wpm)).filter((n) => Number.isFinite(n) && n >= 0)
  if (values.length < 2) return 100
  const mean = values.reduce((sum, n) => sum + n, 0) / values.length
  if (mean <= 0) return 0
  const variance = values.reduce((sum, n) => sum + (n - mean) ** 2, 0) / values.length
  const stdDev = Math.sqrt(variance)
  const cv = stdDev / mean
  return Math.max(0, Math.min(100, Math.round((1 - cv) * 100)))
}

export function calculateNetWPM(correctChars, incorrectChars, elapsedMs) {
  const minutes = elapsedMs / 60000
  if (!minutes) return 0
  return Math.max(0, ((correctChars - incorrectChars) / CHARS_PER_WORD) / minutes)
}

/** CPM (characters per minute) — useful for code typing. */
export function calculateCPM(correctChars, elapsedMs) {
  if (!elapsedMs || elapsedMs <= 0) return 0
  return Math.round(correctChars / (elapsedMs / 60000))
}
