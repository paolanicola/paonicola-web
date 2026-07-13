import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import RequirePatient from '../RequirePatient'
import portalReducer from '../../features/portal/portalSlice'

function renderGuard(token) {
  const store = configureStore({
    reducer: { portal: portalReducer },
    preloadedState: {
      portal: {
        token,
        patient: token ? { id: 1, name: 'A' } : null,
        library: null,
        category: null,
        loading: false,
        categoryLoading: false,
        loginError: null,
        loginPending: false,
      },
    },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/portal']}>
        <Routes>
          <Route
            path='/portal'
            element={
              <RequirePatient>
                <div>CONTENIDO PRIVADO</div>
              </RequirePatient>
            }
          />
          <Route path='/ingresar' element={<div>LOGIN PAGE</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('RequirePatient', () => {
  it('renders children with a session', () => {
    renderGuard('tok')
    expect(screen.getByText('CONTENIDO PRIVADO')).toBeInTheDocument()
  })

  it('redirects to /ingresar without a session', () => {
    renderGuard(null)
    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument()
    expect(screen.queryByText('CONTENIDO PRIVADO')).not.toBeInTheDocument()
  })
})
