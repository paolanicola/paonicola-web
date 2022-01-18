import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { getTotals } from './cart/cartSlice';
import productsReducer from './products/productSlice';

export const store = configureStore({
  reducer: { products: productsReducer, cart: cartReducer },
});
