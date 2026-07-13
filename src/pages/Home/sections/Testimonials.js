import React from 'react'
import { testimonials } from '../homeContent'
import TestimonialCard from '../ui/TestimonialCard'

export default function Testimonials() {
  return (
    <section id='testimonios' className='home__testimonials' aria-labelledby='home-testimonials-title'>
      <h2 id='home-testimonials-title' className='home__section-title'>
        Testimonios
      </h2>
      <div className='home__testimonials-grid'>
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} quote={t.quote} author={t.author} />
        ))}
      </div>
    </section>
  )
}
