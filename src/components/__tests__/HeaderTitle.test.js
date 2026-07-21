import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import HeaderTitle from '../HeaderTitle/HeaderTitle'
import cartReducer from '../../features/cart/cartSlice'

function renderAt(path) {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: {
      cart: { cartItems: [], cartTotalQuantity: 0, cartTotalAmount: 0 },
    },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <HeaderTitle />
      </MemoryRouter>
    </Provider>
  )
}

describe('HeaderTitle', () => {
  it.each([
    '/',
    '/tienda',
    '/producto/1',
    '/carrito',
    '/checkout',
    '/portal',
    '/ingresar',
    '/contacto',
    '/faq',
  ])('suppresses the legacy band on redesigned route %s', (path) => {
    renderAt(path)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('still shows the band on legacy routes', () => {
    // cambios-reales sigue sin rediseñar
    renderAt('/cambios-reales')
    expect(
      screen.getByRole('heading', { name: 'Cambios Reales' })
    ).toBeInTheDocument()
  })

  it('formats multi-word slugs', () => {
    renderAt('/cambios-reales')
    expect(screen.getByRole('heading', { name: 'Cambios Reales' })).toBeInTheDocument()
  })
})
