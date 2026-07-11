import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Portal from '../Portal'
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
  getToken: () => 'tok',
  getStoredPatient: () => ({ id: 5, name: 'Agustín' }),
  storeSession: jest.fn(),
  clearSession: jest.fn(),
}))

const LIBRARY = {
  patient: { id: 5, name: 'Agustín' },
  full_access: false,
  overall: { viewed: 1, total: 4, percent: 25 },
  recommended: { id: 4, title: 'Recetario proteico práctico', file_url: '/x.pdf' },
  last_viewed: { id: 1, title: 'Mini guía de Timing Nutricional', file_url: '/y.pdf' },
  categories: [
    { id: 1, name: 'Deporte', icon: '🏃', resource_count: 6, unlocked: true, viewed_count: 1 },
    { id: 2, name: 'Ansiedad', icon: '🌊', resource_count: 5, unlocked: false, viewed_count: 0 },
  ],
}

function renderPortal(library = LIBRARY) {
  portalApi.fetchLibrary.mockResolvedValue(library)
  const store = configureStore({ reducer: { portal: portalReducer } })
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Portal />
      </MemoryRouter>
    </Provider>
  )
  return store
}

describe('Portal (8a/18a)', () => {
  it('greets the patient with overall progress', async () => {
    renderPortal()
    expect(
      await screen.findByRole('heading', { name: /Hola, Agustín/ })
    ).toBeInTheDocument()
    expect(screen.getByText(/25% del material recomendado/)).toBeInTheDocument()
  })

  it('renders unlocked and locked categories with candado', async () => {
    renderPortal()
    const cards = await screen.findAllByTestId('portal-category')
    expect(cards).toHaveLength(2)
    expect(cards[0]).toHaveTextContent('Deporte')
    expect(cards[0]).toHaveTextContent('Desbloqueada')
    expect(cards[1]).toHaveTextContent('Ansiedad')
    expect(cards[1]).toHaveTextContent('🔒')
  })

  it('shows the recommended material and the upsell when locked categories exist', async () => {
    renderPortal()
    expect(await screen.findByText('Recetario proteico práctico')).toBeInTheDocument()
    expect(screen.getByText(/acceso a toda la biblioteca/)).toBeInTheDocument()
  })

  it('hides the upsell for full-access patients', async () => {
    renderPortal({
      ...LIBRARY,
      full_access: true,
      categories: LIBRARY.categories.map((c) => ({ ...c, unlocked: true })),
    })
    await screen.findAllByTestId('portal-category')
    expect(screen.queryByText(/acceso a toda la biblioteca/)).not.toBeInTheDocument()
  })
})
