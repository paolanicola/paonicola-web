import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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
    description: 'Acompañamiento personalizado de 12 semanas.',
    important_note: 'pago único',
    price: 499000,
    active_promo: false,
    promo_price: null,
    download_url: null,
    stock: 50,
    category: 'Programa online',
    requires_appointment: true,
    tienda_style: 'destacado',
    tienda_badge: 'Más elegido',
    tienda_kicker: 'Programa 1 a 1 · 12 semanas',
    tienda_tagline: 'La improvisación termina acá.',
    thumbnail: '/img/tienda/metodo-regula.png',
  },
  {
    id: 5,
    name: 'Programa Grupal Regula',
    description: 'Regulá tu alimentación, tu estrés y tu energía en 4 semanas.',
    important_note: 'Precio especial primera edición',
    price: 99000,
    active_promo: false,
    promo_price: null,
    download_url: null,
    stock: 12,
    category: 'Programa online',
    requires_appointment: false,
    tienda_style: 'banda',
    tienda_kicker: 'Programa grupal · 4 semanas',
    landing: { heroCta: 'Sumarme al grupal' },
    thumbnail: '/img/tienda/grupal.png',
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

describe('Tienda (Tienda Rediseño)', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] })
  })

  it('renders header and the design sections', () => {
    renderTienda()
    expect(
      screen.getByRole('heading', { name: 'Elegí cómo empezar' })
    ).toBeInTheDocument()
    expect(screen.getByTestId('tienda-featured')).toBeInTheDocument()
    expect(screen.getByTestId('tienda-grupal')).toBeInTheDocument()
    expect(screen.getByTestId('tienda-membership')).toBeInTheDocument()
    expect(screen.getAllByTestId('tienda-kit')).toHaveLength(1)
    expect(screen.getAllByTestId('tienda-row')).toHaveLength(1) // descargable
  })

  // Regresión: los kits y la banda grupal se renderizaban sin <img>, así que en
  // la tienda sólo se veía la foto del destacado (bug reportado 2026-07-19).
  it('renders the thumbnail on every card of every section', () => {
    renderTienda()
    const withImage = [
      ['tienda-featured', '/img/tienda/metodo-regula.png'],
      ['tienda-grupal', '/img/tienda/grupal.png'],
      ['tienda-row', '/img/tienda/compras.png'],
    ]
    withImage.forEach(([testId, src]) => {
      const img = screen.getByTestId(testId).querySelector('img')
      expect(img).toHaveAttribute('src', src)
      expect(img).toHaveAttribute('alt', expect.stringMatching(/\S/))
    })
    const kitImg = screen.getAllByTestId('tienda-kit')[0].querySelector('img')
    expect(kitImg).toHaveAttribute('src', '/img/tienda/kit-rendimiento.png')
    expect(kitImg).toHaveAttribute('alt', 'Kit Rendimiento Inteligente')
  })

  it('links the card image to the product detail', () => {
    renderTienda()
    const kitLink = screen.getAllByTestId('tienda-kit')[0].querySelector('a img')
      ?.parentElement
    expect(kitLink).toHaveAttribute('href', '/producto/3')
    const grupalLink = screen.getByTestId('tienda-grupal').querySelector('a img')
      ?.parentElement
    expect(grupalLink).toHaveAttribute('href', '/producto/5')
  })

  it('lazy-loads the below-the-fold card images', () => {
    renderTienda()
    const kitImg = screen.getAllByTestId('tienda-kit')[0].querySelector('img')
    expect(kitImg).toHaveAttribute('loading', 'lazy')
  })

  it('shows the payment note and cupos on programas', () => {
    renderTienda()
    expect(screen.getByText('pago único')).toBeInTheDocument()
    expect(screen.getByText('Quedan 12 cupos')).toBeInTheDocument()
  })

  it('shows promo strikethrough pricing on kits', () => {
    renderTienda()
    expect(screen.getByText('$ 48.000')).toBeInTheDocument() // original
    expect(screen.getByText(/39\.990/)).toBeInTheDocument() // promo
  })

  it('renders a direct download link for free downloadables', () => {
    renderTienda()
    const link = screen.getByRole('link', { name: 'Descargar gratis' })
    expect(link).toHaveAttribute('href', '/descargables/compras-saludables.pdf')
  })

  it('filters sections through the design chips', () => {
    renderTienda()
    fireEvent.click(screen.getByRole('button', { name: 'Kits' }))
    expect(screen.queryByTestId('tienda-featured')).not.toBeInTheDocument()
    expect(screen.queryByTestId('tienda-membership')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('tienda-kit')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Programas' }))
    expect(screen.getByTestId('tienda-featured')).toBeInTheDocument()
    expect(screen.getByTestId('tienda-grupal')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Gratis' }))
    expect(screen.getAllByTestId('tienda-row')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Todo' }))
    expect(screen.getByTestId('tienda-membership')).toBeInTheDocument()
  })

  it('opens the direct-buy modal from a kit (paso 2, sin calendario)', () => {
    renderTienda()
    fireEvent.click(screen.getByRole('button', { name: 'Comprar' }))
    expect(screen.getByTestId('compra-directa')).toBeInTheDocument()
    expect(screen.getByText('Compra directa · sin carrito')).toBeInTheDocument()
    expect(screen.getByTestId('cd-pay')).toBeDisabled() // sin datos aún
  })

  it('opens the calendar step for the 1:1 program', () => {
    renderTienda()
    fireEvent.click(screen.getByRole('button', { name: 'Empezar ahora' }))
    expect(screen.getByTestId('compra-directa')).toBeInTheDocument()
    expect(screen.getByText('Elegí tu primer turno')).toBeInTheDocument()
    expect(screen.getByText('Paso 1 de 2')).toBeInTheDocument()
  })

  it('respeta el estilo elegido en el admin (banda para el 1:1, destacado para el grupal)', () => {
    renderTienda(
      PRODUCTS.map((p) => {
        if (p.id === 1) return { ...p, tienda_style: 'banda' }
        if (p.id === 5) return { ...p, tienda_style: 'destacado' }
        return p
      })
    )
    // la banda navy ahora es el Método 1:1 y la tarjeta blanca el grupal
    expect(screen.getByTestId('tienda-grupal')).toHaveTextContent('Método Regula')
    expect(screen.getByTestId('tienda-featured')).toHaveTextContent('Programa Grupal Regula')
  })

  it('sin tienda_style, destaca el programa con primer turno', () => {
    // fallback de ProgramasSection para catálogos viejos del admin
    renderTienda(PRODUCTS.map(({ tienda_style, ...p }) => p))
    expect(screen.getByTestId('tienda-featured')).toHaveTextContent('Método Regula')
    expect(screen.queryByTestId('tienda-grupal')).not.toBeInTheDocument()
  })

  it('los programas que no son destacado ni banda caen a filas con foto', () => {
    const extra = {
      ...PRODUCTS[1],
      id: 9,
      name: 'Programa Express',
      tienda_style: null,
      requires_appointment: false,
      thumbnail: '/img/tienda/express.png',
    }
    renderTienda([...PRODUCTS, extra])
    const row = screen
      .getAllByTestId('tienda-row')
      .find((el) => el.textContent.includes('Programa Express'))
    expect(row).toBeDefined()
    expect(row.querySelector('img')).toHaveAttribute('src', '/img/tienda/express.png')
  })

  it('una categoría desconocida del admin se muestra como filas genéricas', () => {
    renderTienda([
      ...PRODUCTS,
      { ...PRODUCTS[3], id: 10, name: 'Taller de cocina', category: 'Talleres' },
    ])
    const row = screen
      .getAllByTestId('tienda-row')
      .find((el) => el.textContent.includes('Taller de cocina'))
    expect(row).toBeDefined()
    expect(row.querySelector('img')).toBeInTheDocument()
  })

  it('muestra el skeleton mientras carga, con el header ya puesto', () => {
    renderTienda([], { loading: true, loadSuccess: false, success: false })
    expect(screen.getByTestId('tienda-skeleton')).toBeInTheDocument()
    // header y chips quedan para que la página no colapse de alto
    expect(
      screen.getByRole('heading', { name: 'Elegí cómo empezar' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kits' })).toBeDisabled()
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

    // reintentar vuelve a pedir el catálogo (el reducer limpia `failed` en
    // productsRequested — cubierto en features/products/index.test.js)
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

  it('cerrar el modal de compra devuelve a la tienda', () => {
    renderTienda()
    fireEvent.click(screen.getAllByRole('button', { name: 'Comprar' })[0])
    expect(screen.getByTestId('compra-directa')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByTestId('compra-directa')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('tienda-kit')).toHaveLength(1)
  })

  it('never adds to the legacy cart', () => {
    const store = renderTienda()
    fireEvent.click(screen.getAllByRole('button', { name: 'Comprar' })[0])
    expect(store.getState().cart.cartItems).toHaveLength(0)
  })
})
