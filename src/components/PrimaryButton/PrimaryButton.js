import React from 'react'
import { Link } from 'react-router-dom'

export default function PrimaryButton({ actionText, href, to, onClick }) {
  // Si es un link interno de react-router
  if (to || (href && href.startsWith('/')) && !onClick) {
    return (
      <Link to={to || href} className="primary-button">
        <p>{actionText}</p>
      </Link>
    )
  }

  // Si es un link externo
  if (href && !onClick) {
    return (
      <a href={href} className="primary-button" target="_blank" rel="noopener noreferrer">
        <p>{actionText}</p>
      </a>
    )
  }

  // Botón normal
  return (
    <button className="primary-button" onClick={onClick}>
      <p>{actionText}</p>
    </button>
  )
}
