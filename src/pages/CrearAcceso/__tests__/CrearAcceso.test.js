import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import CrearAcceso from '../CrearAcceso'
import portalReducer from '../../../features/portal/portalSlice'
import portalApi from '../../../services/portalApi'

jest.mock('../../../services/portalApi', () => ({
  __esModule: true,
  default: {
    setPassword: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    fetchLibrary: jest.fn(),
    fetchCategory: jest.fn(),
    markViewed: jest.fn(),
    search: jest.fn(),
    requestReset: jest.fn(),
  },
  getToken: () => null,
  getStoredPatient: () => null,
  storeSession: jest.fn(),
  clearSession: jest.fn(),
}))

function renderPage(url = '/crear-acceso?token=tok-firmado') {
  const store = configureStore({ reducer: { portal: portalReducer } })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path='/crear-acceso' element={<CrearAcceso />} />
          <Route path='/portal' element={<div>PORTAL PAGE</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
  return store
}

describe('CrearAcceso (Fase D)', () => {
  beforeEach(() => jest.clearAllMocks())

  it('sin token muestra el aviso de link inválido', () => {
    renderPage('/crear-acceso')
    expect(screen.getByRole('alert')).toHaveTextContent('no es válido')
    expect(screen.queryByLabelText('Contraseña nueva')).not.toBeInTheDocument()
  })

  it('valida largo y coincidencia sin llamar a la API', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Contraseña nueva'), {
      target: { value: 'corta' },
    })
    fireEvent.change(screen.getByLabelText('Repetila'), {
      target: { value: 'corta' },
    })
    fireEvent.click(screen.getByRole('button', { name: /crear acceso/i }))
    expect(screen.getByRole('alert')).toHaveTextContent('al menos 8')

    fireEvent.change(screen.getByLabelText('Contraseña nueva'), {
      target: { value: 'clave-segura-1' },
    })
    fireEvent.change(screen.getByLabelText('Repetila'), {
      target: { value: 'distinta-2' },
    })
    fireEvent.click(screen.getByRole('button', { name: /crear acceso/i }))
    expect(screen.getByRole('alert')).toHaveTextContent('no coinciden')
    expect(portalApi.setPassword).not.toHaveBeenCalled()
  })

  it('canjea el token y entra directo al portal', async () => {
    portalApi.setPassword.mockResolvedValue({
      token: 'sesion-tok',
      patient: { id: 9, name: 'Nuevo' },
    })
    renderPage()

    fireEvent.change(screen.getByLabelText('Contraseña nueva'), {
      target: { value: 'clave-segura-1' },
    })
    fireEvent.change(screen.getByLabelText('Repetila'), {
      target: { value: 'clave-segura-1' },
    })
    fireEvent.click(screen.getByRole('button', { name: /crear acceso/i }))

    expect(await screen.findByText('PORTAL PAGE')).toBeInTheDocument()
    expect(portalApi.setPassword).toHaveBeenCalledWith('tok-firmado', 'clave-segura-1')
  })

  it('muestra el error del server (token vencido)', async () => {
    portalApi.setPassword.mockRejectedValue({
      response: { data: { error: 'El link venció o no es válido. Pedí uno nuevo.' } },
    })
    renderPage()

    fireEvent.change(screen.getByLabelText('Contraseña nueva'), {
      target: { value: 'clave-segura-1' },
    })
    fireEvent.change(screen.getByLabelText('Repetila'), {
      target: { value: 'clave-segura-1' },
    })
    fireEvent.click(screen.getByRole('button', { name: /crear acceso/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('venció')
  })
})
