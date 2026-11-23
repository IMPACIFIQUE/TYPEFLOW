const defaultStats = {
  wpm: 0,
  accuracy: 100,
  correctChars: 0,
  incorrectChars: 0,
  totalChars: 0,
  errors: 0,
}

/**
 * Live metrics strip below the typing surface.
 */
function TypingStats({
  wpm = defaultStats.wpm,
  accuracy = defaultStats.accuracy,
  correctChars = defaultStats.correctChars,
  incorrectChars = defaultStats.incorrectChars,
  totalChars = defaultStats.totalChars,
  errors = defaultStats.errors,
  consistency = null,
  compact = false,
}) {
  const stats = [
    { label: 'WPM', value: Math.round(wpm), title: 'Words per minute' },
    { label: 'Accuracy', value: `${Math.round(accuracy)}%`, title: 'Correct keystrokes' },
    ...(consistency !== null
      ? [{ label: 'Consistency', value: `${Math.round(consistency)}%`, title: 'Rhythm stability' }]
      : []),
    { label: 'Correct', value: correctChars, title: 'Correct characters on screen' },
    ...(!compact
      ? [
          { label: 'Incorrect', value: incorrectChars, title: 'Incorrect characters on screen' },
          { label: 'Errors', value: errors, title: 'Total wrong keystrokes' },
        ]
      : []),
    { label: 'Typed', value: totalChars, title: 'Total characters typed' },
  ]

  return (
    <section className="typing-stats" aria-label="Typing statistics">
      {stats.map(({ label, value, title }) => (
        <div key={label} className="typing-stats__item" title={title}>
          <span className="typing-stats__value">{value}</span>
          <span className="typing-stats__label">{label}</span>
        </div>
      ))}
    </section>
  )
}

export default TypingStats
