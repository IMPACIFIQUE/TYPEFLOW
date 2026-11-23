/**
 * Small persistence layer.
 *
 * TypeFlow is designed to run fully offline, so the "API" is a namespaced
 * localStorage adapter with safe parsing. If a remote backend is added later,
 * these helpers are the seam to swap in fetch calls.
 */

const NAMESPACE = 'typeflow'

function scopedKey(key) {
  return `${NAMESPACE}:${key}`
}

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(scopedKey(key))
      if (raw === null) return fallback
      return JSON.parse(raw)
    } catch {
      return fallback
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(scopedKey(key), JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(scopedKey(key))
      return true
    } catch {
      return false
    }
  },

  keys() {
    try {
      return Object.keys(window.localStorage)
        .filter((key) => key.startsWith(`${NAMESPACE}:`))
        .map((key) => key.slice(NAMESPACE.length + 1))
    } catch {
      return []
    }
  },

  clear() {
    this.keys().forEach((key) => storage.remove(key))
  },
}

export function isStorageAvailable() {
  try {
    const test = `${NAMESPACE}:__test__`
    window.localStorage.setItem(test, '1')
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export default storage
