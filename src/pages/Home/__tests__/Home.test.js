import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home'
import { hero, notForYou, philosophy } from '../homeContent'

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

describe('Home (composition)', () => {
  beforeEach(() => renderHome())

  it('renders the main landmark', () => {
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders every section of the redesign', () => {
    expect(screen.getByRole('heading', { name: hero.title })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Testimonios' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: notForYou.title })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: philosophy.title })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Contacto' })
    ).toBeInTheDocument()
  })
})
