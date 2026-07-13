import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import useAddToCart from './useAddToCart'
import cartReducer from '../features/cart/cartSlice'
import stepReducer from '../features/stepsCheckout/stepsSlice'

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), info: jest.fn(), error: jest.fn() },
}))

const KIT = { id: 1, name: 'Kit', price: 100, stock: 2, category: 'Kits' }
const CONSULTA = { id: 2, name: 'Consulta', price: 100, stock: 5, category: 'Consultas Online' }

function Harness({ product }) {
  const add = useAddToCart()
  return <button onClick={() => add(product)}>add</button>
}

function renderHarness(product, preloadedCart) {
  const store = configureStore({
    reducer: { cart: cartReducer, step: stepReducer },
    preloadedState: {
      cart: preloadedCart || { cartItems: [], cartTotalQuantity: 0, cartTotalAmount: 0 },
    },
  })
  render(
    <Provider store={store}>
      <Harness product={product} />
    </Provider>
  )
  return store
}

describe('useAddToCart', () => {
  beforeEach(() => jest.clearAllMocks())

  it('adds the product and toasts success', () => {
    const store = renderHarness(KIT)
    fireEvent.click(screen.getByText('add'))
    expect(store.getState().cart.cartItems).toHaveLength(1)
    expect(toast.success).toHaveBeenCalled()
  })

  it('blocks adds beyond the stock limit', () => {
    const store = renderHarness(KIT, {
      cartItems: [{ ...KIT, cartQuantity: 2 }],
      cartTotalQuantity: 2,
      cartTotalAmount: 200,
    })
    fireEvent.click(screen.getByText('add'))
    expect(store.getState().cart.cartItems[0].cartQuantity).toBe(2)
    expect(toast.error).toHaveBeenCalled()
  })

  it('allows only one calendar product in the cart', () => {
    const store = renderHarness(CONSULTA, {
      cartItems: [{ ...CONSULTA, id: 9, cartQuantity: 1 }],
      cartTotalQuantity: 1,
      cartTotalAmount: 100,
    })
    fireEvent.click(screen.getByText('add'))
    expect(store.getState().cart.cartItems).toHaveLength(1)
    expect(toast.info).toHaveBeenCalled()
  })
})
