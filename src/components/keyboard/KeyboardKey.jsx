import { HOME_KEYS, KEY_FINGERS } from '../../utils/keyboardLayouts'
import { FINGERS } from '../../utils/fingerMapping'

function displayLabel(code, layoutLabel, modifier) {
  if (modifier) return layoutLabel
  if (!layoutLabel) return ''
  if (layoutLabel.length === 1 && /[a-z]/.test(layoutLabel)) return layoutLabel.toUpperCase()
  return layoutLabel
}

function KeyboardKey({
  code,
  label = '',
  width = 1,
  modifier = false,
  layoutLabel = '',
  pressed = false,
  isNext = false,
  needsShift = false,
  isError = false,
  showFingers = true,
}) {
  const finger = KEY_FINGERS[code]
  const fingerMeta = finger ? FINGERS[finger] : null
  const isHome = HOME_KEYS.has(code) && (code === 'KeyF' || code === 'KeyJ')

  const classes = [
    'key',
    modifier ? 'key--modifier' : '',
    isHome ? 'key--home' : '',
    finger ? `key--finger-${finger.replace('left-', '').replace('right-', '')}` : '',
    pressed ? 'key--pressed' : '',
    isNext || needsShift ? 'key--next' : '',
    isError ? 'key--error' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      style={{
        flexGrow: width,
        flexBasis: 0,
        ...(fingerMeta ? { '--key-finger': fingerMeta.color } : {}),
      }}
      title={fingerMeta ? `${fingerMeta.label} key` : undefined}
      aria-hidden="true"
    >
      <span>{label || displayLabel(code, layoutLabel, modifier)}</span>
      {showFingers && fingerMeta && !modifier && <span className="key__finger" />}
    </div>
  )
}

export default KeyboardKey
