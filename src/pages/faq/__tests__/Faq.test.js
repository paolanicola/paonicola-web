import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Faq from '../Faq'
import { accordionData } from '../../../utils/contentFAQ'

function renderFaq() {
  render(
    <MemoryRouter>
      <Faq />
    </MemoryRouter>
  )
}

describe('FAQ (Tienda Rediseño)', () => {
  it('renders every question as a collapsed accordion', () => {
    renderFaq()
    expect(
      screen.getByRole('heading', { name: /resolvamos tus dudas/i })
    ).toBeInTheDocument()
    const triggers = screen.getAllByRole('button', { expanded: false })
    // los 8 items del contenido (los pills del CTA no son toggles)
    expect(triggers).toHaveLength(accordionData.length)
  })

  it('expands and collapses an item, exposing the answer', () => {
    renderFaq()
    const trigger = screen.getByRole('button', { name: /consultas son online/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panel = screen.getByRole('region', { name: /consultas son online/i })
    expect(within(panel).getByText(/consultorio presencial/i)).toBeInTheDocument()

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('region', { name: /consultas son online/i })
    ).not.toBeInTheDocument()
  })

  it('renders rich HTML answers (lists) safely', () => {
    renderFaq()
    fireEvent.click(screen.getByRole('button', { name: /tratamiento online/i }))
    expect(screen.getByText('Mejorar hábitos alimentarios')).toBeInTheDocument()
  })

  it('closes the page with WhatsApp and store CTAs', () => {
    renderFaq()
    expect(
      screen.getByRole('link', { name: 'Escribime por WhatsApp' })
    ).toHaveAttribute('href', expect.stringContaining('wa.me/5492352404233'))
    expect(screen.getByRole('link', { name: 'Ver la tienda' })).toHaveAttribute(
      'href',
      '/tienda'
    )
  })
})
