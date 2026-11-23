import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  Download,
  Eraser,
  EyeOff,
  Gauge,
  Keyboard,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Target,
  Timer,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useProgress } from '../context/ProgressContext'
import { useAuth } from '../context/AuthContext'
import { useSound } from '../hooks/useSound'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import ProgressBar from '../components/common/ProgressBar'
import { Segmented } from '../components/typing/TypingControls'
import { formatTime, todayKey } from '../utils/format'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun, colors: ['#F8FAFC', '#E2E8F0'] },
  { value: 'dark', label: 'Dark', icon: Moon, colors: ['#0F172A', '#334155'] },
  { value: 'system', label: 'System', icon: Monitor, colors: ['#E2E8F0', '#334155'] },
]

const CARET_OPTIONS = [
  { value: 'line', label: 'Line' },
  { value: 'block', label: 'Block' },
  { value: 'underline', label: 'Underline' },
]

const LAYOUT_OPTIONS = [
  { value: 'qwerty', label: 'QWERTY' },
  { value: 'dvorak', label: 'Dvorak' },
  { value: 'colemak', label: 'Colemak' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'common', label: 'Common words' },
  { value: 'advanced', label: 'Advanced' },
]

const DURATION_OPTIONS = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 120, label: '120s' },
]

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className="switch"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    />
  )
}

function SettingLine({ title, description, control }) {
  return (
    <div className="setting-line">
      <div className="setting-line__info">
        <div className="setting-line__title">{title}</div>
        {description && <div className="setting-line__desc">{description}</div>}
      </div>
      <div className="setting-line__control">{control}</div>
    </div>
  )
}

function SettingsSection({ icon: SectionIcon, title, description, children }) {
  return (
    <section className="settings-section">
      <div className="settings-section__head">
        <div>
          <h2>
            <SectionIcon size={17} /> {title}
          </h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div className="settings-section__body">{children}</div>
    </section>
  )
}

function Settings() {
  const { settings, resolvedTheme, updateSetting, resetSettings } = useSettings()
  const { progress, stats, resetProgress } = useProgress()
  const { user } = useAuth()
  const { playKey, playError } = useSound()

  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState('')

  const storageSize = useMemo(() => {
    try {
      return new Blob([JSON.stringify(progress)]).size
    } catch {
      return 0
    }
  }, [progress])

  const todayMinutes = stats.todaySeconds / 60
  const goalPercent = Math.min(
    100,
    (todayMinutes / Math.max(1, Number(settings.dailyGoal) || 15)) * 100
  )

  const flash = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const handleExport = () => {
    const payload = {
      app: 'TypeFlow',
      version: 1,
      exportedAt: new Date().toISOString(),
      account: user
        ? { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
        : { id: 'guest', name: 'Guest' },
      settings,
      progress,
    }

    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `typeflow-export-${todayKey()}.json`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
      flash('Export downloaded')
    } catch {
      flash('Could not create the export file')
    }
  }

  const handleConfirm = () => {
    if (confirm === 'progress') {
      resetProgress()
      flash('Progress reset — a clean slate')
    }
    if (confirm === 'settings') {
      resetSettings()
      flash('Settings restored to defaults')
    }
    setConfirm(null)
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <SlidersHorizontal size={14} /> Preferences
            </span>
            <h1 className="page-head__title">Settings</h1>
            <p className="page-head__subtitle">
              Tune the experience to your hands, your screen and the way you like to learn. Every
              change saves instantly on this device.
            </p>
          </div>
          <div className="row">
            {toast && (
              <span className="chip chip--success">
                <Check size={13} /> {toast}
              </span>
            )}
            <Link to="/practice" className="btn btn--outline">
              <Keyboard size={16} /> Try changes
            </Link>
          </div>
        </div>

        <div className="settings-layout">
          <div className="settings-main">
            <SettingsSection
              icon={Palette}
              title="Appearance"
              description="Colour, contrast and the feel of the typing surface."
            >
              <SettingLine
                title="Theme"
                description="Use a fixed theme or follow your operating system."
                control={
                  <div className="theme-options" role="group" aria-label="Theme">
                    {THEME_OPTIONS.map(({ value, label, icon: ThemeIcon, colors }) => (
                      <button
                        key={value}
                        type="button"
                        className={`theme-option ${settings.theme === value ? 'active' : ''}`}
                        onClick={() => updateSetting('theme', value)}
                        aria-pressed={settings.theme === value}
                        title={`${label}${value === 'system' ? ` (currently ${resolvedTheme})` : ''}`}
                      >
                        <span className="theme-option__preview" aria-hidden="true">
                          <i style={{ background: colors[0] }} />
                          <i style={{ background: colors[1] }} />
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <ThemeIcon size={11} /> {label}
                        </span>
                      </button>
                    ))}
                  </div>
                }
              />

              <SettingLine
                title="Typing text size"
                description="Scale the text in tests, lessons and practice."
                control={
                  <div className="range-wrap">
                    <input
                      type="range"
                      min="1"
                      max="2.2"
                      step="0.05"
                      value={settings.fontSize}
                      onChange={(event) => updateSetting('fontSize', Number(event.target.value))}
                      aria-label="Typing text size"
                    />
                    <output>{Math.round(settings.fontSize * 100)}%</output>
                  </div>
                }
              />

              <SettingLine
                title="Caret style"
                description="The line, block or underline that marks your position."
                control={
                  <Segmented
                    options={CARET_OPTIONS}
                    value={settings.caret}
                    onChange={(value) => updateSetting('caret', value)}
                    ariaLabel="Caret style"
                  />
                }
              />

              <SettingLine
                title="Smooth caret"
                description="Animate the caret as it moves between characters."
                control={
                  <Switch
                    checked={settings.smoothCaret}
                    onChange={(value) => updateSetting('smoothCaret', value)}
                    label="Smooth caret"
                  />
                }
              />
            </SettingsSection>

            <SettingsSection
              icon={Keyboard}
              title="Typing behaviour"
              description="How TypeFlow responds when you make a mistake."
            >
              <SettingLine
                title="Keyboard layout"
                description="Changes the on-screen labels only — your physical key positions stay the same."
                control={
                  <Segmented
                    options={LAYOUT_OPTIONS}
                    value={settings.layout}
                    onChange={(value) => updateSetting('layout', value)}
                    ariaLabel="Keyboard layout"
                  />
                }
              />

              <SettingLine
                title="Strict mode"
                description="Block the cursor on a wrong key. Mistakes must be corrected before moving on."
                control={
                  <Switch
                    checked={settings.strictMode}
                    onChange={(value) => updateSetting('strictMode', value)}
                    label="Strict mode"
                  />
                }
              />

              <SettingLine
                title="Blind mode"
                description="Hide error highlighting while you type, then reveal mistakes in the results."
                control={
                  <Switch
                    checked={settings.blindMode}
                    onChange={(value) => updateSetting('blindMode', value)}
                    label="Blind mode"
                  />
                }
              />
            </SettingsSection>

            <SettingsSection
              icon={Gauge}
              title="Text and tests"
              description="Default content options for practice and typing tests."
            >
              <SettingLine
                title="Punctuation"
                description="Include capitals, commas, full stops and other sentence marks."
                control={
                  <Switch
                    checked={settings.punctuation}
                    onChange={(value) => updateSetting('punctuation', value)}
                    label="Punctuation"
                  />
                }
              />
              <SettingLine
                title="Numbers"
                description="Mix numeric tokens and symbols into generated text."
                control={
                  <Switch
                    checked={settings.numbers}
                    onChange={(value) => updateSetting('numbers', value)}
                    label="Numbers"
                  />
                }
              />
              <SettingLine
                title="Word difficulty"
                description="Choose the vocabulary pool used for generated tests."
                control={
                  <Segmented
                    options={DIFFICULTY_OPTIONS}
                    value={settings.difficulty}
                    onChange={(value) => updateSetting('difficulty', value)}
                    ariaLabel="Word difficulty"
                  />
                }
              />
              <SettingLine
                title="Default test duration"
                description="The time limit selected when you open a new timed test."
                control={
                  <Segmented
                    options={DURATION_OPTIONS}
                    value={settings.testDuration}
                    onChange={(value) => updateSetting('testDuration', value)}
                    ariaLabel="Default test duration"
                  />
                }
              />
            </SettingsSection>

            <SettingsSection
              icon={Volume2}
              title="Guidance and sound"
              description="Visual cues and audio feedback while you type."
            >
              <SettingLine
                title="On-screen keyboard"
                description="Highlight the next key and the finger that should press it."
                control={
                  <Switch
                    checked={settings.showKeyboard}
                    onChange={(value) => updateSetting('showKeyboard', value)}
                    label="Show on-screen keyboard"
                  />
                }
              />

              <SettingLine
                title="Hand guide"
                description="Show the finger legend and animated hand cues below the keyboard."
                control={
                  <Switch
                    checked={settings.showHands}
                    onChange={(value) => updateSetting('showHands', value)}
                    label="Show hand guide"
                  />
                }
              />

              <SettingLine
                title="Key sounds"
                description="Soft synthesized clicks on every keystroke, with a distinct error tone."
                control={
                  <div className="row" style={{ gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => {
                        playKey()
                        window.setTimeout(playError, 160)
                      }}
                      disabled={!settings.sound}
                    >
                      <Volume2 size={14} /> Preview
                    </button>
                    <Switch
                      checked={settings.sound}
                      onChange={(value) => updateSetting('sound', value)}
                      label="Key sounds"
                    />
                  </div>
                }
              />

              <SettingLine
                title="Volume"
                description="Applies to key clicks, error tones and finish chimes."
                control={
                  <div className="range-wrap">
                    <VolumeX size={15} className="muted" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.volume}
                      onChange={(event) => updateSetting('volume', Number(event.target.value))}
                      disabled={!settings.sound}
                      aria-label="Sound volume"
                    />
                    <Volume2 size={15} className="muted" />
                    <output>{Math.round(settings.volume * 100)}%</output>
                  </div>
                }
              />
            </SettingsSection>

            <SettingsSection
              icon={Target}
              title="Goals"
              description="A gentle target to keep the habit moving."
            >
              <SettingLine
                title="Daily practice goal"
                description="Shown on your progress page and in the navbar streak area."
                control={
                  <div className="range-wrap">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={settings.dailyGoal}
                      onChange={(event) => updateSetting('dailyGoal', Number(event.target.value))}
                      aria-label="Daily practice goal in minutes"
                    />
                    <output>{settings.dailyGoal} min</output>
                  </div>
                }
              />
              <div style={{ marginBottom: '0.9rem' }}>
                <div className="spread" style={{ marginBottom: '0.35rem' }}>
                  <span className="small muted">Today</span>
                  <span className="small muted">
                    {Math.round(todayMinutes)} / {settings.dailyGoal} min
                  </span>
                </div>
                <ProgressBar value={goalPercent} variant="success" />
              </div>
            </SettingsSection>

            <SettingsSection
              icon={Save}
              title="Data"
              description="Your profile and progress live entirely in this browser."
            >
              <SettingLine
                title="Export your data"
                description="Download a JSON snapshot with your account, settings and every session."
                control={
                  <Button variant="soft" onClick={handleExport}>
                    <Download size={15} /> Export JSON
                  </Button>
                }
              />
              <SettingLine
                title="Storage used"
                description={`${stats.totalSessions} sessions · ${formatTime(stats.totalSeconds)} practiced`}
                control={<span className="chip chip--secondary">{(storageSize / 1024).toFixed(1)} KB</span>}
              />
              <SettingLine
                title="Reset settings"
                description="Restore the default theme, caret, layout, sound and test options."
                control={
                  <Button variant="outline" onClick={() => setConfirm('settings')}>
                    <RotateCcw size={15} /> Restore defaults
                  </Button>
                }
              />
              <SettingLine
                title="Reset progress"
                description="Delete every session, achievement, personal best and lesson star on this profile."
                control={
                  <Button variant="danger" onClick={() => setConfirm('progress')}>
                    <Eraser size={15} /> Reset progress
                  </Button>
                }
              />
            </SettingsSection>
          </div>

          <aside className="settings-preview" aria-label="Live typing preview">
            <div className="settings-preview__title">
              <Zap size={14} /> Live preview
            </div>

            <div className="settings-preview__text" data-caret={settings.caret}>
              <span className="done">the quick brown </span>
              <span className="wrong">fz</span>
              <span className="cursor">o</span>
              <span>x jumps over the lazy dog</span>
            </div>

            <div className="row" style={{ marginTop: '1rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span className="chip chip--primary">
                {LAYOUT_OPTIONS.find((option) => option.value === settings.layout)?.label}
              </span>
              <span className="chip">
                {settings.caret === 'line'
                  ? 'Line caret'
                  : settings.caret === 'block'
                    ? 'Block caret'
                    : 'Underline caret'}
              </span>
              {settings.strictMode && (
                <span className="chip chip--warning">
                  <ShieldCheck size={12} /> Strict
                </span>
              )}
              {settings.blindMode && (
                <span className="chip chip--info">
                  <EyeOff size={12} /> Blind
                </span>
              )}
              {settings.sound ? (
                <span className="chip chip--success">
                  <Volume2 size={12} /> Sound
                </span>
              ) : (
                <span className="chip">
                  <VolumeX size={12} /> Muted
                </span>
              )}
            </div>

            <div className="divider" />

            <div className="stack" style={{ gap: '0.55rem' }}>
              <div className="spread">
                <span className="small muted">Text size</span>
                <b className="mono small">{Math.round(settings.fontSize * 100)}%</b>
              </div>
              <div className="spread">
                <span className="small muted">Daily goal</span>
                <b className="mono small">{settings.dailyGoal} min</b>
              </div>
              <div className="spread">
                <span className="small muted">Test duration</span>
                <b className="mono small">{settings.testDuration}s</b>
              </div>
              <div className="spread">
                <span className="small muted">Keyboard hints</span>
                <b className="mono small">{settings.showKeyboard ? 'On' : 'Off'}</b>
              </div>
              <div className="spread">
                <span className="small muted">Hand guide</span>
                <b className="mono small">{settings.showHands ? 'On' : 'Off'}</b>
              </div>
            </div>

            {settings.showKeyboard && (
              <div className="divider" />
            )}
            {settings.showKeyboard && (
              <p className="small muted" style={{ textAlign: 'center' }}>
                Keyboard guidance is enabled. Open a test to see the next-key highlight in action.
              </p>
            )}

            <div className="divider" />
            <Link to="/test" className="btn btn--primary btn--block btn--sm">
              <Timer size={15} /> Open a test
            </Link>
          </aside>
        </div>

        <Modal
          open={Boolean(confirm)}
          onClose={() => setConfirm(null)}
          title={confirm === 'progress' ? 'Reset all progress?' : 'Restore default settings?'}
          subtitle={
            confirm === 'progress'
              ? 'This permanently removes every session, achievement, personal best and lesson star on this profile.'
              : 'Your theme, caret, layout, sound and test preferences will return to their defaults.'
          }
        >
          <div className="stack" style={{ gap: '1rem' }}>
            <div className={`auth-error`} style={{
              background: confirm === 'progress' ? 'var(--error-soft)' : 'var(--warning-soft)',
              color: confirm === 'progress' ? 'var(--error)' : 'var(--warning)',
            }}>
              {confirm === 'progress' ? <Eraser size={15} /> : <RotateCcw size={15} />}
              {confirm === 'progress'
                ? 'This action cannot be undone. Consider exporting your data first.'
                : 'Session history and achievements are not affected.'}
            </div>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setConfirm(null)}>
                Cancel
              </Button>
              <Button variant={confirm === 'progress' ? 'danger' : 'primary'} onClick={handleConfirm}>
                {confirm === 'progress' ? (
                  <>
                    <Eraser size={15} /> Yes, reset progress
                  </>
                ) : (
                  <>
                    <RotateCcw size={15} /> Restore defaults
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  )
}

export default Settings
