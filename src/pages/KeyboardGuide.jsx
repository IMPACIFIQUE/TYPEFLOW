import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleCheck,
  Clock,
  Compass,
  Eye,
  GraduationCap,
  Hand,
  Keyboard,
  LayoutGrid,
  Lightbulb,
  Monitor,
  MousePointerClick,
  Printer,
  School,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import KeyboardExplorer from '../components/guide/KeyboardExplorer'
import HandGuide from '../components/keyboard/HandGuide'
import { useSettings } from '../context/SettingsContext'
import { FINGERS, FINGER_LIST, getFingerKeys } from '../utils/fingerMapping'
import { KEY_FINGERS } from '../utils/keyboardLayouts'

const HOME_ROW = [
  { code: 'KeyA', label: 'A' },
  { code: 'KeyS', label: 'S' },
  { code: 'KeyD', label: 'D' },
  { code: 'KeyF', label: 'F' },
  { code: 'KeyJ', label: 'J' },
  { code: 'KeyK', label: 'K' },
  { code: 'KeyL', label: 'L' },
  { code: 'Semicolon', label: ';' },
]

const RULES = [
  {
    title: 'Anchor first',
    text: 'Rest on ASDF and JKL;. After every reach, come back to the bumps on F and J.',
  },
  {
    title: 'One finger, one job',
    text: 'Each finger owns a fixed set of keys. Let the nearest finger move, not the whole hand.',
  },
  {
    title: 'Accuracy before speed',
    text: 'A clean run at 30 WPM beats a messy run at 60. Speed grows from repeatable movements.',
  },
  {
    title: 'Eyes on the screen',
    text: 'Use the on-screen guide while learning, then look away. Your hands need the feedback loop.',
  },
  {
    title: 'Short sessions win',
    text: 'Ten focused minutes a day builds muscle memory faster than one long weekend session.',
  },
]

const DAILY_PLAN = [
  {
    time: '2 min',
    title: 'Reset your setup',
    text: 'Sit tall, relax your shoulders and find the F and J bumps.',
  },
  {
    time: '5 min',
    title: 'Warm up with a lesson',
    text: 'Use the next lesson in the curriculum or replay an older one for stars.',
  },
  {
    time: '6 min',
    title: 'Practice the weak keys',
    text: 'Run a focus drill or a timed sprint, keeping accuracy above 95%.',
  },
  {
    time: '2 min',
    title: 'Finish with a test',
    text: 'Measure the result, then stop. The score is feedback, not a verdict.',
  },
]

const SETUP_TIPS = [
  'Sit upright with feet flat and your screen near eye level.',
  'Keep elbows close to 90 degrees and wrists floating above the desk.',
  'Center the keyboard; the F and J bumps should sit under your index fingers.',
  'Curve your fingers as if holding a small ball. Do not flatten or lock them.',
  'Keep your shoulders and jaw relaxed while you type.',
  'Look at the screen, not your hands. Take a 30-second break every 10 minutes.',
]

const FAQS = [
  {
    question: 'Should I look at the keyboard while I am learning?',
    answer:
      'Short glances are fine at the very beginning. As soon as you can find the home row, keep your eyes on the screen and use the on-screen keyboard for the next key. Looking down becomes a habit very quickly.',
  },
  {
    question: 'How do I know which finger should press a key?',
    answer:
      'Open the interactive key map above and tap any key. The detail panel shows the finger, hand and the other keys that finger owns. The same guidance appears below every typing exercise.',
  },
  {
    question: 'Should I switch to Dvorak or Colemak?',
    answer:
      'Only consider a layout switch after you are comfortable with touch typing. TypeFlow keeps finger assignments tied to physical keys, so the same muscle memory works across QWERTY, Dvorak and Colemak.',
  },
  {
    question: 'What should I do when I make a mistake?',
    answer:
      'Slow down and correct the stroke if backspace is enabled. If you are doing a timed test, decide whether the correction is worth the lost seconds. Accuracy is the priority while you are building the skill.',
  },
  {
    question: 'How often should I practice?',
    answer:
      'Aim for 10 to 20 focused minutes a day. Consistency matters more than duration, and a short session when you are fresh beats a long session when you are tired.',
  },
  {
    question: 'Does TypeFlow work without an account?',
    answer:
      'Yes. Guest mode stores progress in this browser. A local account gives you a named profile and keeps separate progress for multiple people on the same device. Everything stays offline and local-first.',
  },
]

function HomeRowKey({ code, label }) {
  const finger = FINGERS[KEY_FINGERS[code]]
  const isBump = code === 'KeyF' || code === 'KeyJ'

  return (
    <span
      className={`guide-home-key ${isBump ? 'guide-home-key--bump' : ''}`}
      style={{ '--finger-color': finger?.color }}
    >
      {label}
    </span>
  )
}

function KeyboardGuide() {
  const { settings } = useSettings()
  const layoutName = settings.layout === 'dvorak' ? 'Dvorak' : settings.layout === 'colemak' ? 'Colemak' : 'QWERTY'

  return (
    <main className="page guide-page">
      <div className="container">
        <section className="guide-hero">
          <div>
            <span className="eyebrow">
              <Compass size={14} /> Free keyboard guide
            </span>
            <h1 className="guide-hero__title">
              Learn the keyboard.
              <br />
              <span className="gradient-text">Then forget it.</span>
            </h1>
            <p className="guide-hero__lead">
              TypeFlow is your personal typing teacher. This guide covers posture, finger
              placement, the home row and the small habits that turn hunting and pecking into
              calm, automatic touch typing.
            </p>

            <div className="guide-hero__actions">
              <Link to="/lessons/home-row-anchor" className="btn btn--primary btn--lg">
                Start lesson 1 <ArrowRight size={18} />
              </Link>
              <a href="#key-map" className="btn btn--outline btn--lg">
                <MousePointerClick size={18} /> Explore every key
              </a>
              <button
                type="button"
                className="btn btn--ghost btn--lg"
                onClick={() => window.print()}
              >
                <Printer size={18} /> Print guide
              </button>
            </div>

            <div className="guide-hero__meta">
              <span className="chip chip--primary">
                <Hand size={13} /> 8 fingers + thumbs
              </span>
              <span className="chip">
                <LayoutGrid size={13} /> QWERTY, Dvorak, Colemak
              </span>
              <span className="chip chip--success">
                <CircleCheck size={13} /> No account needed
              </span>
            </div>
          </div>

          <div className="guide-hero__visual">
            <div className="hero-glow" aria-hidden="true" />
            <div className="guide-hands card">
              <div className="guide-hands__head">
                <span className="eyebrow">
                  <Keyboard size={13} /> Your home base
                </span>
                <span className="chip">{layoutName}</span>
              </div>

              <div className="guide-home-strip" aria-label="Home row keys">
                {HOME_ROW.map((key) => (
                  <HomeRowKey key={key.code} {...key} />
                ))}
              </div>

              <HandGuide activeFinger="left-index" />

              <p className="guide-hands__caption">
                Index fingers live on <strong>F</strong> and <strong>J</strong>. The raised bumps
                let you reset without looking down.
              </p>
            </div>

            <div className="hero-float guide-float">
              <span className="hero-float__icon">
                <Target size={16} />
              </span>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Home row first</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 500 }}>
                  every reach returns here
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="guide-section" id="key-map">
          <div className="guide-section__head">
            <span className="eyebrow">
              <MousePointerClick size={14} /> Interactive key map
            </span>
            <h2>Every key has one owner.</h2>
            <p>
              Click or tap any key to see which finger should press it, what it types with Shift,
              and a lesson that puts it to work. Your current layout is{' '}
              <strong>{layoutName}</strong> — you can change it in{' '}
              <Link to="/settings">Settings</Link>.
            </p>
          </div>

          <KeyboardExplorer layout={settings.layout} />
        </section>

        <section className="guide-section">
          <div className="guide-split">
            <article className="card card--pad guide-anchor-card">
              <span className="eyebrow">
                <Hand size={14} /> The anchor position
              </span>
              <h2>Start and end on the home row.</h2>
              <p className="muted">
                Your fingers do not live on the letters they type. They live on the home row and
                reach out from there. The moment a reach ends, come home.
              </p>

              <div className="guide-home-strip guide-home-strip--large" aria-label="Home row keys">
                {HOME_ROW.map((key) => (
                  <HomeRowKey key={key.code} {...key} />
                ))}
              </div>

              <div className="guide-home-labels">
                <span>Left hand · A S D F</span>
                <span>Right hand · J K L ;</span>
              </div>

              <ul className="guide-check-list">
                <li className="guide-check">
                  <span className="icon-tile icon-tile--success guide-check__icon">
                    <Check size={14} />
                  </span>
                  <span>
                    <strong>Find the bumps.</strong> F and J have raised markers for a reason.
                  </span>
                </li>
                <li className="guide-check">
                  <span className="icon-tile icon-tile--success guide-check__icon">
                    <Check size={14} />
                  </span>
                  <span>
                    <strong>Use light pressure.</strong> Hover over the keys; do not pound them.
                  </span>
                </li>
                <li className="guide-check">
                  <span className="icon-tile icon-tile--success guide-check__icon">
                    <Check size={14} />
                  </span>
                  <span>
                    <strong>Return after every reach.</strong> A reset is faster than a guess.
                  </span>
                </li>
              </ul>
            </article>

            <article className="card card--pad">
              <span className="eyebrow">
                <Lightbulb size={14} /> The five rules
              </span>
              <h2>Small habits, big difference.</h2>
              <ol className="guide-rules">
                {RULES.map((rule, index) => (
                  <li key={rule.title} className="guide-rule">
                    <span className="guide-rule__num">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{rule.title}</strong>
                      <p>{rule.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-section__head">
            <span className="eyebrow">
              <Hand size={14} /> Finger ownership
            </span>
            <h2>One finger, one job.</h2>
            <p>
              The keyboard is split into columns. Each finger owns a column (and a few neighbours),
              so your brain never has to decide which hand should move.
            </p>
          </div>

          <div className="guide-finger-grid">
            {FINGER_LIST.map((finger) => (
              <article
                key={finger.id}
                className="card guide-finger-card"
                style={{ '--finger-color': finger.color }}
              >
                <div className="guide-finger-card__head">
                  <span className="guide-finger-card__dot" />
                  <div>
                    <h3>{finger.label}</h3>
                    <span className="small muted">{finger.tip}</span>
                  </div>
                </div>

                <div className="guide-finger-card__keys">
                  {getFingerKeys(finger.id, settings.layout).map((char, index) => (
                    <span key={`${finger.id}-${char}-${index}`} className="guide-key-chip">
                      {char === ' ' ? 'space' : char}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-split">
            <article className="card card--pad">
              <span className="eyebrow">
                <Timer size={14} /> Daily loop
              </span>
              <h2>A 15-minute session you can repeat.</h2>
              <div className="guide-plan">
                {DAILY_PLAN.map((step) => (
                  <div key={step.title} className="guide-plan__step">
                    <span className="guide-plan__time">{step.time}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/lessons" className="btn btn--primary btn--sm">
                <BookOpen size={15} /> Open the curriculum
              </Link>
            </article>

            <article className="card card--pad">
              <span className="eyebrow">
                <Monitor size={14} /> Desk setup
              </span>
              <h2>Set up before you speed up.</h2>
              <ul className="guide-check-list">
                {SETUP_TIPS.map((tip) => (
                  <li key={tip} className="guide-check">
                    <span className="icon-tile icon-tile--success guide-check__icon">
                      <Check size={14} />
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <p className="guide-setup-note">
                <Eye size={14} /> If your eyes, wrists or shoulders hurt, stop and adjust the desk
                before continuing.
              </p>
            </article>
          </div>
        </section>

        <section className="guide-section" id="classroom">
          <div className="guide-classroom card">
            <div>
              <span className="eyebrow">
                <School size={14} /> For teachers &amp; learning centers
              </span>
              <h2>Turn the guide into a calm 20-minute class.</h2>
              <p className="guide-classroom__lead">
                TypeFlow gives every learner the same clear vocabulary: home row, anchor, reach,
                return. Run the session together, then let learners work at their own pace.
              </p>

              <div className="guide-classroom__steps">
                <div className="guide-classroom__step">
                  <span>01</span>
                  <div>
                    <strong>2 min — setup check</strong>
                    <p>Posture, screen height, wrist position, F and J bumps.</p>
                  </div>
                </div>
                <div className="guide-classroom__step">
                  <span>02</span>
                  <div>
                    <strong>5 min — teacher demo</strong>
                    <p>Project the interactive key map and model one finger at a time.</p>
                  </div>
                </div>
                <div className="guide-classroom__step">
                  <span>03</span>
                  <div>
                    <strong>10 min — guided practice</strong>
                    <p>Everyone opens the same lesson. Accuracy above 95% before speed.</p>
                  </div>
                </div>
                <div className="guide-classroom__step">
                  <span>04</span>
                  <div>
                    <strong>3 min — share and reflect</strong>
                    <p>One thing that felt easier, one key to practise next time.</p>
                  </div>
                </div>
              </div>

              <div className="row" style={{ gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
                <Link to="/lessons" className="btn btn--primary btn--sm">
                  <BookOpen size={15} /> Browse the curriculum
                </Link>
                <Link to="/admin" className="btn btn--outline btn--sm">
                  <Users size={15} /> Open local admin
                </Link>
              </div>
            </div>

            <aside className="guide-classroom__aside">
              <span className="chip chip--primary">
                <GraduationCap size={13} /> Classroom quick start
              </span>
              <h3>What you need</h3>
              <ul className="guide-check-list">
                <li className="guide-check">
                  <span className="icon-tile icon-tile--success guide-check__icon">
                    <Check size={14} />
                  </span>
                  <span>A browser and a keyboard. No install, no subscription.</span>
                </li>
                <li className="guide-check">
                  <span className="icon-tile icon-tile--success guide-check__icon">
                    <Check size={14} />
                  </span>
                  <span>Optional local accounts for separate progress per learner.</span>
                </li>
                <li className="guide-check">
                  <span className="icon-tile icon-tile--success guide-check__icon">
                    <Check size={14} />
                  </span>
                  <span>One shared screen for the demo, or individual devices.</span>
                </li>
              </ul>
              <p className="small muted">
                TypeFlow is local-first: accounts and progress stay in this browser. The admin
                view only sees profiles created on the same device.
              </p>
            </aside>
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-section__head">
            <span className="eyebrow">
              <Sparkles size={14} /> Questions
            </span>
            <h2>Good questions, honest answers.</h2>
            <p>Everything a new touch typist asks in the first week.</p>
          </div>

          <div className="guide-faq">
            {FAQS.map((item) => (
              <details key={item.question} className="guide-faq__item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="guide-section" style={{ paddingBottom: 0 }}>
          <div className="cta-band">
            <div>
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <Trophy size={14} /> Your first clean run
              </span>
              <h2>Your fingers already know the way.</h2>
              <p>
                Start with one lesson, one home-row anchor and one calm breath. The speed follows.
              </p>
            </div>
            <div className="row" style={{ gap: '0.6rem', flexWrap: 'wrap' }}>
              <Link to="/lessons/home-row-anchor" className="btn btn--lg">
                <Zap size={18} /> Start lesson 1
              </Link>
              <Link
                to="/test"
                className="btn btn--lg"
                style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}
              >
                <Clock size={18} /> Take a test
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default KeyboardGuide
