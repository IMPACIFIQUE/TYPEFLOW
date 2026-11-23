import { FINGERS } from '../../utils/fingerMapping'

function fingerColor(name) {
  return FINGERS[name]?.color || 'var(--muted)'
}

/**
 * Stylised two-hand diagram. The finger responsible for the next keystroke is
 * lifted and coloured, so learners can see the movement rather than memorise it.
 */
function HandGuide({ activeFinger = null, className = '' }) {
  const leftFingers = ['pinky', 'ring', 'middle', 'index', 'thumb']
  const rightFingers = ['thumb', 'index', 'middle', 'ring', 'pinky']

  const renderFinger = (hand, name) => {
    const id = name === 'thumb' ? 'thumb' : `${hand}-${name}`
    const isActive = activeFinger === id
    return (
      <div
        key={`${hand}-${name}`}
        className={`hand-guide__finger ${isActive ? 'is-active' : ''}`}
        data-finger={name}
        style={{ '--finger-color': fingerColor(id) }}
      />
    )
  }

  return (
    <div className={`hand-guide ${className}`} aria-hidden="true">
      <div className="hand-guide__side">
        <div className="hand-guide__hand">
          {leftFingers.map((name) => renderFinger('left', name))}
        </div>
        <div className="hand-guide__palm" />
        <span className="hand-guide__label">Left</span>
      </div>

      <div className="hand-guide__side">
        <div className="hand-guide__hand">
          {rightFingers.map((name) => renderFinger('right', name))}
        </div>
        <div className="hand-guide__palm" />
        <span className="hand-guide__label">Right</span>
      </div>
    </div>
  )
}

export default HandGuide
