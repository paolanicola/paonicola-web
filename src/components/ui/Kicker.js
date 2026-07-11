import React from 'react'

/** Small uppercase mint label used above section titles in the redesign. */
export default function Kicker({ children, className }) {
  return (
    <span className={`pn-kicker${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  )
}
