import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Contact from '../Contact'

function renderContact() {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  )
}

describe('Contacto (Tienda Rediseño)', () => {
  let openSpy
  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
  })
  afterEach(() => openSpy.mockRestore())

  it('renders the redesigned header and direct channels', () => {
    renderContact()
    expect(screen.getByRole('heading', { name: 'Hablemos' })).toBeInTheDocument()
    // WhatsApp deep-link con mensaje precargado
    const wa = screen.getByRole('link', { name: /WhatsApp/i })
    expect(wa).toHaveAttribute('href', expect.stringContaining('wa.me/5492352404233'))
    expect(screen.getByRole('link', { name: /Correo/i })).toHaveAttribute(
      'href',
      'mailto:nutricionista.nicola@gmail.com'
    )
    expect(screen.getByRole('link', { name: /Instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/nutricion.paonicola/'
    )
  })

  // Regresión: el form hacía setSend(true) y descartaba el mensaje. Ahora abre
  // WhatsApp con el texto precargado (2026-07-19).
  it('opens WhatsApp with the message prefilled on submit', async () => {
    renderContact()
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/Mensaje/), {
      target: { value: 'Quiero empezar el método regula' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }))

    await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1))
    const url = decodeURIComponent(openSpy.mock.calls[0][0])
    expect(url).toContain('wa.me/5492352404233')
    expect(url).toContain('Soy Ana')
    expect(url).toContain('Quiero empezar el método regula')
  })

  it('includes the email in the message when provided', async () => {
    renderContact()
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'ana@mail.com' },
    })
    fireEvent.change(screen.getByLabelText(/Mensaje/), { target: { value: 'Hola' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }))

    await waitFor(() => expect(openSpy).toHaveBeenCalled())
    expect(decodeURIComponent(openSpy.mock.calls[0][0])).toContain('ana@mail.com')
  })

  it('does not submit without name and message', async () => {
    renderContact()
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }))
    expect(await screen.findByText('Contame tu nombre')).toBeInTheDocument()
    expect(screen.getByText('Escribí tu consulta')).toBeInTheDocument()
    expect(openSpy).not.toHaveBeenCalled()
  })

  it('validates the email format only when filled', async () => {
    renderContact()
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'no-es-mail' } })
    fireEvent.change(screen.getByLabelText(/Mensaje/), { target: { value: 'Hola' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }))
    expect(await screen.findByText('Revisá el formato del email')).toBeInTheDocument()
    expect(openSpy).not.toHaveBeenCalled()
  })
})
