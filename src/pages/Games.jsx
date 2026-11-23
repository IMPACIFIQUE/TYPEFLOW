import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CloudRain,
  Crosshair,
  Gamepad2,
  Heart,
  Info,
  Keyboard,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../hooks/useSound'
import { COMMON_WORDS } from '../data/passages'

const GAME_WORDS = [...new Set(COMMON_WORDS.filter((word) => word.length >= 3 && word.length <= 7))]
const STARTING_LIVES = 3
const TICK_MS = 80

function spawnWord(elapsed) {
  const word = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)]
  return {
    id: `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    text: word,
    x: 12 + Math.random() * 76,
    y: -4,
    speed: 8 + Math.random() * 4 + Math.min(8, elapsed * 0.06),
  }
}

function Games() {
  const { stats, addSession } = useProgress()
  const { playKey, playError, playFinish } = useSound()

  const [status, setStatus] = useState('idle')
  const [words, setWords] = useState([])
  const [buffer, setBuffer] = useState('')
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [lives, setLives] = useState(STARTING_LIVES)
  const [elapsed, setElapsed] = useState(0)
  const [cleared, setCleared] = useState(0)
  const [flash, setFlash] = useState(false)
  const [summary, setSummary] = useState(null)
  const [newAchievements, setNewAchievements] = useState([])

  const wordsRef = useRef([])
  const bufferRef = useRef('')
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const livesRef = useRef(STARTING_LIVES)
  const elapsedRef = useRef(0)
  const clearedRef = useRef(0)
  const missedRef = useRef(0)
  const keystrokesRef = useRef(0)
  const errorsRef = useRef(0)
  const tickRef = useRef(0)
  const recordedRef = useRef(false)
  const flashTimerRef = useRef(null)

  const setWordList = useCallback((next) => {
    wordsRef.current = next
    setWords(next)
  }, [])

  useEffect(() => () => window.clearTimeout(flashTimerRef.current), [])

  const resetStats = useCallback(() => {
    wordsRef.current = []
    bufferRef.current = ''
    scoreRef.current = 0
    comboRef.current = 0
    livesRef.current = STARTING_LIVES
    elapsedRef.current = 0
    clearedRef.current = 0
    missedRef.current = 0
    keystrokesRef.current = 0
    errorsRef.current = 0
    tickRef.current = 0
    recordedRef.current = false

    setWords([])
    setBuffer('')
    setScore(0)
    setCombo(0)
    setLives(STARTING_LIVES)
    setElapsed(0)
    setCleared(0)
    setFlash(false)
    setSummary(null)
    setNewAchievements([])
  }, [])

  const startGame = () => {
    resetStats()
    setStatus('playing')
  }

  // Main falling-word loop.
  useEffect(() => {
    if (status !== 'playing') return undefined

    const interval = window.setInterval(() => {
      tickRef.current += 1
      elapsedRef.current += TICK_MS / 1000
      const now = elapsedRef.current
      setElapsed(now)

      const speedBoost = 1 + now / 110
      let next = wordsRef.current.map((word) => ({
        ...word,
        y: word.y + word.speed * (TICK_MS / 1000) * speedBoost,
      }))

      const lost = next.filter((word) => word.y >= 98)
      if (lost.length > 0) {
        next = next.filter((word) => word.y < 98)
        missedRef.current += lost.length
        comboRef.current = 0
        setCombo(0)
        livesRef.current = Math.max(0, livesRef.current - lost.length)
        setLives(livesRef.current)
        playError()

        if (livesRef.current <= 0) {
          setWordList(next)
          setStatus('over')
          return
        }
      }

      const spawnEvery = Math.max(5, 14 - Math.floor(now / 12))
      if (tickRef.current % spawnEvery === 0) {
        next = [...next, spawnWord(now)]
      }

      setWordList(next)
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [status, playError, setWordList])

  const handleChar = useCallback(
    (char) => {
      if (status !== 'playing') return
      keystrokesRef.current += 1

      const nextBuffer = bufferRef.current + char
      const matches = wordsRef.current.filter((word) => word.text.startsWith(nextBuffer))

      if (matches.length === 0) {
        errorsRef.current += 1
        bufferRef.current = ''
        setBuffer('')
        setFlash(true)
        window.clearTimeout(flashTimerRef.current)
        flashTimerRef.current = window.setTimeout(() => setFlash(false), 180)
        playError()
        return
      }

      playKey()

      const exact = matches.find((word) => word.text === nextBuffer)
      if (!exact) {
        bufferRef.current = nextBuffer
        setBuffer(nextBuffer)
        return
      }

      const target = matches
        .filter((word) => word.text === nextBuffer)
        .reduce((lowest, word) => (word.y > lowest.y ? word : lowest))

      setWordList(wordsRef.current.filter((word) => word.id !== target.id))

      const gained = target.text.length * 10 + comboRef.current * 3
      scoreRef.current += gained
      setScore(scoreRef.current)

      comboRef.current += 1
      setCombo(comboRef.current)
      clearedRef.current += target.text.length
      setCleared(clearedRef.current)
      bufferRef.current = ''
      setBuffer('')
    },
    [status, playKey, playError, setWordList]
  )

  useEffect(() => {
    if (status !== 'playing') return undefined

    const onKeyDown = (event) => {
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (event.key === 'Backspace') {
        event.preventDefault()
        bufferRef.current = bufferRef.current.slice(0, -1)
        setBuffer(bufferRef.current)
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        setStatus('over')
        return
      }

      if (!/^[a-zA-Z]$/.test(event.key)) return
      event.preventDefault()
      handleChar(event.key.toLowerCase())
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [status, handleChar])

  // Persist exactly one game session when the run ends.
  useEffect(() => {
    if (status !== 'over' || recordedRef.current) return
    recordedRef.current = true
    playFinish()

    const duration = Math.max(1, elapsedRef.current)
    const keystrokes = keystrokesRef.current
    const errors = errorsRef.current
    const accuracy = keystrokes > 0 ? Math.max(0, ((keystrokes - errors) / keystrokes) * 100) : 0
    const wpm = (clearedRef.current / 5) / (duration / 60)
    const isBest = scoreRef.current > (stats.bestGameScore || 0)

    setSummary({
      score: scoreRef.current,
      cleared: clearedRef.current,
      missed: missedRef.current,
      duration,
      wpm,
      accuracy,
      isBest,
    })

    if (keystrokes > 0) {
      const saved = addSession({
        type: 'game',
        mode: 'word-rain',
        label: 'Word Rain',
        score: scoreRef.current,
        duration,
        wpm,
        rawWpm: wpm,
        accuracy,
        chars: clearedRef.current,
        errors,
        keystrokes,
        completed: true,
        game: 'word-rain',
      })
      setNewAchievements(saved?.newAchievements || [])
    }
  }, [status, addSession, stats.bestGameScore, playFinish])

  const level = 1 + Math.floor(elapsed / 20)
  const targetMatches = useMemo(
    () => (buffer ? words.filter((word) => word.text.startsWith(buffer)).map((word) => word.id) : []),
    [buffer, words]
  )
  const targetSet = useMemo(() => new Set(targetMatches), [targetMatches])

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Gamepad2 size={14} /> Play to learn
            </span>
            <h1 className="page-head__title">Typing games</h1>
            <p className="page-head__subtitle">
              Word Rain turns your vocabulary into falling targets. Stay calm, lock onto a word,
              and clear it before it reaches the deck.
            </p>
          </div>
          <div className="row" style={{ gap: '0.45rem' }}>
            <span className="chip chip--warning">
              <Trophy size={13} /> Best score {stats.bestGameScore}
            </span>
            <span className="chip">
              <Gamepad2 size={13} /> {stats.totalGames} games played
            </span>
          </div>
        </div>

        <div className="game-hud">
          <div className="game-hud__group">
            <span className="game-hud__stat">
              <Trophy size={15} /> <b>{score}</b> score
            </span>
            <span className="game-hud__stat">
              <Zap size={15} /> <b>x{combo}</b> combo
            </span>
            <span className="game-hud__stat" aria-label={`${lives} lives left`}>
              <span className="game-lives">
                {Array.from({ length: STARTING_LIVES }).map((_, index) => (
                  <Heart
                    key={index}
                    size={16}
                    fill={index < lives ? 'currentColor' : 'none'}
                    style={{ opacity: index < lives ? 1 : 0.3 }}
                  />
                ))}
              </span>
              {lives} lives
            </span>
          </div>

          <div className="game-hud__group">
            <span className="game-hud__stat">
              <Timer size={15} /> <b>{Math.floor(elapsed)}</b>s
            </span>
            <span className="chip chip--primary">Level {level}</span>
            {status === 'playing' ? (
              <button type="button" className="btn btn--outline btn--sm" onClick={() => setStatus('over')}>
                End game
              </button>
            ) : (
              <button type="button" className="btn btn--primary btn--sm" onClick={startGame}>
                <Play size={14} /> {status === 'over' ? 'Play again' : 'Start game'}
              </button>
            )}
          </div>
        </div>

        <div className={`game-stage game-stage--rain ${flash ? 'is-error' : ''}`}>
          {words.map((word) => {
            const isTarget = buffer.length > 0 && targetSet.has(word.id)
            return (
              <div
                key={word.id}
                className={`falling-word ${isTarget ? 'is-target' : ''} ${word.y >= 80 ? 'is-danger' : ''}`}
                style={{ left: `${word.x}%`, top: `${word.y}%` }}
              >
                {isTarget ? (
                  <>
                    <span className="falling-word__typed">{word.text.slice(0, buffer.length)}</span>
                    {word.text.slice(buffer.length)}
                  </>
                ) : (
                  word.text
                )}
              </div>
            )
          })}

          {status === 'idle' && (
            <div className="game-over">
              <div className="game-over__card">
                <span className="eyebrow" style={{ justifyContent: 'center' }}>
                  <CloudRain size={14} /> Word Rain
                </span>
                <h2 style={{ marginTop: '0.4rem' }}>Catch the words before they land</h2>
                <p className="muted" style={{ maxWidth: '36ch', margin: '0.6rem auto 0' }}>
                  Type the first letter of a word to lock on, then finish it. Every word cleared
                  builds your combo. Miss three and the run ends.
                </p>
                <div className="row" style={{ justifyContent: 'center', marginTop: '1.2rem' }}>
                  <button type="button" className="btn btn--primary btn--lg" onClick={startGame}>
                    <Play size={18} /> Start Word Rain
                  </button>
                </div>
                <p className="small muted" style={{ marginTop: '0.8rem' }}>
                  <Keyboard size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> Tip:
                  Backspace clears the lock, Escape ends the run.
                </p>
              </div>
            </div>
          )}

          {status === 'over' && (
            <div className="game-over">
              <div className="game-over__card">
                <span className="eyebrow" style={{ justifyContent: 'center' }}>
                  <Trophy size={14} /> Run complete
                </span>
                <div className="game-over__score">{summary?.score ?? score}</div>
                <p className="muted">points</p>

                <div className="row" style={{ justifyContent: 'center', gap: '0.45rem', marginTop: '0.9rem' }}>
                  <span className="chip chip--primary">{summary?.cleared ?? cleared} chars cleared</span>
                  <span className="chip">{Math.round(summary?.wpm || 0)} WPM</span>
                  <span className="chip">{Math.round(summary?.accuracy || 0)}% accuracy</span>
                  {summary?.isBest && (
                    <span className="chip chip--warning">
                      <Sparkles size={13} /> New best
                    </span>
                  )}
                </div>

                {newAchievements.length > 0 && (
                  <div className="row" style={{ justifyContent: 'center', marginTop: '0.75rem', gap: '0.35rem' }}>
                    {newAchievements.map((achievement) => (
                      <span key={achievement.id} className="chip chip--success">
                        <Trophy size={12} /> {achievement.title}
                      </span>
                    ))}
                  </div>
                )}

                <div className="row" style={{ justifyContent: 'center', marginTop: '1.2rem' }}>
                  <button type="button" className="btn btn--primary btn--lg" onClick={startGame}>
                    <RotateCcw size={17} /> Play again
                  </button>
                  <Link to="/practice" className="btn btn--outline btn--lg">
                    Practice instead <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="row" style={{ marginTop: '0.85rem' }}>
          <div
            className="input game-input"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'default' }}
          >
            <span className="muted" style={{ fontFamily: 'var(--font-mono)' }}>
              &gt;
            </span>
            <strong className="mono" style={{ color: buffer ? 'var(--success)' : 'var(--faint)' }}>
              {buffer || (status === 'playing' ? 'type a word…' : 'waiting to start')}
            </strong>
          </div>
          <button type="button" className="btn btn--outline" onClick={startGame}>
            <RotateCcw size={15} /> Restart
          </button>
        </div>
        <p className="game-caption">
          Words accelerate over time. Longer words score more, and every cleared word raises your
          combo multiplier.
        </p>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: '2rem' }}>
          {[
            {
              icon: Target,
              title: 'Lock and clear',
              text: 'Start typing any word on screen. Matching words highlight and the typed prefix turns green.',
            },
            {
              icon: Zap,
              title: 'Build a combo',
              text: 'Chain clears without a miss. Each consecutive word adds a bigger multiplier to your score.',
            },
            {
              icon: Heart,
              title: 'Protect the deck',
              text: 'Every word that slips past costs one life. Three misses ends the run — accuracy is survival.',
            },
          ].map(({ icon: CardIcon, title, text }) => (
            <article key={title} className="card card--pad">
              <span className="icon-tile" style={{ marginBottom: '0.7rem' }}>
                <CardIcon size={20} />
              </span>
              <h3 style={{ fontSize: 'var(--text-base)' }}>{title}</h3>
              <p className="small muted" style={{ marginTop: '0.3rem' }}>{text}</p>
            </article>
          ))}
        </div>

        <div className="page-head" style={{ marginTop: '3rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="eyebrow">More ways to play</span>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginTop: '0.35rem' }}>
              Turn drills into games
            </h2>
          </div>
          <span className="chip">
            <Info size={13} /> All progress counts toward your stats
          </span>
        </div>

        <div className="game-grid">
          <article className="game-card card card--hover">
            <div className="game-card__art game-card__art--rain">
              <span className="game-card__glyph">
                <CloudRain size={30} />
              </span>
            </div>
            <div className="game-card__body">
              <h3>Word Rain</h3>
              <p>Catch falling words, build combos and survive the downpour.</p>
              <div className="game-card__meta">
                <span className="chip chip--success">Playable</span>
                <span className="chip">Reaction + accuracy</span>
              </div>
              <button type="button" className="btn btn--primary" onClick={startGame}>
                <Play size={15} /> Play now
              </button>
            </div>
          </article>

          <article className="game-card card card--hover">
            <div className="game-card__art game-card__art--precision">
              <span className="game-card__glyph" style={{ color: 'var(--success)' }}>
                <Crosshair size={30} />
              </span>
            </div>
            <div className="game-card__body">
              <h3>Precision Drill</h3>
              <p>Zero tolerance for sloppy keys. Train a clean line under guidance.</p>
              <div className="game-card__meta">
                <span className="chip">Accuracy</span>
                <span className="chip">Focus areas</span>
              </div>
              <Link to="/practice" className="btn btn--outline">
                Open practice <ArrowRight size={15} />
              </Link>
            </div>
          </article>

          <article className="game-card card card--hover">
            <div className="game-card__art game-card__art--race">
              <span className="game-card__glyph" style={{ color: 'var(--warning)' }}>
                <Timer size={30} />
              </span>
            </div>
            <div className="game-card__body">
              <h3>Sprint Race</h3>
              <p>Pick a time limit and race your own personal best over a fixed passage.</p>
              <div className="game-card__meta">
                <span className="chip">Speed</span>
                <span className="chip">Timed</span>
              </div>
              <Link to="/test" className="btn btn--outline">
                Start sprint <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}

export default Games
