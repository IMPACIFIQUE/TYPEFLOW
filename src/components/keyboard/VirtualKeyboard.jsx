import { Fingerprint } from 'lucide-react'
import { KEYBOARD_ROWS, KEY_FINGERS, getKeyForChar, getLayoutLabel } from '../../utils/keyboardLayouts'
import KeyboardKey from './KeyboardKey'

/**
 * Renders the physical keyboard and highlights the next key to press.
 * Physical key positions stay fixed across QWERTY / Dvorak / Colemak.
 */
function VirtualKeyboard({
  layout = 'qwerty',
  nextChar = null,
  errorKey = null,
  pressed = new Set(),
  showFingers = true,
  showHint = true,
  className = '',
}) {
  const nextKey = nextChar ? getKeyForChar(nextChar, layout) : null
  const errorKeyInfo = errorKey ? getKeyForChar(errorKey, layout) : null

  // Hold Shift with the hand opposite to the letter being typed.
  let shiftCode = null
  if (nextKey?.shift) {
    const finger = KEY_FINGERS[nextKey.code] || ''
    shiftCode = finger.startsWith('left') ? 'ShiftRight' : 'ShiftLeft'
  }

  return (
    <div className={`keyboard-wrap ${className}`}>
      <div className="keyboard" aria-hidden="true">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div className="keyboard__row" key={`row-${rowIndex}`}>
            {row.map((key) => (
              <KeyboardKey
                key={key.code}
                code={key.code}
                label={key.label || ''}
                width={key.width || 1}
                modifier={Boolean(key.modifier)}
                layoutLabel={key.modifier ? key.label : getLayoutLabel(key.code, layout)}
                pressed={pressed.has(key.code)}
                isNext={nextKey?.code === key.code}
                needsShift={shiftCode === key.code}
                isError={errorKeyInfo?.code === key.code}
                showFingers={showFingers}
              />
            ))}
          </div>
        ))}
      </div>

      {showHint && (
        <div className="finger-tip">
          {nextKey ? (
            <>
              <Fingerprint size={14} />
              <span>
                Next key <span className="finger-tip__key">{nextChar === ' ' ? 'space' : nextChar}</span>
                {nextKey.shift ? ' with Shift' : ''}
              </span>
            </>
          ) : (
            <span>Keyboard idle — start typing to see the next key.</span>
          )}
        </div>
      )}
    </div>
  )
}

export default VirtualKeyboard
