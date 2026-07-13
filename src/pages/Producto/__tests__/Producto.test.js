import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import Producto from '../Producto'
import productsReducer from '../../../features/products'
import cartReducer from '../../../features/cart/cartSlice'
import stepReducer from '../../../features/stepsCheckout/stepsSlice'

jest.mock('axios')

function renderProducto(currentProduct) {
  const store = configureStore({
    reducer: { products: productsReducer, cart: cartReducer, step: stepReducer },
    preloadedState: {
      products: {
        allProducts: [],
        productsAvailable: [],
        currentProduct,
        filterCategory: '',
        orderProducts: '',
        loading: false,
        loadingProduct: false,
        loadSuccess: true,
        success: true,
        failed: false,
      },
      cart: { cartItems: [], cartTotalQuantity: 0, cartTotalAmount: 0 },
    },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/producto/${currentProduct.id}`]}>
        <Routes>
          <Route path='/producto/:productId' element={<Producto />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
  return store
}

const METODO = {
  id: 1,
  name: 'Método Regula — programa 1 a 1 de 12 semanas',
  description: 'desc',
  important_note: 'pago único',
  price: 499000,
  active_promo: false,
  promo_price: null,
  stock: 50,
  category: 'Programa online',
  requires_appointment: true,
  thumbnail: '/img/tienda/metodo-regula.png',
}

const GRUPAL = {
  id: 5,
  name: 'Programa Grupal Regula',
  description: 'Programa grupal de 4 semanas.',
  important_note: 'Precio especial primera edición',
  price: 99000,
  active_promo: false,
  promo_price: null,
  stock: 12,
  category: 'Programa online',
  requires_appointment: false,
  thumbnail: '/img/tienda/grupal.png',
}

const GENERIC = {
  id: 9,
  name: 'Consulta de seguimiento',
  description: 'Una consulta de control.',
  important_note: null,
  price: 15000,
  active_promo: false,
  promo_price: null,
  stock: 10,
  category: 'Consultas Online',
  requires_appointment: false,
  thumbnail: '/img/x.png',
}

describe('Producto (Tienda Rediseño)', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] })
  })

  it('renders the full landing for Método Regula', () => {
    renderProducto(METODO)
    expect(
      screen.getByRole('heading', { name: /esfuerzo constante por comer mejor/ })
    ).toBeInTheDocument()
    // navy philosophy band
    expect(screen.getByText('Por eso creé Método Regula.')).toBeInTheDocument()
    // includes cards con detalle
    expect(screen.getByText('Plan de alimentación personalizado')).toBeInTheDocument()
    expect(
      screen.getByText(/Armado sobre tu vida real/)
    ).toBeInTheDocument()
    // testimonios + FAQ + cierre
    expect(screen.getByText('Cambios reales')).toBeInTheDocument()
    expect(screen.getByText('Preguntas frecuentes')).toBeInTheDocument()
    expect(
      screen.getByText('12 semanas para dejar de empezar de nuevo cada lunes.')
    ).toBeInTheDocument()
    // hero CTA + sticky
    expect(screen.getByTestId('hero-buy')).toHaveTextContent('Empezar Método Regula')
    expect(screen.getByTestId('producto-sticky')).toBeInTheDocument()
  })

  it('renders the grupal landing with checklist and cross link', () => {
    renderProducto(GRUPAL)
    expect(
      screen.getByRole('heading', { name: /piloto automático/ })
    ).toBeInTheDocument()
    expect(screen.getByText('Este programa es para vos si…')).toBeInTheDocument()
    expect(screen.getByText('4 encuentros grupales en vivo')).toBeInTheDocument()
    expect(screen.getByText('Conocé el Método Regula 1:1 →')).toBeInTheDocument()
    // CTA en hero y en cierre navy
    expect(
      screen.getAllByRole('button', { name: 'Sumarme al grupal' })
    ).toHaveLength(2)
  })

  it('falls back to a generic detail for unknown products', () => {
    renderProducto(GENERIC)
    expect(screen.getByRole('heading', { name: GENERIC.name })).toBeInTheDocument()
    expect(screen.getByText(GENERIC.description)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Comprar' })).toBeInTheDocument()
    expect(screen.getByText(/15\.000/)).toBeInTheDocument()
  })

  it('opens the direct-buy modal with calendar for the 1:1', () => {
    renderProducto(METODO)
    fireEvent.click(screen.getByTestId('hero-buy'))
    expect(screen.getByTestId('compra-directa')).toBeInTheDocument()
    expect(screen.getByText('Elegí tu primer turno')).toBeInTheDocument()
  })

  it('opens the direct-buy modal without calendar for the grupal', () => {
    const store = renderProducto(GRUPAL)
    fireEvent.click(screen.getByTestId('hero-buy'))
    expect(screen.getByText('Compra directa · sin carrito')).toBeInTheDocument()
    // nunca toca el carrito legacy
    expect(store.getState().cart.cartItems).toHaveLength(0)
  })
})
