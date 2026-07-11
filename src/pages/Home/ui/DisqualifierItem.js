import React from 'react'

/** A "no es para vos si..." row: rosa ✗ marker + text, on the navy panel. */
export default function DisqualifierItem({ children }) {
  return (
    <li className='home-disqualifier'>
      <span className='home-disqualifier__mark' aria-hidden='true'>
        ✗
      </span>
      <span className='home-disqualifier__text'>{children}</span>
    </li>
  )
}
