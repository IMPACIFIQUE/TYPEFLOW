import { Keyboard } from 'lucide-react'

function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`} aria-label="TypeFlow">
      <span className="logo__mark" aria-hidden="true">
        <Keyboard size={21} strokeWidth={2.3} />
      </span>
      <span className="logo__text">
        Type<span>Flow</span>
      </span>
    </span>
  )
}

export default Logo
