import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import PortalSearch from '../PortalSearch'
import portalReducer from '../../../features/portal/portalSlice'
import portalApi from '../../../services/portalApi'

jest.mock('../../../services/portalApi', () => ({
  __esModule: true,
  default: {
    search: jest.fn(),
    markViewed: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    fetchLibrary: jest.fn(),
    fetchCategory: jest.fn(),
    setPassword: jest.fn(),
    requestReset: jest.fn(),
  },
  getToken: () => 'tok',
  getStoredPatient: () => ({ id: 5, name: 'Agustín' }),
  storeSession: jest.fn(),
  clearSession: jest.fn(),
}))

const RESULTS = {
  query: 'prote',
  unlocked: [
    { id: 1, title: 'Guía de proteínas', content_type: 'pdf', type_label: 'Guía · PDF', file_url: '/a.pdf', viewed: true, category_name: 'Deporte', category_icon: '🏃' },
  ],
  locked: [
    { id: 9, title: 'Proteínas avanzado', content_type: 'video', type_label: 'Video · 10 min', locked: true, category_name: 'Deporte', category_icon: '🏃' },
  ],
}

function renderSearch() {
  jest.useFakeTimers()
  const store = configureStore({ reducer: { portal: portalReducer } })
  render(
    <Provider store={store}>
      <MemoryRouter>
        <PortalSearch />
      </MemoryRouter>
    </Provider>
  )
  return store
}

describe('PortalSearch (Fase D)', () => {
  afterEach(() => jest.useRealTimers())

  it('busca con debounce y muestra desbloqueados y bloqueados', async () => {
    portalApi.search.mockResolvedValue(RESULTS)
    renderSearch()

    fireEvent.change(screen.getByLabelText('Buscar material'), {
      target: { value: 'prote' },
    })
    expect(portalApi.search).not.toHaveBeenCalled() // debounce

    await require('@testing-library/react').act(async () => {
      jest.advanceTimersByTime(300)
    })

    expect(portalApi.search).toHaveBeenCalledWith('prote')
    expect(await screen.findByText('Guía de proteínas')).toBeInTheDocument()
    expect(screen.getByText('✓ Visto')).toBeInTheDocument()
    // el bloqueado linkea a la tienda como upsell
    const locked = screen.getByRole('link', { name: /Proteínas avanzado/ })
    expect(locked).toHaveAttribute('href', '/tienda')
  })

  it('no busca con menos de 2 caracteres', async () => {
    portalApi.search.mockResolvedValue(RESULTS)
    renderSearch()

    fireEvent.change(screen.getByLabelText('Buscar material'), {
      target: { value: 'p' },
    })
    await require('@testing-library/react').act(async () => {
      jest.advanceTimersByTime(400)
    })
    expect(portalApi.search).not.toHaveBeenCalled()
  })
})
