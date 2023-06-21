import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import appointmentsReducer from './appointments/index'
import cartReducer from './cart/cartSlice'
import cartStateReducer from './cartState/cartStateSlice'
import productsReducer from './products/productSlice'
import stepReducer from './stepsCheckout/stepsSlice'
// import logger from "./middleware/logger";
import categoriesReducer from './categories'
import api from './middleware/api'
import productosReducer from './producto'
import validatorsReducer from './validators'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    productos: productosReducer,
    validators: validatorsReducer,
    cart: cartReducer,
    step: stepReducer,
    schedules: appointmentsReducer,
    cartState: cartStateReducer,
    categories: categoriesReducer,
  },
  middleware: [...getDefaultMiddleware(), api],
})
