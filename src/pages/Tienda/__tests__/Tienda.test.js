import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Tienda from '../Tienda'
import productsReducer from '../../../features/products'
import cartReducer from '../../../features/cart/cartSlice'
import stepReducer from '../../../features/stepsCheckout/stepsSlice'

const PRODUCTS = [
  {
    id: 1,
    name: 'Método Regula — programa 1 a 1 de 12 semanas',
    description: 'Consulta inicial, plan personalizado.',
    important_note: 'o 3 cuotas de $185.000',
    price: 499000,
    active_promo: false,
    promo_price: null,
    download_url: null,
    stock: 50,
    category: 'Programa online',
    thumbnail: '/img/tienda/metodo-regula.png',
  },
  {
    id: 2,
    name: 'Acceso a la biblioteca de material',
    description: 'Incluida sin cargo mientras seas paciente activa.',
    important_note: 'o USD 50/mes si residís en el exterior',
    price: 49999,
    active_promo: false,
    promo_price: null,
    download_url: null,
    stock: 999,
    category: 'Membresía',
    thumbnail: '/img/tienda/habitos.png',
  },
  {
    id: 3,
    name: 'Kit Rendimiento Inteligente',
    description: 'Nutrición deportiva práctica.',
    price: 48000,
    active_promo: true,
    promo_price: 39990,
    download_url: null,
    stock: 999,
    category: 'Kits',
    thumbnail: '/img/tienda/kit-rendimiento.png',
  },
  {
    id: 4,
    name: 'Compras saludables e inteligentes',
    description: 'Guía para elegir mejor en el supermercado',
    price: 0,
    active_promo: false,
    promo_price: null,
    download_url: '/descargables/compras-saludables.pdf',
    stock: 999,
    category: 'Descargable gratuito',
    thumbnail: '/img/tienda/compras.png',
  },
]

function renderTienda() {
  const store = configureStore({
    reducer: { products: productsReducer, cart: cartReducer, step: stepReducer },
    preloadedState: {
      products: {
        allProducts: PRODUCTS,
        productsAvailable: PRODUCTS,
        currentProduct: null,
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
      <MemoryRouter>
        <Tienda />
      </MemoryRouter>
    </Provider>
  )
  return store
}

describe('Tienda', () => {
  it('renders header and one section per category', () => {
    renderTienda()
    expect(
      screen.getByRole('heading', { name: 'Elegí cómo empezar' })
    ).toBeInTheDocument()
    expect(screen.getByTestId('tienda-featured')).toBeInTheDocument()
    expect(screen.getByTestId('tienda-membership')).toBeInTheDocument()
    expect(screen.getAllByTestId('tienda-row')).toHaveLength(2) // kit + descargable
  })

  it('shows the installments note on the featured program', () => {
    renderTienda()
    expect(screen.getByText('o 3 cuotas de $185.000')).toBeInTheDocument()
  })

  it('shows promo strikethrough pricing on kits', () => {
    renderTienda()
    expect(screen.getByText('$ 48.000')).toBeInTheDocument() // original
    expect(screen.getByText(/39\.990/)).toBeInTheDocument() // promo
  })

  it('renders a direct download link for free downloadables', () => {
    renderTienda()
    const link = screen.getByRole('link', { name: 'Descargar' })
    expect(link).toHaveAttribute('href', '/descargables/compras-saludables.pdf')
  })

  it('filters sections through the chips', () => {
    renderTienda()
    fireEvent.click(screen.getByRole('button', { name: 'Kits' }))
    expect(screen.queryByTestId('tienda-featured')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('tienda-row')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Todo' }))
    expect(screen.getByTestId('tienda-featured')).toBeInTheDocument()
  })

  it('adds a product to the cart', () => {
    const store = renderTienda()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
    expect(store.getState().cart.cartItems).toHaveLength(1)
    expect(store.getState().cart.cartItems[0].id).toBe(1)
  })
})
