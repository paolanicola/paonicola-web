import React from 'react'

/** Un testimonio: comilla decorativa, párrafos y autor (design 6a). */
export default function TestimonialCard({ paragraphs, author }) {
  return (
    <figure className='home-testimonial'>
      <span className='home-testimonial__mark' aria-hidden='true'>
        “
      </span>
      <blockquote className='home-testimonial__quote'>
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </blockquote>
      <figcaption className='home-testimonial__author'>{author}</figcaption>
    </figure>
  )
}
