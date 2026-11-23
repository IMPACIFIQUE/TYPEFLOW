import { useId, useMemo } from 'react'

function buildPath(points, width, height, padding = 8) {
  if (!points.length) return ''
  const maxY = Math.max(10, ...points.map((p) => p.y))
  return points
    .map((point, index) => {
      const x = padding + (point.x / Math.max(1, width - padding * 2)) * (width - padding * 2)
      const y = height - padding - (point.y / maxY) * (height - padding * 2)
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function TypingChart({ samples = [], showRaw = false, live = false, className = '' }) {
  const reactId = useId()
  const gradientId = `chart-grad-${reactId.replace(/:/g, '')}`

  const data = useMemo(() => {
    return samples
      .map((sample) => ({
        t: Number(sample.t) || 0,
        wpm: Math.max(0, Number(sample.wpm) || 0),
        raw: Math.max(0, Number(sample.raw) || 0),
      }))
      .sort((a, b) => a.t - b.t)
  }, [samples])

  if (data.length < 2) {
    return (
      <div className={`chart-empty ${className}`} style={live ? { minHeight: 70 } : undefined}>
        {live ? 'WPM chart appears after a few seconds' : 'Not enough samples for a chart'}
      </div>
    )
  }

  const width = 600
  const height = live ? 74 : 140
  const maxT = Math.max(1, data[data.length - 1].t)
  const maxWpm = Math.max(
    20,
    Math.ceil(Math.max(...data.map((d) => Math.max(d.wpm, showRaw ? d.raw : 0))) / 20) * 20
  )

  const wpmPoints = data.map((d) => ({ x: (d.t / maxT) * width, y: d.wpm }))
  const rawPoints = data.map((d) => ({ x: (d.t / maxT) * width, y: d.raw }))
  const wpmPath = buildPath(wpmPoints, width, height)
  const areaPath = `${wpmPath} L${width - 8} ${height - 8} L8 ${height - 8} Z`
  const gridValues = live ? [] : [0.25, 0.5, 0.75, 1]

  return (
    <div className={`chart-frame ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Words per minute over time"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridValues.map((ratio) => (
          <line
            key={ratio}
            x1="0"
            x2={width}
            y1={height - 8 - ratio * (height - 16)}
            y2={height - 8 - ratio * (height - 16)}
            className="chart-grid-line"
          />
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={wpmPath} className="chart-line-primary" />
        {showRaw && data.length > 1 && (
          <path d={buildPath(rawPoints, width, height)} className="chart-line-secondary" />
        )}

        {!live && (
          <>
            <text x="4" y="12" className="chart-axis-label">
              {maxWpm}
            </text>
            <text x="4" y={height - 12} className="chart-axis-label">
              0
            </text>
            <text x={width - 34} y={height - 12} className="chart-axis-label">
              {Math.round(maxT)}s
            </text>
          </>
        )}
      </svg>
    </div>
  )
}

export default TypingChart
