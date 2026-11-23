import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CornerDownLeft, Shuffle, Sparkles } from 'lucide-react'
import {
  HOME_KEYS,
  KEYBOARD_ROWS,
  KEY_FINGERS,
  LAYOUTS,
  SHIFT_MAP,
  getLayoutLabel,
} from '../../utils/keyboardLayouts'
import { FINGERS, getFingerKeys } from '../../utils/fingerMapping'
import HandGuide from '../keyboard/HandGuide'
import { allLessons } from '../../services/lessonService'

const ROW_LABELS = ['Number row', 'Top row', 'Home row', 'Bottom row', 'Modifier row']

const SHIFTED_BY_BASE = Object.fromEntries(
  Object.entries(SHIFT_MAP).map(([shifted, base]) => [base, shifted])
)

function keyLabel(key, layout) {
  if (key.label) return key.label
  const label = getLayoutLabel(key.code, layout)
  if (!label) return ''
  if (label === ' ') return 'space'
  if (label.length === 1 && /[a-z]/.test(label)) return label.toUpperCase()
  return label
}

function shiftedLabel(code, layout) {
  const base = getLayoutLabel(code, layout)
  if (!base || base === ' ' || base.length !== 1) return null
  if (/[a-z]/.test(base)) return base.toUpperCase()
  return SHIFTED_BY_BASE[base] || null
}

function lessonForChar(char) {
  if (!char) return null
  return (
    allLessons.find((lesson) =>
      lesson.keys.some((key) => key === char || key.toLowerCase() === char.toLowerCase())
    ) || null
  )
}

function KeyboardExplorer({ layout = 'qwerty' }) {
  const [selectedCode, setSelectedCode] = useState('KeyF')

  const layoutMeta = LAYOUTS[layout] || LAYOUTS.qwerty
  const selectedKey = useMemo(
    () => KEYBOARD_ROWS.flat().find((key) => key.code === selectedCode) || null,
    [selectedCode]
  )

  const selectedRowIndex = useMemo(
    () => KEYBOARD_ROWS.findIndex((row) => row.some((key) => key.code === selectedCode)),
    [selectedCode]
  )

  const baseChar = getLayoutLabel(selectedCode, layout)
  const fingerId = KEY_FINGERS[selectedCode] || null
  const finger = fingerId ? FINGERS[fingerId] : null
  const label = selectedKey ? keyLabel(selectedKey, layout) : ''
  const shifted = shiftedLabel(selectedCode, layout)
  const isHome = HOME_KEYS.has(selectedCode)
  const rowName = ROW_LABELS[selectedRowIndex] || 'Keyboard'
  const fingerKeys = finger ? getFingerKeys(finger.id, layout) : []
  const lesson = lessonForChar(baseChar)

  const chooseRandomKey = () => {
    const printable = KEYBOARD_ROWS.flat().filter((key) => !key.modifier)
    const next = printable[Math.floor(Math.random() * printable.length)]
    if (next) setSelectedCode(next.code)
  }

  return (
    <div className="guide-explorer card">
      <div className="guide-explorer__head">
        <div>
          <span className="guide-explorer__title">
            <Sparkles size={14} /> Interactive key map
          </span>
          <p className="small muted">Tap a key to see its finger, row and best practice drill.</p>
        </div>
        <div className="row" style={{ gap: '0.4rem' }}>
          <span className="chip chip--primary">{layoutMeta.name}</span>
          <button type="button" className="btn btn--ghost btn--sm" onClick={chooseRandomKey}>
            <Shuffle size={14} /> Random key
          </button>
        </div>
      </div>

      <div className="guide-explorer__body">
        <div className="guide-explorer__keyboard">
          <div className="keyboard guide-keyboard" role="group" aria-label="Interactive keyboard">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div className="keyboard__row" key={`guide-row-${rowIndex}`}>
                {row.map((key) => {
                  const meta = KEY_FINGERS[key.code] ? FINGERS[KEY_FINGERS[key.code]] : null
                  const display = keyLabel(key, layout)
                  const isSelected = key.code === selectedCode
                  const isPeer = fingerId && KEY_FINGERS[key.code] === fingerId && !isSelected
                  const classes = [
                    'key',
                    'guide-key',
                    key.modifier ? 'key--modifier' : '',
                    isSelected ? 'is-selected' : '',
                    isPeer ? 'is-peer' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <button
                      key={key.code}
                      type="button"
                      className={classes}
                      style={{
                        flexGrow: key.width || 1,
                        flexBasis: 0,
                        '--key-finger': meta?.color || 'var(--border-strong)',
                      }}
                      onClick={() => setSelectedCode(key.code)}
                      aria-pressed={isSelected}
                      aria-label={`${display || key.code} key${
                        meta ? `, ${meta.label.toLowerCase()}` : ''
                      }`}
                    >
                      <span>{display}</span>
                      {meta && !key.modifier && <span className="key__finger" />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          <p className="guide-explorer__hint small muted">
            <CornerDownLeft size={13} /> Use Tab and Enter to explore the keyboard without a mouse.
          </p>
        </div>

        <aside className="guide-detail" aria-live="polite">
          <div className="guide-detail__head">
            <span
              className="guide-detail__keycap"
              style={{ '--key-finger': finger?.color || 'var(--primary)' }}
            >
              {label || selectedCode}
            </span>
            <div>
              <span className="guide-detail__eyebrow">
                {isHome ? 'Home-row anchor' : finger ? 'Key owner' : 'Keyboard key'}
              </span>
              <h3>{finger ? finger.label : 'Modifier'}</h3>
              <p className="small muted">
                {rowName}
                {isHome ? ' · return here after every reach' : ''}
              </p>
            </div>
          </div>

          <HandGuide activeFinger={finger?.id} />

          <p className="guide-detail__tip">{finger?.tip || 'Use this key to move around the interface.'}</p>

          <div className="guide-detail__chips">
            <span className="chip">
              <span className="finger-chip__dot" style={{ background: finger?.color }} />
              {finger ? finger.label : 'Modifier'}
            </span>
            <span className="chip">{rowName}</span>
            {shifted && (
              <span className="chip chip--primary">
                Shift + {label} = {shifted}
              </span>
            )}
          </div>

          {finger && (
            <div>
              <span className="guide-detail__label">Keys owned by this finger</span>
              <div className="guide-detail__keys">
                {fingerKeys.map((char, index) => (
                  <span key={`${char}-${index}`} className="guide-key-chip">
                    {char === ' ' ? 'space' : char}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="guide-detail__actions">
            {lesson ? (
              <Link to={`/lessons/${lesson.id}`} className="btn btn--primary btn--sm">
                Practice in “{lesson.title}” <ArrowRight size={14} />
              </Link>
            ) : (
              <Link to="/practice" className="btn btn--primary btn--sm">
                Open the practice room <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default KeyboardExplorer
