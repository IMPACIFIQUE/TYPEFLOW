import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  Check,
  Code2,
  Compass,
  Gamepad2,
  Gauge,
  GraduationCap,
  Keyboard,
  LayoutGrid,
  Palette,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import HeroPreview from '../components/typing/HeroPreview'
import KeyboardPanel from '../components/keyboard/KeyboardPanel'
import Footer from '../components/common/Footer'
import { useProgress } from '../context/ProgressContext'
import { getDailyChallenge } from '../data/exercises'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'A real curriculum',
    text: 'Six units and 30 guided lessons take you from home-row anchors to code and punctuation.',
  },
  {
    icon: Gauge,
    title: 'Live, honest metrics',
    text: 'WPM, raw speed, accuracy and rhythm consistency update on every keystroke.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard intelligence',
    text: 'An on-screen keyboard highlights the next key and the exact finger that should press it.',
  },
  {
    icon: Gamepad2,
    title: 'Practice that plays',
    text: 'Catch falling words in Word Rain, then take on timed sprints and precision drills.',
  },
  {
    icon: BarChart3,
    title: 'Proof of progress',
    text: 'Trends, streaks, personal bests, a contribution heatmap and per-key accuracy maps.',
  },
  {
    icon: Palette,
    title: 'Make it yours',
    text: 'Light and dark themes, three layouts, four caret styles, sound and blind mode.',
  },
]

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: 'Complete beginners',
    text: 'Start with posture, finger placement and the home row. No prior typing experience needed.',
    to: '/guide',
    link: 'Open the keyboard guide',
  },
  {
    icon: BookOpen,
    title: 'Students',
    text: 'Turn assignments and exam prep into faster, calmer typing with short daily drills.',
    to: '/lessons',
    link: 'Start the curriculum',
  },
  {
    icon: Code2,
    title: 'Developers',
    text: 'Practise punctuation, symbols and code-shaped text without breaking your flow.',
    to: '/practice',
    link: 'Build a custom drill',
  },
  {
    icon: Briefcase,
    title: 'Office workers',
    text: 'Type reports, email and notes with less fatigue and fewer corrections.',
    to: '/practice',
    link: 'Practise real-world text',
  },
  {
    icon: Users,
    title: 'Teachers & centers',
    text: 'Use a free local-first curriculum and a calm classroom plan for any group.',
    to: '/guide',
    link: 'See the classroom plan',
  },
  {
    icon: Target,
    title: 'Advanced typists',
    text: 'Test your ceiling, chase personal bests and drill the keys that slow you down.',
    to: '/test',
    link: 'Take a typing test',
  },
]

function Home() {
  const { stats } = useProgress()
  const daily = useMemo(() => getDailyChallenge(), [])

  return (
    <>
    <main>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="eyebrow">
              <Sparkles size={14} /> Type faster. Think smoother.
            </span>
            <h1 className="hero__title">
              Master the keyboard,
              <br />
              <span className="gradient-text">one key at a time.</span>
            </h1>
            <p className="hero__lead">
              TypeFlow is your personal typing teacher. Learn finger placement,
              follow a guided curriculum and build speed with live analytics,
              playful drills and a keyboard guide that shows every reach.
            </p>

            <div className="hero__actions">
              <Link to="/test" className="btn btn--primary btn--lg">
                Start a typing test <ArrowRight size={18} />
              </Link>
              <Link to="/lessons" className="btn btn--outline btn--lg">
                <BookOpen size={18} /> Explore lessons
              </Link>
              <Link to="/guide" className="btn btn--ghost btn--lg">
                <Compass size={18} /> Keyboard guide
              </Link>
            </div>

            <div className="hero__proof">
              <div className="hero__proof-item">
                <span className="hero__proof-value">30</span>
                <span className="hero__proof-label">Guided lessons</span>
              </div>
              <div className="hero__proof-item">
                <span className="hero__proof-value">6</span>
                <span className="hero__proof-label">Skill units</span>
              </div>
              <div className="hero__proof-item">
                <span className="hero__proof-value">3</span>
                <span className="hero__proof-label">Keyboard layouts</span>
              </div>
              <div className="hero__proof-item">
                <span className="hero__proof-value">100%</span>
                <span className="hero__proof-label">Free & offline</span>
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero-glow" aria-hidden="true" />

            <div className="hero-float hero-float--accuracy">
              <span className="hero-float__icon">
                <Target size={16} />
              </span>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                  Live accuracy
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 500 }}>
                  tracked every keystroke
                </div>
              </div>
            </div>

            <HeroPreview />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Everything in one place</span>
            <h2>Built like a training studio, not a toy</h2>
            <p>
              Every feature exists for one reason: to help you type with less
              effort and more confidence.
            </p>
          </div>

          <div className="feature-grid">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="feature-card card card--hover">
                <span className="feature-card__icon">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Built for real learners</span>
            <h2>One keyboard. Many starting points.</h2>
            <p>
              Whether you are opening a keyboard for the first time or chasing a
              personal best, TypeFlow meets you where you are and gives you a
              clear next step.
            </p>
          </div>

          <div className="audience-grid">
            {AUDIENCES.map(({ icon: Icon, title, text, to, link }) => (
              <Link key={title} to={to} className="audience-card card card--hover">
                <span className="audience-card__icon">
                  <Icon size={19} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="audience-card__link">
                    {link} <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split-panel">
          <div>
            <span className="eyebrow">
              <Keyboard size={14} /> See every key
            </span>
            <h2 style={{ marginTop: '0.6rem' }}>Your fingers get a map, not a guess.</h2>
            <p className="muted" style={{ marginTop: '0.8rem', maxWidth: '48ch' }}>
              The virtual keyboard follows the physical keys, so your muscle
              memory transfers even if you switch to Dvorak or Colemak. The next
              key glows, its finger is highlighted, and the hands show the reach.
            </p>
            <ul className="stack" style={{ marginTop: '1.3rem', gap: '0.6rem' }}>
              {[
                'Home-row anchors with raised F and J bumps',
                'Colour-coded finger legend and hand diagram',
                'Correct Shift-key hint for capitals and symbols',
              ].map((item) => (
                <li key={item} className="row" style={{ gap: '0.55rem', alignItems: 'center' }}>
                  <span className="icon-tile icon-tile--success" style={{ width: 26, height: 26 }}>
                    <Check size={14} />
                  </span>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="row" style={{ marginTop: '1.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Link to="/practice" className="btn btn--soft">
                Practice with guidance <ArrowRight size={16} />
              </Link>
              <Link to="/guide" className="btn btn--outline">
                <Compass size={16} /> Open the keyboard guide
              </Link>
            </div>
          </div>

          <div className="card card--pad">
            <KeyboardPanel nextChar="f" compact />
            <div
              className="row"
              style={{ marginTop: '1rem', justifyContent: 'center', gap: '0.4rem' }}
            >
              <span className="chip chip--primary">Next key: F</span>
              <span className="chip">Left index finger</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Three steps to a better flow</h2>
          </div>
          <div className="steps">
            <article className="step">
              <span className="step__num">01</span>
              <h3>Find your baseline</h3>
              <p>Take a 30-second test. We measure speed, accuracy and rhythm — no judgement.</p>
            </article>
            <article className="step">
              <span className="step__num">02</span>
              <h3>Train the weak spots</h3>
              <p>Follow the curriculum or drill the keys and patterns that are holding you back.</p>
            </article>
            <article className="step">
              <span className="step__num">03</span>
              <h3>Watch it compound</h3>
              <p>Daily sessions become a streak. The charts, badges and bests remember every win.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="daily-banner">
            <div>
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <Trophy size={14} /> Today&apos;s challenge
              </span>
              <h2 style={{ marginTop: '0.5rem' }}>{daily.variant.label}</h2>
              <p>
                A fresh passage every day. Hit {daily.targetWpm} WPM with at least{' '}
                {daily.targetAccuracy}% accuracy to complete today&apos;s goal.
              </p>
              <div className="daily-stats">
                <div className="daily-stat">
                  <b>{daily.text.split(' ').length}</b>
                  <span>words</span>
                </div>
                <div className="daily-stat">
                  <b>{daily.targetWpm}</b>
                  <span>WPM target</span>
                </div>
                <div className="daily-stat">
                  <b>{stats.streak}</b>
                  <span>day streak</span>
                </div>
              </div>
            </div>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <Link to="/challenges" className="btn btn--lg">
                <Zap size={18} /> Take the challenge
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Ready to stop looking at your hands?</h2>
              <p>
                Your first clean run is one click away. No setup, no subscription,
                no excuses.
              </p>
            </div>
            <Link to="/test" className="btn btn--lg">
              <LayoutGrid size={18} /> Start typing now
            </Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  )
}

export default Home
