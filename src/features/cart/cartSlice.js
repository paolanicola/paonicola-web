import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
}

// Keeps totals consistent with cartItems. Called by every mutating reducer so
// the header badge and summaries never lag behind (the legacy flow relied on
// components dispatching getTotals from effects).
// NOTE: the API serializes promos as active_promo / promo_price
const recalcTotals = (state) => {
  let total = 0
  let quantity = 0
  state.cartItems.forEach((cartItem) => {
    const { price, active_promo, promo_price, cartQuantity } = cartItem
    const unitPrice = active_promo && promo_price != null ? promo_price : price
    total += unitPrice * cartQuantity
    quantity += cartQuantity
  })
  state.cartTotalQuantity = quantity
  state.cartTotalAmount = total
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      )

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 }
        state.cartItems.push(tempProduct)
      }

      recalcTotals(state)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      localStorage.setItem(
        'lastProductAddedTimestamp',
        new Date().toISOString()
      )
    },
    removeFromCart(state, action) {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      )
      state.cartItems = nextCartItems
      recalcTotals(state)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    deleteCartItems(state, action) {
      state.cartItems = []
      recalcTotals(state)
      localStorage.setItem('cartItems', state.cartItems)
    },

    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.id === action.payload.id
      )

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload.id
        )
        state.cartItems = nextCartItems
      }
      recalcTotals(state)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    getTotals(state, action) {
      recalcTotals(state)
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  deleteCartItems,
  decreaseCart,
  getTotals,
} = cartSlice.actions
export const getAllProductsCart = (state) => state.cart.cartItems
export const isCartEmpty = (state) => state.cart.cartItems.length === 0
export const isCartWithCalendar = (state) =>
  state.cart.cartItems.some(({ category }) => category === 'Consultas Online')
export default cartSlice.reducer
