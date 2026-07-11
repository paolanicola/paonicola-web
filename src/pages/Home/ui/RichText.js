import React from 'react'

/**
 * Renders a paragraph made of inline segments, bolding those flagged `bold`.
 * Keeps the section components free of copy-with-markup and lets content live
 * as plain data in homeContent.js.
 */
export default function RichText({ paragraph, className }) {
  const { variant = 'body', segments } = paragraph
  return (
    <p className={`home-rich home-rich--${variant}${className ? ` ${className}` : ''}`}>
      {segments.map((seg, i) =>
        seg.bold ? (
          <strong key={i} className='home-rich__strong'>
            {seg.text}
          </strong>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
    </p>
  )
}
