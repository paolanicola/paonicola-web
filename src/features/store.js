import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import cartReducer, { getTotals } from './cart/cartSlice'
import productsReducer from './products/productSlice'
import stepReducer from './stepsCheckout/stepsSlice'
import appointmentsReducer from './appointments/appointmentsSlice'
import cartStateReducer from './cartState/cartStateSlice'
// import logger from "./middleware/logger";
import api from './middleware/api'
import categoriesReducer from './categories'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    step: stepReducer,
    appointments: appointmentsReducer,
    cartState: cartStateReducer,
    categories: categoriesReducer
  },
  middleware: [...getDefaultMiddleware(), api]
})
