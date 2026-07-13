import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { whatsAppLink } from '../../utils/utils'

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  )

describe('Footer (Footer Rediseño)', () => {
  beforeEach(() => renderFooter())

  it('renders the two link groups with the site links', () => {
    expect(screen.getByRole('navigation', { name: 'Sitio' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Para vos' })).toBeInTheDocument()
    ;[
      ['Inicio', '/'],
      ['Por qué acompaño así', '/#por-que-acompano'],
      ['Testimonios', '/#testimonios'],
      ['FAQ', '/faq'],
      ['Tienda online', '/tienda'],
      ['Portal de pacientes', '/ingresar'],
      ['Contacto', '/contacto'],
    ].forEach(([label, href]) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href)
    })
  })

  it('renders the CTA card with the tienda button', () => {
    expect(screen.getByText('¿Empezamos?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reservar consulta' })).toHaveAttribute(
      'href',
      '/tienda'
    )
  })

  it('whatsapp links carry a default message for Pao', () => {
    const social = screen.getByRole('link', { name: 'WhatsApp' })
    expect(social.getAttribute('href')).toContain('wa.me/5492352404233')
    expect(decodeURIComponent(social.getAttribute('href'))).toContain('Hola Pao')

    const ctaWa = screen.getByRole('link', { name: 'escribime por WhatsApp' })
    expect(decodeURIComponent(ctaWa.getAttribute('href'))).toContain(
      'cómo arrancamos'
    )
  })

  it('shows the current year in the bottom bar', () => {
    expect(
      screen.getByText(`© ${new Date().getFullYear()} Paola Nicola · Nutrición`)
    ).toBeInTheDocument()
  })
})

describe('whatsAppLink', () => {
  it('builds a wa.me url with the encoded message', () => {
    expect(whatsAppLink('¿Cómo va?')).toBe(
      'https://wa.me/5492352404233?text=%C2%BFC%C3%B3mo%20va%3F'
    )
  })
})
