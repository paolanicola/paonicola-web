import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Ingresar from '../Ingresar'
import portalReducer from '../../../features/portal/portalSlice'
import portalApi from '../../../services/portalApi'

jest.mock('../../../services/portalApi', () => ({
  __esModule: true,
  default: {
    fetchLibrary: jest.fn(),
    fetchCategory: jest.fn(),
    markViewed: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
  getToken: () => null,
  getStoredPatient: () => null,
  storeSession: jest.fn(),
  clearSession: jest.fn(),
}))

function renderIngresar(portalState = {}) {
  const store = configureStore({
    reducer: { portal: portalReducer },
    preloadedState: {
      portal: {
        token: null,
        patient: null,
        library: null,
        category: null,
        loading: false,
        categoryLoading: false,
        loginError: null,
        loginPending: false,
        ...portalState,
      },
    },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/ingresar']}>
        <Routes>
          <Route path='/ingresar' element={<Ingresar />} />
          <Route path='/portal' element={<div>PORTAL PAGE</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
  return store
}

describe('Ingresar (7a)', () => {
  it('renders the login form with email and password', () => {
    renderIngresar()
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })

  it('shows the API error message', () => {
    renderIngresar({ loginError: 'Email o contraseña incorrectos' })
    expect(screen.getByRole('alert')).toHaveTextContent('Email o contraseña incorrectos')
  })

  it('logs in through the form and redirects to the portal', async () => {
    portalApi.login.mockResolvedValue({
      token: 'tok',
      patient: { id: 1, name: 'Agustín' },
    })
    renderIngresar()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'agustin@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByText('PORTAL PAGE')).toBeInTheDocument()
    expect(portalApi.login).toHaveBeenCalledWith('agustin@test.com', 'password123')
  })
})
