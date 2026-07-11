import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Cart from '../Cart'
import cartReducer from '../../../features/cart/cartSlice'
import stepReducer from '../../../features/stepsCheckout/stepsSlice'
import checkoutReducer from '../../../features/checkout/checkoutSlice'
import validatorsReducer from '../../../features/validators'

const ITEM = {
  id: 3,
  name: 'Kit Rendimiento Inteligente',
  description: 'Nutrición deportiva práctica.',
  price: 48000,
  active_promo: true,
  promo_price: 39990,
  stock: 999,
  category: 'Kits',
  thumbnail: '/img/tienda/kit-rendimiento.png',
  cartQuantity: 1,
}

function renderCart(items = [ITEM]) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      step: stepReducer,
      checkout: checkoutReducer,
      validators: validatorsReducer,
    },
    preloadedState: {
      cart: {
        cartItems: items,
        cartTotalQuantity: items.reduce((n, i) => n + i.cartQuantity, 0),
        cartTotalAmount: 0, // getTotals recalculates on mount
      },
    },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/carrito']}>
        <Cart />
      </MemoryRouter>
    </Provider>
  )
  return store
}

describe('Cart (Tu carrito)', () => {
  it('renders the item row with promo line total', () => {
    renderCart()
    expect(screen.getByRole('heading', { name: 'Tu carrito' })).toBeInTheDocument()
    expect(screen.getByTestId('carrito-item')).toBeInTheDocument()
    // strikethrough original + promo current
    expect(screen.getByText('$ 48.000')).toBeInTheDocument()
    expect(screen.getAllByText(/39\.990/).length).toBeGreaterThan(0)
  })

  it('increments quantity from the stepper', () => {
    const store = renderCart()
    fireEvent.click(screen.getByRole('button', { name: 'Sumar uno' }))
    expect(store.getState().cart.cartItems[0].cartQuantity).toBe(2)
  })

  it('empties the cart from "vaciar"', () => {
    const store = renderCart()
    fireEvent.click(screen.getByRole('button', { name: 'vaciar' }))
    expect(store.getState().cart.cartItems).toHaveLength(0)
  })

  it('links to checkout from Finalizar compra', () => {
    renderCart()
    expect(
      screen.getByRole('link', { name: /finalizar compra/i })
    ).toHaveAttribute('href', '/checkout')
  })
})
