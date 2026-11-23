/**
 * Linear progress bar used for lessons, achievements and daily goals.
 */
function ProgressBar({
  value = 0,
  max = 100,
  variant = '',
  label,
  showValue = false,
  className = '',
}) {
  const safeMax = max > 0 ? max : 100
  const percent = Math.max(0, Math.min(100, (Number(value) || 0) / safeMax * 100))

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="unit__progress-label">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(percent)}%</span>}
        </div>
      )}
      <div
        className={`progress ${variant ? `progress--${variant}` : ''}`}
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div className="progress__bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
