import React from 'react'

/** A single testimonial quote + author. */
export default function TestimonialCard({ quote, author }) {
  return (
    <figure className='home-testimonial'>
      <blockquote className='home-testimonial__quote'>{`"${quote}"`}</blockquote>
      <figcaption className='home-testimonial__author'>{`— ${author}`}</figcaption>
    </figure>
  )
}
