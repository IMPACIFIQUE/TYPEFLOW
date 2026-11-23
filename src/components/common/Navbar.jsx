import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  Compass,
  Flame,
  Gamepad2,
  Home,
  Keyboard,
  LogOut,
  Menu,
  Settings,
  Timer,
  Trophy,
  User,
  X,
} from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import AuthModal from './AuthModal'
import { useAuth } from '../../context/AuthContext'
import { useProgress } from '../../context/ProgressContext'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/lessons', label: 'Learn', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Keyboard },
  { to: '/test', label: 'Typing test', icon: Timer },
  { to: '/games', label: 'Games', icon: Gamepad2 },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/guide', label: 'Guide', icon: Compass },
]

const RESOURCE_LINKS = [
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Navbar() {
  const { user, signOut } = useAuth()
  const { stats } = useProgress()
  const { pathname } = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const menuRef = useRef(null)

  useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const isActive = (to) => pathname === to || (pathname.startsWith(`${to}/`) && to !== '/')

  const openAuth = (mode = 'signin') => {
    setAuthMode(mode)
    setAuthOpen(true)
    setMobileOpen(false)
  }

  return (
    <>
      <header className="navbar">
        <div className="container navbar__inner">
          <Logo />

          <nav className="nav-links" aria-label="Primary navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
                aria-current={isActive(to) ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="navbar__actions">
            {stats.streak > 0 && (
              <Link
                to="/progress"
                className="chip chip--warning nav-streak"
                title={`${stats.streak} day streak`}
              >
                <Flame size={14} />
                {stats.streak}
              </Link>
            )}

            <ThemeToggle />

            {user ? (
              <div className="user-menu" ref={menuRef}>
                <button
                  type="button"
                  className="user-menu__trigger"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <span className="avatar" style={{ background: user.avatarColor }}>
                    {user.initials}
                  </span>
                  <span className="user-menu__name">{user.name}</span>
                  <ChevronDown size={14} />
                </button>

                {menuOpen && (
                  <div className="user-menu__panel" role="menu">
                    <div className="user-menu__head">
                      <strong style={{ fontSize: '0.9rem' }}>{user.name}</strong>
                      <p className="small muted" style={{ fontSize: '0.72rem' }}>
                        {user.email}
                      </p>
                    </div>
                    <Link to="/profile" className="user-menu__item" role="menuitem">
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/progress" className="user-menu__item" role="menuitem">
                      <BarChart3 size={16} /> Progress
                    </Link>
                    <Link to="/achievements" className="user-menu__item" role="menuitem">
                      <Trophy size={16} /> Achievements
                    </Link>
                    <Link to="/guide" className="user-menu__item" role="menuitem">
                      <Compass size={16} /> Keyboard guide
                    </Link>
                    <Link to="/settings" className="user-menu__item" role="menuitem">
                      <Settings size={16} /> Settings
                    </Link>
                    <button
                      type="button"
                      className="user-menu__item user-menu__item--danger"
                      role="menuitem"
                      onClick={() => {
                        signOut()
                        setMenuOpen(false)
                      }}
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="btn btn--primary btn--sm btn--nav-cta"
                onClick={() => openAuth('signin')}
              >
                Sign in
              </button>
            )}

            <button
              type="button"
              className="icon-btn navbar__burger"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="navbar__drawer">
            <nav className="drawer-links" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`drawer-link ${isActive(to) ? 'active' : ''}`}
                  aria-current={isActive(to) ? 'page' : undefined}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>

            <nav className="drawer-links drawer-links--secondary" aria-label="Resources">
              {RESOURCE_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`drawer-link ${isActive(to) ? 'active' : ''}`}
                  aria-current={isActive(to) ? 'page' : undefined}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="sidebar-card">
                <div className="row" style={{ marginBottom: '0.85rem' }}>
                  <span className="avatar" style={{ background: user.avatarColor }}>
                    {user.initials}
                  </span>
                  <div>
                    <strong style={{ display: 'block' }}>{user.name}</strong>
                    <span className="small muted">{user.email}</span>
                  </div>
                </div>
                <div className="sidebar-links">
                  <Link to="/profile" className="sidebar-link">
                    <User size={16} /> Profile
                  </Link>
                  <button type="button" className="sidebar-link" onClick={signOut}>
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="stack" style={{ gap: '0.55rem' }}>
                <button type="button" className="btn btn--primary btn--lg" onClick={() => openAuth('signup')}>
                  Create free account
                </button>
                <button type="button" className="btn btn--outline" onClick={() => openAuth('signin')}>
                  Sign in
                </button>
              </div>
            )}

            <div className="row" style={{ marginTop: '1rem', justifyContent: 'space-between' }}>
              <span className="small muted">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </>
  )
}

export default Navbar
