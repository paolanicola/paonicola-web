import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ContactCta from '../sections/ContactCta'
import { contact } from '../homeContent'

function renderInRouter() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path='/' element={<ContactCta />} />
        <Route path='/contacto' element={<div>PÁGINA CONTACTO</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ContactCta', () => {
  it('renders a field per configured field', () => {
    renderInRouter()
    contact.fields.forEach((field) => {
      expect(screen.getByText(field.label)).toBeInTheDocument()
    })
  })

  it('renders the submit button', () => {
    renderInRouter()
    expect(
      screen.getByRole('button', { name: contact.submitLabel })
    ).toBeInTheDocument()
  })

  it('navigates to the full contact page on submit', () => {
    renderInRouter()
    fireEvent.click(
      screen.getByRole('button', { name: contact.submitLabel })
    )
    expect(screen.getByText('PÁGINA CONTACTO')).toBeInTheDocument()
  })
})
