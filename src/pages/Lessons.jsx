import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronRight,
  Compass,
  Eye,
  Search,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import {
  LEVEL_META,
  TOTAL_LESSONS,
  getLessonProgress,
  getOverallLessonProgress,
  getRecommendedLesson,
  getUnitProgress,
  lessonUnits,
} from '../services/lessonService'
import { Segmented } from '../components/typing/TypingControls'
import ProgressBar from '../components/common/ProgressBar'
import Modal from '../components/common/Modal'
import LearnShell from '../components/learn/LearnShell'

const LEVEL_FILTERS = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

function Stars({ count = 0, size = 12 }) {
  return (
    <span className="lesson-card__stars" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((index) => (
        <Star
          key={index}
          size={size}
          fill={index < count ? 'currentColor' : 'none'}
          style={{ opacity: index < count ? 1 : 0.3 }}
        />
      ))}
    </span>
  )
}

function Lessons() {
  const { progress } = useProgress()
  const [level, setLevel] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState(null)

  const searchRef = useRef(null)
  const unitsRef = useRef(null)

  const overall = useMemo(() => getOverallLessonProgress(progress), [progress])
  const recommended = useMemo(() => getRecommendedLesson(progress), [progress])
  const recommendedProgress = recommended ? getLessonProgress(progress, recommended.id) : null

  const filteredUnits = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return lessonUnits
      .filter((unit) => unitFilter === 'all' || unit.id === unitFilter)
      .map((unit) => {
        const lessons = unit.lessons.filter((lesson) => {
          const matchesLevel = level === 'all' || lesson.level === level
          if (!matchesLevel) return false
          if (!needle) return true
          return (
            lesson.title.toLowerCase().includes(needle) ||
            lesson.description.toLowerCase().includes(needle) ||
            lesson.keys.join(' ').toLowerCase().includes(needle)
          )
        })
        return { unit, lessons }
      })
      .filter(({ lessons }) => lessons.length > 0)
  }, [level, query, unitFilter])

  const totalShown = filteredUnits.reduce((sum, entry) => sum + entry.lessons.length, 0)

  // "/" and Ctrl/Cmd+K jump to the lesson search from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target
      const tag = target?.tagName?.toLowerCase()
      const isTyping =
        tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable
      const isShortcut =
        (event.key === '/' && !isTyping) ||
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')
      if (isShortcut) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const selectUnit = (id) => {
    setUnitFilter(id)
    if (id === 'all') return
    window.requestAnimationFrame(() => {
      unitsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const resetFilters = () => {
    setQuery('')
    setLevel('all')
    setUnitFilter('all')
  }

  return (
    <LearnShell
      breadcrumb={
        <>
          <span>Learn</span>
          <ChevronRight size={12} />
          <span className="current">All lessons</span>
        </>
      }
      actions={
        <>
          <span className="chip">
            <Trophy size={12} /> {overall.stars}/{overall.maxStars}
          </span>
          <Link to="/guide" className="btn btn--outline btn--sm">
            <Compass size={14} /> Guide
          </Link>
          <Link to={`/lessons/${recommended.id}`} className="btn btn--primary btn--sm">
            {recommendedProgress?.completed ? 'Practice next' : 'Continue'}
            <ArrowRight size={14} />
          </Link>
        </>
      }
    >
      <div className="learn-page">
        <div className="learn-hero">
          <div>
            <span className="eyebrow">Structured curriculum</span>
            <h1>All lessons</h1>
            <p>
              {TOTAL_LESSONS} guided lessons across six units. Start at the home row and build up
              to punctuation, numbers, code and full paragraphs.
            </p>
          </div>

          <div className="learn-hero__stats">
            <div>
              <span>Complete</span>
              <strong>
                {overall.completed}/{overall.total}
              </strong>
            </div>
            <div>
              <span>Stars</span>
              <strong>{overall.stars}</strong>
            </div>
            <div>
              <span>Progress</span>
              <strong>{overall.percent}%</strong>
            </div>
          </div>
        </div>

        <div className="card card--pad learn-progress">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div className="unit__progress-label">
                <span>
                  <strong style={{ color: 'var(--text)' }}>{overall.completed}</strong> of{' '}
                  {overall.total} lessons complete
                </span>
                <span>{overall.percent}%</span>
              </div>
              <ProgressBar value={overall.percent} />
            </div>
            <span className="chip">
              <Compass size={13} /> Next: {recommended.title}
            </span>
          </div>
        </div>

        <div className="unit-nav" role="group" aria-label="Browse curriculum units">
          <button
            type="button"
            className={`unit-pill ${unitFilter === 'all' ? 'active' : ''}`}
            onClick={() => selectUnit('all')}
            aria-pressed={unitFilter === 'all'}
          >
            <span className="unit-pill__num">All</span>
            <span className="unit-pill__label">All units</span>
            <span className="unit-pill__meta">
              {overall.completed}/{overall.total}
            </span>
          </button>
          {lessonUnits.map((unit) => {
            const unitProgress = getUnitProgress(progress, unit)
            return (
              <button
                key={unit.id}
                type="button"
                className={`unit-pill ${unitFilter === unit.id ? 'active' : ''}`}
                onClick={() => selectUnit(unit.id)}
                aria-pressed={unitFilter === unit.id}
              >
                <span className="unit-pill__num">{unit.number}</span>
                <span className="unit-pill__label">{unit.title}</span>
                <span className="unit-pill__meta">
                  {unitProgress.completed}/{unitProgress.total}
                </span>
              </button>
            )
          })}
        </div>

        <div className="practice-toolbar lesson-toolbar">
          <Segmented
            options={LEVEL_FILTERS}
            value={level}
            onChange={setLevel}
            ariaLabel="Filter by level"
          />
          <div className="input-with-icon lesson-search">
            <Search size={16} />
            <input
              ref={searchRef}
              className="input"
              type="search"
              placeholder="Search lessons or keys..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search lessons"
            />
            <span className="lesson-search__hint" aria-hidden="true">
              /
            </span>
          </div>
          <span className="chip lesson-toolbar__count">
            {totalShown} of {TOTAL_LESSONS} lessons
          </span>
        </div>

        {totalShown === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">
              <Search size={24} />
            </span>
            <h3>No lessons match that search</h3>
            <p>Try a different key, level or clear the filters to see the full curriculum.</p>
            <button type="button" className="btn btn--outline" onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="units" ref={unitsRef}>
            {filteredUnits.map(({ unit, lessons }) => {
              const unitProgress = getUnitProgress(progress, unit)
              return (
                <section className="unit" key={unit.id} aria-labelledby={`unit-${unit.id}`}>
                  <div className="unit__head">
                    <div className="unit__heading">
                      <span className="unit__badge">{unit.number}</span>
                      <div>
                        <h2 className="unit__title" id={`unit-${unit.id}`}>
                          {unit.title}
                        </h2>
                        <p className="unit__desc">{unit.description}</p>
                      </div>
                    </div>

                    <div className="unit__progress">
                      <div className="unit__progress-label">
                        <span>
                          {unitProgress.completed}/{unitProgress.total} complete
                        </span>
                        <span>{unitProgress.stars} stars</span>
                      </div>
                      <ProgressBar value={unitProgress.percent} />
                    </div>
                  </div>

                  <div className="lesson-grid">
                    {lessons.map((lesson) => {
                      const index = unit.lessons.findIndex((item) => item.id === lesson.id)
                      const entry = getLessonProgress(progress, lesson.id)
                      const meta = LEVEL_META[lesson.level] || LEVEL_META.beginner
                      const isNext = !entry?.completed && lesson.id === recommended.id
                      return (
                        <article
                          key={lesson.id}
                          className={`lesson-card card card--hover ${
                            entry?.completed ? 'lesson-card--done' : ''
                          } ${isNext ? 'lesson-card--next' : ''}`}
                        >
                          <button
                            type="button"
                            className="lesson-card__open"
                            onClick={() => setPreview({ lesson, unit })}
                            aria-label={`Open the overview for ${lesson.title}`}
                          />

                          <div className="lesson-card__top">
                            <span className="lesson-card__num">{index + 1}</span>
                            <span className="lesson-card__badges">
                              {isNext && (
                                <span className="chip chip--primary">
                                  <Sparkles size={11} /> Next up
                                </span>
                              )}
                              <span className={`chip chip--${meta.tone}`}>{meta.label}</span>
                            </span>
                          </div>

                          <h3 className="lesson-card__title">{lesson.title}</h3>
                          <p className="lesson-card__desc">{lesson.description}</p>

                          <div className="lesson-card__keys">
                            {lesson.keys.slice(0, 5).map((key) => (
                              <span key={key} className="lesson-card__keystroke">
                                {key === ' ' ? 'space' : key}
                              </span>
                            ))}
                            {lesson.keys.length > 5 && (
                              <span className="lesson-card__keystroke">
                                +{lesson.keys.length - 5}
                              </span>
                            )}
                          </div>

                          <div className="lesson-card__meta">
                            <span className="chip">{lesson.exercises.length} drills</span>
                            <span className="chip">Target {lesson.targetWpm} WPM</span>
                            {entry?.bestWpm ? (
                              <span className="chip chip--success">
                                Best {Math.round(entry.bestWpm)} WPM
                              </span>
                            ) : null}
                          </div>

                          <div className="lesson-card__foot">
                            <Stars count={entry?.stars || 0} />
                            <span className="lesson-card__cta" aria-hidden="true">
                              <Eye size={13} /> Overview
                            </span>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        wide
        title={preview?.lesson.title}
        subtitle={`Unit ${preview?.unit.number} · ${preview?.unit.title}`}
        footer={
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setPreview(null)}>
              Close
            </button>
            <Link
              to={`/lessons/${preview?.lesson.id}`}
              className="btn btn--primary"
              onClick={() => setPreview(null)}
            >
              Start lesson <ArrowRight size={16} />
            </Link>
          </>
        }
      >
        {preview && (
          <div className="preview">
            <div className="row" style={{ gap: '0.4rem' }}>
              <span
                className={`chip chip--${
                  (LEVEL_META[preview.lesson.level] || LEVEL_META.beginner).tone
                }`}
              >
                {(LEVEL_META[preview.lesson.level] || LEVEL_META.beginner).label}
              </span>
              <span className="chip">{preview.lesson.exercises.length} drills</span>
              <span className="chip">Target {preview.lesson.targetWpm} WPM</span>
              {getLessonProgress(progress, preview.lesson.id)?.bestWpm ? (
                <span className="chip chip--success">
                  Best {Math.round(getLessonProgress(progress, preview.lesson.id).bestWpm)} WPM
                </span>
              ) : (
                <span className="chip">No attempts yet</span>
              )}
            </div>

            <p className="preview__desc">{preview.lesson.description}</p>

            <div className="preview__keys">
              {preview.lesson.keys.map((key) => (
                <span key={key} className="lesson-card__keystroke">
                  {key === ' ' ? 'space' : key}
                </span>
              ))}
            </div>

            <div className="preview__tip">
              <strong>Coach tip</strong>
              <p>{preview.lesson.tip}</p>
            </div>

            <ol className="preview__list">
              {preview.lesson.exercises.map((exercise, index) => (
                <li key={exercise.title} className="preview-drill">
                  <span className="preview-drill__num">{index + 1}</span>
                  <div className="preview-drill__body">
                    <div className="preview-drill__head">
                      <strong>{exercise.title}</strong>
                      <span className="small muted">
                        {exercise.text.split(' ').length} words
                      </span>
                    </div>
                    <p className="preview-drill__text">{exercise.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Modal>
    </LearnShell>
  )
}

export default Lessons
