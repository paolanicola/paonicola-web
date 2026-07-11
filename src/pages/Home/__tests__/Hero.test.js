import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '../sections/Hero'
import { hero } from '../homeContent'

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )

describe('Hero', () => {
  beforeEach(() => renderHero())

  it('renders the headline', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      hero.title
    )
  })

  it('renders both CTAs pointing to the right routes', () => {
    const reservar = screen.getByRole('link', { name: /reservar consulta/i })
    const hablar = screen.getByRole('link', { name: /hablar con paola/i })
    expect(reservar).toHaveAttribute('href', '/tienda')
    expect(hablar).toHaveAttribute('href', '/contacto')
  })

  it('renders the hero image with an accessible alt', () => {
    expect(screen.getByAltText(hero.imageAlt)).toBeInTheDocument()
  })

  it('renders the wellbeing score', () => {
    expect(screen.getByText(String(hero.wellbeing.score))).toBeInTheDocument()
  })

  it('bolds the emphasized fragment in the intro', () => {
    expect(screen.getByText('mi acompañamiento por WhatsApp').tagName).toBe(
      'STRONG'
    )
  })
})
