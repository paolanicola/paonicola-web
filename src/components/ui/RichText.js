import React from 'react'

/**
 * Renders a paragraph made of inline segments, bolding those flagged `bold`.
 * Content stays as plain data ({ variant, segments: [{ text, bold? }] })
 * so section components remain copy-free.
 */
export default function RichText({ paragraph, className }) {
  const { variant = 'body', segments } = paragraph
  return (
    <p className={`pn-rich pn-rich--${variant}${className ? ` ${className}` : ''}`}>
      {segments.map((seg, i) =>
        seg.bold ? (
          <strong key={i} className='pn-rich__strong'>
            {seg.text}
          </strong>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
    </p>
  )
}
