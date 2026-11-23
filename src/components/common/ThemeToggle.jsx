import { Moon, Sun } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

function ThemeToggle({ className = '' }) {
  const { resolvedTheme, toggleTheme } = useSettings()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      className={`icon-btn ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ThemeToggle
