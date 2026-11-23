import { Check } from 'lucide-react'

/** Container for the option toolbar above a typing surface. */
export function TypingControls({ children, className = '' }) {
  return <div className={`typing-controls ${className}`}>{children}</div>
}

/** Segmented single-choice control (time limit, word count, mode...). */
export function Segmented({ options = [], value, onChange, ariaLabel = 'Options' }) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const optionValue = typeof option === 'object' ? option.value : option
        const optionLabel = typeof option === 'object' ? option.label : option
        return (
          <button
            key={optionValue}
            type="button"
            className={`segmented__btn ${value === optionValue ? 'active' : ''}`}
            onClick={() => onChange(optionValue)}
            aria-pressed={value === optionValue}
          >
            {optionLabel}
          </button>
        )
      })}
    </div>
  )
}

/** Boolean pill toggle (punctuation, numbers, blind mode...). */
export function OptionToggle({ active = false, onClick, children, title }) {
  return (
    <button
      type="button"
      className={`option-toggle ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      title={title}
    >
      {active && <Check size={12} />}
      {children}
    </button>
  )
}

export default TypingControls
