import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Compass, Gauge, Home as HomeIcon, Keyboard } from 'lucide-react'

function NotFound() {
  return (
    <main className="page">
      <div className="container">
        <div className="not-found">
          <span className="eyebrow">
            <Compass size={14} /> Off the keyboard
          </span>
          <div className="not-found__code">404</div>
          <h1 style={{ marginTop: '0.5rem' }}>This page slipped between the keys</h1>
          <p className="page-head__subtitle" style={{ margin: '0.75rem auto 0', maxWidth: '46ch' }}>
            The link may be old, mistyped, or simply never existed. Let&apos;s get your fingers
            back to somewhere useful.
          </p>

          <div
            className="row"
            style={{ justifyContent: 'center', marginTop: '1.75rem', flexWrap: 'wrap' }}
          >
            <Link to="/" className="btn btn--primary btn--lg">
              <HomeIcon size={18} /> Back home
            </Link>
            <Link to="/test" className="btn btn--outline btn--lg">
              <Gauge size={18} /> Take a test
            </Link>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '0.9rem',
              marginTop: '3rem',
              textAlign: 'left',
            }}
          >
            {[
              {
                to: '/lessons',
                icon: BookOpen,
                title: 'Guided lessons',
                text: 'Thirty lessons from home row to real prose.',
              },
              {
                to: '/practice',
                icon: Keyboard,
                title: 'Free practice',
                text: 'Drills, quotes and paragraphs with live stats.',
              },
              {
                to: '/progress',
                icon: Gauge,
                title: 'Your progress',
                text: 'Trends, streaks and per-key accuracy maps.',
              },
            ].map(({ to, icon: CardIcon, title, text }) => (
              <Link key={to} to={to} className="card card--pad card--hover">
                <span className="best-item__icon" style={{ marginBottom: '0.65rem' }}>
                  <CardIcon size={18} />
                </span>
                <div className="card__title">{title}</div>
                <p className="card__text">{text}</p>
              </Link>
            ))}
          </div>

          <p className="small muted" style={{ marginTop: '2.5rem' }}>
            <ArrowLeft size={13} style={{ verticalAlign: '-2px' }} /> Tip: the browser back button
            usually knows the way.
          </p>
        </div>
      </div>
    </main>
  )
}

export default NotFound
