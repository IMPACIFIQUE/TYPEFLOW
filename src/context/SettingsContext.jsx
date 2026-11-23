import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '../services/api'

const SettingsContext = createContext(null)
const SETTINGS_KEY = 'settings'

export const DEFAULT_SETTINGS = {
  theme: 'system', // 'light' | 'dark' | 'system'
  sound: true,
  volume: 0.45,
  caret: 'line', // 'line' | 'block' | 'underline'
  fontSize: 1.45, // rem applied to typing text
  layout: 'qwerty', // qwerty | dvorak | colemak
  blindMode: false,
  strictMode: false,
  showKeyboard: true,
  showHands: true,
  smoothCaret: true,
  dailyGoal: 15, // minutes
  punctuation: false,
  numbers: false,
  difficulty: 'common',
  testDuration: 30,
}

function readSettings() {
  const stored = storage.get(SETTINGS_KEY, {})
  return { ...DEFAULT_SETTINGS, ...(stored && typeof stored === 'object' ? stored : {}) }
}

function systemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readSettings)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  useEffect(() => {
    if (!window.matchMedia) return undefined
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (event) => setSystemDark(event.matches)
    query.addEventListener?.('change', handler)
    return () => query.removeEventListener?.('change', handler)
  }, [])

  const resolvedTheme = settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolvedTheme
    root.style.colorScheme = resolvedTheme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', resolvedTheme === 'dark' ? '#0F172A' : '#F7F6FB')
  }, [resolvedTheme])

  useEffect(() => {
    document.documentElement.style.setProperty('--typing-font-size', `${settings.fontSize}rem`)
  }, [settings.fontSize])

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      storage.set(SETTINGS_KEY, next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    storage.set(SETTINGS_KEY, DEFAULT_SETTINGS)
    setSettings({ ...DEFAULT_SETTINGS })
  }, [])

  const toggleTheme = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, theme: resolvedTheme === 'dark' ? 'light' : 'dark' }
      storage.set(SETTINGS_KEY, next)
      return next
    })
  }, [resolvedTheme])

  const value = useMemo(
    () => ({
      settings,
      resolvedTheme,
      updateSetting,
      resetSettings,
      toggleTheme,
    }),
    [settings, resolvedTheme, updateSetting, resetSettings, toggleTheme]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used inside a SettingsProvider')
  return context
}

export default SettingsContext
