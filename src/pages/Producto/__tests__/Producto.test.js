import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Producto from '../Producto'
import productsReducer from '../../../features/products'
import cartReducer from '../../../features/cart/cartSlice'
import stepReducer from '../../../features/stepsCheckout/stepsSlice'

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
  important_note: 'o 3 cuotas de $185.000',
  price: 499000,
  active_promo: false,
  promo_price: null,
  stock: 50,
  category: 'Programa online',
  thumbnail: '/img/tienda/metodo-regula.png',
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
  thumbnail: '/img/x.png',
}

describe('Producto', () => {
  it('renders the full landing for Método Regula', () => {
    renderProducto(METODO)
    expect(
      screen.getByRole('heading', { name: /esfuerzo constante por comer mejor/ })
    ).toBeInTheDocument()
    // navy philosophy band
    expect(screen.getByText('Por eso creé Método Regula.')).toBeInTheDocument()
    // checklist
    expect(screen.getByText('Plan de alimentación personalizado')).toBeInTheDocument()
    // purchase block with live price + badge + note
    expect(screen.getByText('Cupos limitados')).toBeInTheDocument()
    expect(screen.getByText(/499\.000/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Empezar Método Regula' })
    ).toBeInTheDocument()
  })

  it('falls back to a generic detail for unknown products', () => {
    renderProducto(GENERIC)
    expect(screen.getByRole('heading', { name: GENERIC.name })).toBeInTheDocument()
    expect(screen.getByText(GENERIC.description)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Agregar al carrito' })
    ).toBeInTheDocument()
    expect(screen.getByText(/15\.000/)).toBeInTheDocument()
  })

  it('adds the product to the cart from the purchase block', () => {
    const store = renderProducto(METODO)
    screen.getByRole('button', { name: 'Empezar Método Regula' }).click()
    expect(store.getState().cart.cartItems).toHaveLength(1)
  })
})
