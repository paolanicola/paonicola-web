import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import Tienda from '../Tienda'
import productsReducer from '../../../features/products'
import cartReducer from '../../../features/cart/cartSlice'
import stepReducer from '../../../features/stepsCheckout/stepsSlice'

jest.mock('axios')

const PRODUCTS = [
  {
    id: 1,
    name: 'Método Regula — programa 1 a 1 de 12 semanas',
    description: 'Consulta inicial, plan personalizado y seguimiento mensual.',
    important_note: '',
    price: 499000,
    price_usd: 350,
    installments_count: 3,
    installment_price: 185000,
    installment_price_usd: 125,
    active_promo: false,
    promo_price: null,
    download_url: null,
    stock: 50,
    category: 'Programa online',
    requires_appointment: true,
    tienda_badge: 'Más elegido',
    thumbnail: '/img/tienda/metodo-regula.png',
  },
  {
    id: 2,
    name: 'Acceso a la biblioteca de material',
    description: 'Incluida sin cargo mientras seas paciente activa.',
    important_note: 'o USD 50/mes desde el exterior',
    price: 49999,
    active_promo: false,
    promo_price: null,
    download_url: null,
    stock: 999,
    category: 'Membresía',
    requires_appointment: false,
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
    requires_appointment: false,
    thumbnail: '/img/tienda/kit-rendimiento.png',
  },
  {
    id: 4,
    name: 'Reset intestinal — guía de 21 días',
    description: 'Seis etapas para bajar la hinchazón.',
    price: 32000,
    active_promo: true,
    promo_price: 26000,
    download_url: null,
    stock: 999,
    category: 'PDF descargable',
    requires_appointment: false,
    thumbnail: '/img/tienda/reset-intestinal.png',
  },
  {
    id: 5,
    name: 'Compras saludables e inteligentes',
    description: 'Guía para elegir mejor en el supermercado',
    price: 0,
    active_promo: false,
    promo_price: null,
    download_url: '/descargables/compras-saludables.pdf',
    stock: 999,
    category: 'Descargable gratuito',
    requires_appointment: false,
    thumbnail: '/img/tienda/compras.png',
  },
]

function renderTienda(products = PRODUCTS, overrides = {}) {
  // el store real corre el middleware de API; acá sólo anotamos las acciones
  // para poder afirmar que se pidió el catálogo de nuevo
  const recorded = []
  const recorder = () => (next) => (action) => {
    recorded.push(action)
    return next(action)
  }
  const store = configureStore({
    middleware: (getDefault) => getDefault().concat(recorder),
    reducer: { products: productsReducer, cart: cartReducer, step: stepReducer },
    preloadedState: {
      products: {
        allProducts: products,
        productsAvailable: products,
        currentProduct: null,
        filterCategory: '',
        orderProducts: '',
        loading: false,
        loadingProduct: false,
        loadSuccess: true,
        success: true,
        failed: false,
        productFailed: false,
        ...overrides,
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
  store.recorded = recorded
  return store
}

const cardNamed = (text) =>
  screen.getAllByTestId('tienda-card').find((el) => el.textContent.includes(text))

describe('Tienda (grilla de tarjetas)', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] })
  })

  it('renders the header and one card per product', () => {
    renderTienda()
    expect(
      screen.getByRole('heading', { name: 'Elegí cómo empezar' })
    ).toBeInTheDocument()
    expect(screen.getAllByTestId('tienda-card')).toHaveLength(PRODUCTS.length)
  })

  it('orders the grid by the design category order, not the API order', () => {
    // la API devuelve el descargable primero; el diseño lo quiere último
    renderTienda([PRODUCTS[4], PRODUCTS[2], PRODUCTS[0]])
    const names = screen
      .getAllByTestId('tienda-card')
      .map((el) => el.querySelector('.tienda-card__name').textContent)
    expect(names).toEqual([
      'Método Regula — programa 1 a 1 de 12 semanas',
      'Kit Rendimiento Inteligente',
      'Compras saludables e inteligentes',
    ])
  })

  it('builds the filter chips from the real catalog categories', () => {
    renderTienda()
    const chips = screen
      .getByRole('group', { name: 'Filtrar por categoría' })
      .querySelectorAll('button')
    expect([...chips].map((c) => c.textContent)).toEqual([
      'Todo',
      'Programa online',
      'Membresía',
      'Kits',
      'PDF descargable',
      'Descargable gratuito',
    ])
  })

  it('filters the grid by category', () => {
    renderTienda()
    fireEvent.click(screen.getByRole('button', { name: 'Kits' }))
    expect(screen.getAllByTestId('tienda-card')).toHaveLength(1)
    expect(cardNamed('Kit Rendimiento Inteligente')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Todo' }))
    expect(screen.getAllByTestId('tienda-card')).toHaveLength(PRODUCTS.length)
  })

  it('shows a chip for a category the admin invented, at the end', () => {
    renderTienda([...PRODUCTS, { ...PRODUCTS[2], id: 9, name: 'Taller de cocina', category: 'Talleres' }])
    const chips = [
      ...screen
        .getByRole('group', { name: 'Filtrar por categoría' })
        .querySelectorAll('button'),
    ].map((c) => c.textContent)
    expect(chips[chips.length - 1]).toBe('Talleres')
    expect(cardNamed('Taller de cocina')).toBeDefined()
  })

  it('renders the thumbnail and links image and title to the detail page', () => {
    renderTienda()
    const card = cardNamed('Kit Rendimiento Inteligente')
    const img = card.querySelector('img')
    expect(img).toHaveAttribute('src', '/img/tienda/kit-rendimiento.png')
    expect(img).toHaveAttribute('alt', 'Kit Rendimiento Inteligente')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img.closest('a')).toHaveAttribute('href', '/producto/3')
    expect(card.querySelector('.tienda-card__name')).toHaveAttribute(
      'href',
      '/producto/3'
    )
  })

  it('shows the badge Pao set in the admin', () => {
    renderTienda()
    expect(
      within(cardNamed('Método Regula')).getByText('Más elegido')
    ).toBeInTheDocument()
  })

  it('replaces the photo with the key block on the membership card', () => {
    renderTienda()
    const card = cardNamed('Acceso a la biblioteca')
    expect(card.querySelector('.tienda-card__icon')).toHaveTextContent('🗝️')
    expect(card.querySelector('img')).toBeNull()
    expect(within(card).getByText('/mes')).toBeInTheDocument()
    expect(within(card).getByText('mensual')).toBeInTheDocument()
  })

  it('shows promo strikethrough pricing', () => {
    renderTienda()
    const card = cardNamed('Kit Rendimiento Inteligente')
    expect(within(card).getByText('$ 48.000')).toHaveClass('tienda-price__original')
    expect(within(card).getByText(/39\.990/)).toBeInTheDocument()
  })

  it('renders a direct download link for free downloadables', () => {
    renderTienda()
    const card = cardNamed('Compras saludables')
    expect(within(card).getByText('Gratis')).toBeInTheDocument()
    const link = within(card).getByRole('link', { name: 'Descargar' })
    expect(link).toHaveAttribute('href', '/descargables/compras-saludables.pdf')
  })

  it('crops the vertical guide covers from the top', () => {
    renderTienda()
    expect(
      cardNamed('Compras saludables').querySelector('.tienda-card__media--top')
    ).toBeInTheDocument()
    expect(
      cardNamed('Kit Rendimiento').querySelector('.tienda-card__media--top')
    ).toBeNull()
  })

  describe('selector de región', () => {
    it('only appears on products with a USD price', () => {
      renderTienda()
      expect(
        within(cardNamed('Método Regula')).getByRole('button', { name: 'Argentina' })
      ).toBeInTheDocument()
      expect(
        within(cardNamed('Kit Rendimiento')).queryByRole('button', { name: 'Argentina' })
      ).toBeNull()
    })

    it('starts on Argentina and switches the price and installments', () => {
      renderTienda()
      const card = cardNamed('Método Regula')
      expect(within(card).getByRole('button', { name: 'Argentina' })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(within(card).getByText('$ 499.000')).toBeInTheDocument()
      expect(within(card).getByText('o 3 cuotas de $ 185.000')).toBeInTheDocument()

      fireEvent.click(within(card).getByRole('button', { name: 'Exterior' }))
      expect(within(card).getByText('USD 350')).toBeInTheDocument()
      expect(within(card).getByText('o 3 cuotas de USD 125')).toBeInTheDocument()
    })
  })

  it('opens the direct-buy modal instead of touching the cart', () => {
    const store = renderTienda()
    fireEvent.click(
      within(cardNamed('Kit Rendimiento Inteligente')).getByRole('button', {
        name: 'Agregar',
      })
    )
    expect(screen.getByTestId('compra-directa')).toBeInTheDocument()
    expect(screen.getByText('Compra directa · sin carrito')).toBeInTheDocument()
    expect(store.getState().cart.cartItems).toHaveLength(0)
  })

  it('opens the calendar step for the 1:1 program', () => {
    renderTienda()
    fireEvent.click(
      within(cardNamed('Método Regula')).getByRole('button', { name: 'Agregar' })
    )
    expect(screen.getByText('Elegí tu primer turno')).toBeInTheDocument()
    expect(screen.getByText('Paso 1 de 2')).toBeInTheDocument()
  })

  it('cerrar el modal de compra devuelve a la tienda', () => {
    renderTienda()
    fireEvent.click(
      within(cardNamed('Kit Rendimiento Inteligente')).getByRole('button', {
        name: 'Agregar',
      })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByTestId('compra-directa')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('tienda-card')).toHaveLength(PRODUCTS.length)
  })

  it('muestra el skeleton mientras carga, con el header ya puesto', () => {
    renderTienda([], { loading: true, loadSuccess: false, success: false })
    expect(screen.getByTestId('tienda-skeleton')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Elegí cómo empezar' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Todo' })).toBeDisabled()
  })

  // `loading` arranca en false: el primer paint mostraba una tienda vacía
  it('muestra el skeleton en el primer paint, antes de que arranque el fetch', () => {
    renderTienda([], { loading: false, loadSuccess: false, success: false })
    expect(screen.getByTestId('tienda-skeleton')).toBeInTheDocument()
  })

  it('muestra el error con botón de reintento', () => {
    const store = renderTienda([], {
      loading: false,
      loadSuccess: false,
      success: false,
      failed: true,
    })
    expect(screen.getByRole('alert')).toHaveTextContent(/Contactarse al/)
    expect(screen.queryByTestId('tienda-skeleton')).not.toBeInTheDocument()

    store.recorded.length = 0
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    const calls = store.recorded.filter((a) => a.type === 'api/callBegan')
    expect(calls).toHaveLength(1)
    expect(calls[0].payload.url).toMatch(/\/products$/)
  })

  it('avisa cuando no hay productos en vez de dejar la página vacía', () => {
    renderTienda([])
    expect(
      screen.getByText('No hay productos en esta categoría por ahora.')
    ).toBeInTheDocument()
  })

  // el producto sin precio cargado en el admin rompía el render de la tienda
  it('no explota con un producto sin precio', () => {
    renderTienda([
      {
        ...PRODUCTS[2],
        id: 8,
        name: 'Sin precio',
        price: null,
        active_promo: false,
        promo_price: null,
      },
    ])
    const card = cardNamed('Sin precio')
    expect(card).toBeDefined()
    expect(card.querySelector('.tienda-price')).toBeNull()
  })
})
