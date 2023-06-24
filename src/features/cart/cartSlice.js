import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
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
        // Check if adding 1 to cartQuantity exceeds stock
        if (state.cartItems[itemIndex].cartQuantity < action.payload.stock) {
          state.cartItems[itemIndex].cartQuantity += 1
        } else {
          throw new Error(
            'Stock limit reached. Item cannot be added to the cart.'
          )
        }
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 }
        state.cartItems.push(tempProduct)
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    removeFromCart(state, action) {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      )
      state.cartItems = nextCartItems
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    deleteCartItems(state, action) {
      state.cartItems = []
      state.cartTotalQuantity = 0
      state.cartTotalAmount = 0
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
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    getTotals(state, action) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, promo, promoPrice, cartQuantity } = cartItem
          let itemTotal = 0
          if (promo) {
            itemTotal = promoPrice * cartQuantity
          } else {
            itemTotal = price * cartQuantity
          }
          cartTotal.total += itemTotal
          cartTotal.quantity += cartQuantity

          return cartTotal
        },
        {
          total: 0,
          quantity: 0,
        }
      )

      state.cartTotalQuantity = quantity
      state.cartTotalAmount = total
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
