import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Pill-shaped call to action from the redesign.
 * Renders a router <Link> when `to` is set, an <a> when `href` is set,
 * otherwise a <button> — one visual primitive for navigation and actions.
 * Variants: solid | outline | light (+ `small` for compact rows).
 */
export default function PillButton({
  to,
  href,
  variant = 'solid',
  small = false,
  type = 'button',
  onClick,
  children,
  className,
  ...rest
}) {
  const cls = [
    'pn-pill',
    `pn-pill--${variant}`,
    small && 'pn-pill--sm',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...rest}>
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
