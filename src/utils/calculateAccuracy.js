/** Accuracy helpers. */

/**
 * Standard typing accuracy: correct keystrokes ÷ total keystrokes.
 * @param {number} correctChars
 * @param {number} totalTyped
 */
export function calculateAccuracy(correctChars, totalTyped) {
  if (!totalTyped || totalTyped <= 0) return 100
  return Math.max(0, Math.min(100, (correctChars / totalTyped) * 100))
}

/**
 * "Adjusted" accuracy that penalises corrections: errors ÷ total keystrokes
 * including backspaces. Useful for strict drills.
 */
export function calculateAdjustedAccuracy(correctChars, totalKeystrokes, errors) {
  if (!totalKeystrokes || totalKeystrokes <= 0) return 100
  const clean = totalKeystrokes - errors
  return Math.max(0, Math.min(100, (clean / totalKeystrokes) * 100))
}

export function accuracyTone(accuracy) {
  if (accuracy >= 98) return 'success'
  if (accuracy >= 94) return 'info'
  if (accuracy >= 88) return 'warning'
  return 'error'
}

export function wpmTone(wpm) {
  if (wpm >= 80) return 'success'
  if (wpm >= 55) return 'primary'
  if (wpm >= 35) return 'info'
  return 'warning'
}
