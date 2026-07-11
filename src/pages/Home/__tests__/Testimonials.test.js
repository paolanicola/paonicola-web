import React from 'react'
import { render, screen } from '@testing-library/react'
import Testimonials from '../sections/Testimonials'
import { testimonials } from '../homeContent'

describe('Testimonials', () => {
  beforeEach(() => render(<Testimonials />))

  it('renders the section heading', () => {
    expect(
      screen.getByRole('heading', { name: 'Testimonios' })
    ).toBeInTheDocument()
  })

  it('renders one card per testimonial in the data', () => {
    expect(screen.getAllByRole('figure')).toHaveLength(testimonials.length)
  })

  it('renders each quote and author', () => {
    testimonials.forEach(({ quote, author }) => {
      expect(
        screen.getByText(new RegExp(quote.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      ).toBeInTheDocument()
      expect(screen.getByText(new RegExp(author.replace(/\./g, '\\.')))).toBeInTheDocument()
    })
  })
})
