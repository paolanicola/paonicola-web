import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Pill-shaped call to action from the design.
 * Renders a router <Link> when `to` is set, otherwise a <button> — so the same
 * visual primitive works for navigation and for form actions.
 */
export default function PillButton({
  to,
  href,
  variant = 'solid',
  type = 'button',
  onClick,
  children,
  className,
  ...rest
}) {
  const cls = `home-pill home-pill--${variant}${className ? ` ${className}` : ''}`

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
