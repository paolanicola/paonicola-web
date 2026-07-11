import React from 'react'

/** Small uppercase mint label used above section titles in the design. */
export default function Kicker({ children, className }) {
  return (
    <span className={`home-kicker${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  )
}
