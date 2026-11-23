import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const footerLinks = [
  {
    title: 'Learn',
    links: [
      { label: 'Lessons', href: '/lessons' },
      { label: 'Practice', href: '/practice' },
      { label: 'Typing Test', href: '/test' },
      { label: 'Games', href: '/games' },
      { label: 'Keyboard Guide', href: '/guide' },
    ],
  },
  {
    title: 'Progress',
    links: [
      { label: 'Dashboard', href: '/progress' },
      { label: 'Achievements', href: '/achievements' },
      { label: 'Challenges', href: '/challenges' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Profile', href: '/profile' },
      { label: 'Settings', href: '/settings' },
      { label: 'Admin', href: '/admin' },
    ],
  },
]

const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">TypeFlow</span>
          <p className="footer__tagline">
            Your personal typing teacher for finger placement, speed, accuracy and
            confident everyday typing.
          </p>
          <div className="row" style={{ marginTop: '1.1rem', gap: '0.4rem' }}>
            <span className="chip">QWERTY</span>
            <span className="chip">Dvorak</span>
            <span className="chip">Colemak</span>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          {footerLinks.map(({ title, links }) => (
            <div key={title} className="footer__column">
              <h3 className="footer__heading">{title}</h3>
              <ul className="footer__list">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link className="footer__link" to={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; {currentYear} TypeFlow. All rights reserved.
        </p>
        <p className="footer__made">
          Made with <Heart size={12} style={{ color: 'var(--error)' }} /> for faster fingers
        </p>
      </div>
    </footer>
  )
}

export default Footer
