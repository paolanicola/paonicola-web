import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import PortalCategoria from '../PortalCategoria'
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

const CATEGORY = {
  category: { id: 1, name: 'Deporte', icon: '🏃', description: 'Incluye lo de tu kit.' },
  progress: { viewed: 1, total: 4 },
  unlocked: [
    { id: 1, title: 'Mini guía de Timing Nutricional', content_type: 'pdf', type_label: 'Guía · PDF', file_url: '/a.pdf', viewed: true },
    { id: 2, title: 'Cálculo personalizado de proteínas', content_type: 'planilla', type_label: 'Planilla', file_url: '/b.pdf', viewed: false },
  ],
  locked: [
    { id: 5, title: 'Suplementación deportiva: qué sirve y qué no', content_type: 'video', type_label: 'Video · 10 min', locked: true },
  ],
}

function renderCategoria(category = CATEGORY) {
  portalApi.fetchCategory.mockResolvedValue(category)
  const store = configureStore({ reducer: { portal: portalReducer } })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/portal/categoria/1']}>
        <Routes>
          <Route path='/portal/categoria/:categoryId' element={<PortalCategoria />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
  return store
}

describe('PortalCategoria (9a/19a)', () => {
  it('renders header, description and progress', async () => {
    renderCategoria()
    expect(await screen.findByRole('heading', { name: 'Deporte' })).toBeInTheDocument()
    expect(screen.getByText('Incluye lo de tu kit.')).toBeInTheDocument()
    expect(screen.getByText('1 de 4 completados')).toBeInTheDocument()
  })

  it('splits unlocked rows (with estado) from locked rows (candado)', async () => {
    renderCategoria()
    expect(await screen.findAllByTestId('portal-resource')).toHaveLength(2)
    expect(screen.getByText('✓ Visto')).toBeInTheDocument()
    expect(screen.getByText('Sin ver')).toBeInTheDocument()
    expect(screen.getAllByTestId('portal-resource-locked')).toHaveLength(1)
    expect(screen.getByText(/Desbloqueá todo el contenido de Deporte/)).toBeInTheDocument()
    expect(screen.getByText('Incluido en tu compra')).toBeInTheDocument()
  })

  it('omits the "Incluido en tu compra" kicker when nothing is locked', async () => {
    renderCategoria({ ...CATEGORY, locked: [] })
    expect(await screen.findAllByTestId('portal-resource')).toHaveLength(2)
    expect(screen.queryByText('Incluido en tu compra')).not.toBeInTheDocument()
  })
})
