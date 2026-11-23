const VARIANTS = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  soft: 'btn--soft',
  outline: 'btn--outline',
  ghost: 'btn--ghost',
  danger: 'btn--danger',
}

const SIZES = {
  sm: 'btn--sm',
  lg: 'btn--lg',
}

/**
 * Standard button. For navigation, prefer <Link className="btn ...">, since
 * this component intentionally renders a real <button>.
 */
function Button({
  children,
  variant = 'primary',
  size = '',
  block = false,
  className = '',
  type = 'button',
  ...props
}) {
  const classes = [
    'btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
