import { useEffect, useState } from 'react'
import { AlertCircle, ArrowRight, Lock, Mail, User } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import { useAuth } from '../../context/AuthContext'

/**
 * Combined sign in / sign up dialog. Accounts are local to the browser, which
 * keeps the app fully offline; progress is stored per account.
 */
function AuthModal({ open, onClose, initialMode = 'signin' }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setError('')
      setForm({ name: '', email: '', password: '' })
      setBusy(false)
    }
  }, [open, initialMode])

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      if (mode === 'signup') {
        signUp(form)
      } else {
        signIn(form)
      }
      setBusy(false)
      onClose?.()
    } catch (err) {
      setBusy(false)
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'signin' ? 'Welcome back' : 'Create your account'}
      subtitle={
        mode === 'signin'
          ? 'Sign in to keep your progress, streak and personal bests.'
          : 'Start a streak and track every improvement — all stored on this device.'
      }
    >
      <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signin'}
          className={`auth-tabs__btn ${mode === 'signin' ? 'active' : ''}`}
          onClick={() => {
            setMode('signin')
            setError('')
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          className={`auth-tabs__btn ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => {
            setMode('signup')
            setError('')
          }}
        >
          Create account
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="auth-error" role="alert">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {mode === 'signup' && (
          <label className="field">
            <span className="field__label">Display name</span>
            <div className="input-with-icon">
              <User size={16} />
              <input
                className="input"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Alex Typist"
                value={form.name}
                onChange={update('name')}
                required
              />
            </div>
          </label>
        )}

        <label className="field">
          <span className="field__label">Email</span>
          <div className="input-with-icon">
            <Mail size={16} />
            <input
              className="input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
              required
            />
          </div>
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <div className="input-with-icon">
            <Lock size={16} />
            <input
              className="input"
              type="password"
              name="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={update('password')}
              required
              minLength={6}
            />
          </div>
        </label>

        <Button type="submit" variant="primary" size="lg" block disabled={busy}>
          {mode === 'signin' ? 'Sign in' : 'Create account'}
          <ArrowRight size={17} />
        </Button>
      </form>

      <p className="auth-alt">
        {mode === 'signin' ? 'New to TypeFlow? ' : 'Already have an account? '}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError('')
          }}
        >
          {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
        </button>
      </p>

      <button type="button" className="auth-guest" onClick={onClose}>
        Continue as guest — progress stays on this device
      </button>
    </Modal>
  )
}

export default AuthModal
