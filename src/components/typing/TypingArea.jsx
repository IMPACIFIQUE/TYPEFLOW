import { useEffect, useRef, useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

/**
 * The typing surface. Renders every character with a state class and captures
 * keystrokes through a transparent input (which also keeps mobile keyboards
 * working). Tab can restart the current run.
 */
function TypingArea({
  text,
  engine,
  autoFocus = true,
  onRestart = null,
  blindMode = false,
  showOverlay = true,
  readOnly = false,
  animateCaret = false,
  className = '',
}) {
  const { settings } = useSettings()
  const inputRef = useRef(null)
  const lastKeyTimeRef = useRef(0)
  const [focused, setFocused] = useState(Boolean(autoFocus))

  const typed = engine.typed
  const typedLength = typed.length
  const finished = engine.isFinished

  useEffect(() => {
    if (readOnly || !autoFocus) return undefined
    const timer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
      setFocused(true)
    }, 120)
    return () => window.clearTimeout(timer)
  }, [autoFocus, readOnly, text])

  const focusInput = () => {
    if (readOnly) return
    inputRef.current?.focus({ preventScroll: true })
    setFocused(true)
  }

  const handleKeyDown = (event) => {
    lastKeyTimeRef.current = Date.now()

    if (event.key === 'Tab' && onRestart) {
      event.preventDefault()
      onRestart()
      focusInput()
      return
    }

    engine.handleKeyDown(event)
  }

  // Mobile fallback: virtual keyboards that do not emit usable keydown events.
  const handleChange = (event) => {
    if (Date.now() - lastKeyTimeRef.current < 60) {
      event.target.value = ''
      return
    }
    const value = event.target.value
    const key = value.slice(-1)
    if (key) engine.typeKey(key)
    event.target.value = ''
  }

  const renderChar = (char, index) => {
    const isTyped = index < typedLength
    const isCurrent = index === typedLength && !finished && (!readOnly || animateCaret)
    const isCorrect = isTyped && text[index] === typed[index]
    const isIncorrect = isTyped && !isCorrect
    const isLast = index === text.length - 1

    const classes = ['char']
    if (isTyped) classes.push(isCorrect ? 'char--correct' : 'char--incorrect')
    if (isIncorrect && blindMode) classes.push('char--blind')
    if (!isTyped) classes.push('char--pending')
    if (isCurrent) classes.push('char--current')
    if (char === ' ') classes.push('char--space')
    if (isLast && finished) classes.push('char--end')

    return (
      <span key={index} className={classes.join(' ')}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    )
  }

  const words = text.split(' ')
  let cursor = 0

  return (
    <div
      className={`typing-shell ${readOnly ? 'typing-shell--static' : ''} ${className}`}
      aria-label={readOnly ? 'Static typing preview' : undefined}
    >
      <div
        className={`typing-text ${focused || readOnly ? '' : 'typing-text--blurred'} ${
          settings.smoothCaret ? 'typing-text--smooth' : ''
        }`}
        data-caret={settings.caret}
        aria-hidden="true"
      >
        {words.map((word, wordIndex) => {
          const start = cursor
          cursor += word.length + 1
          return (
            <span className="word" key={`word-${wordIndex}`}>
              {word.split('').map((char, charIndex) => renderChar(char, start + charIndex))}
              {wordIndex < words.length - 1 && renderChar(' ', start + word.length)}
            </span>
          )
        })}
      </div>

      {!readOnly && (
        <input
          ref={inputRef}
          className="typing-capture"
          type="text"
          value=""
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Typing input"
          inputMode="text"
        />
      )}

      {!readOnly && showOverlay && !focused && !finished && (
        <div className="typing-overlay" onClick={focusInput} role="presentation">
          <div className="typing-overlay__inner">
            <MousePointerClick size={20} />
            <strong>Click to focus</strong>
            <span>Your timer starts with the first keystroke.</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TypingArea
