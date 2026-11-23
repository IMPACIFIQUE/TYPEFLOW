import { FINGER_LIST, getFingerMeta } from '../../utils/fingerMapping'
import { getKeyForChar } from '../../utils/keyboardLayouts'

/**
 * Colour-coded legend showing which finger owns which keys. The active finger
 * for the next character is highlighted.
 */
function FingerGuide({ activeFinger = null, nextChar = null, layout = 'qwerty', className = '' }) {
  const nextKey = nextChar ? getKeyForChar(nextChar, layout) : null
  const meta = activeFinger ? getFingerMeta(activeFinger) : null

  return (
    <div className={className}>
      <div className="finger-guide">
        {FINGER_LIST.map((finger) => {
          const isActive = finger.id === activeFinger
          return (
            <span
              key={finger.id}
              className={`finger-chip ${isActive ? 'finger-chip--active' : ''}`}
              style={{ '--finger-color': finger.color }}
            >
              <span className="finger-chip__dot" />
              {finger.label}
            </span>
          )
        })}
      </div>

      {meta && nextKey && (
        <p className="finger-tip" style={{ marginTop: '0.6rem' }}>
          Use your <strong style={{ color: meta.color }}>{meta.label.toLowerCase()}</strong> for
          <span className="finger-tip__key" style={{ marginLeft: '0.4rem' }}>
            {nextChar === ' ' ? 'space' : nextChar}
          </span>
        </p>
      )}
    </div>
  )
}

export default FingerGuide
