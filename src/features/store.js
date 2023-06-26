import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import appointmentsReducer from './appointments/index'
import cartReducer from './cart/cartSlice'
import checkoutReducer from './checkout/checkoutSlice'
import api from './middleware/api'
import productsReducer from './products'
import stepReducer from './stepsCheckout/stepsSlice'
import validatorsReducer from './validators'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    validators: validatorsReducer,
    cart: cartReducer,
    step: stepReducer,
    schedules: appointmentsReducer,
    checkout: checkoutReducer,
  },
  middleware: [...getDefaultMiddleware(), api],
})
