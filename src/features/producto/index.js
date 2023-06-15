import { createAction, createReducer } from '@reduxjs/toolkit'
import { apiCallBegan } from '../apiCalls'

// ACTIONS
const productsRequested = createAction('products/requested')
const productsRequestFailed = createAction('products/requestFailed')
const productsReceived = createAction('products/received')

const preferenceRequested = createAction('preference/requested')
const preferenceRequestFailed = createAction('preference/requestFailed')
const preferenceReceived = createAction('preference/received')

// REDUCER
export const initialState = {
  data: [],
  loading: false,
  loadSuccess: false,
  success: false,
  preference: '',
}

const productosReducer = createReducer(initialState, {
  [productsRequested.type]: (state) => {
    state.loading = true
    state.success = false
    state.loadSuccess = false
  },
  [productsReceived.type]: (state, action) => {
    state.loading = false
    state.loadSuccess = true
    state.success = true
    state.data = action.payload
  },
  [productsRequestFailed.type]: (state, action) => {
    state.loading = false
    state.success = false
    state.loadSuccess = false
  },
  // Preference prueba de funcionamiento
  [preferenceRequested.type]: (state) => {
    state.loading = true
    state.success = false
    state.loadSuccess = false
  },
  [preferenceReceived.type]: (state, action) => {
    state.loading = false
    state.loadSuccess = true
    state.success = true
    state.preference = action.payload
  },
  [preferenceRequestFailed.type]: (state, action) => {
    state.loading = false
    state.success = false
    state.loadSuccess = false
  },
})

export default productosReducer
// PUBLIC ACTIONS

export const loadProducts = () => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: `${process.env.REACT_APP_API_BASE_URL}/products`,
      onStart: productsRequested.type,
      onSuccess: productsReceived.type,
      onError: productsRequestFailed.type,
    })
  )
}
export const loadPreference = () => (dispatch, getState) => {
  const { cart } = getState()
  const { cartState } = getState()
  const items = cart.cartItems.map((product) => ({
    id: product.id,
    title: product.name,
    currency_id: 'ARS',
    picture_url: 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif',
    description: product.description,
    category_id: product.category_id,
    quantity: product.cartQuantity,
    unit_price: product.price,
  }))
  const order = { items, cartState }
  dispatch(
    apiCallBegan({
      url: `http://localhost:3002/api/checkout`,
      method: 'post',
      data: { order },
      onStart: preferenceRequested.type,
      onSuccess: preferenceReceived.type,
      onError: preferenceRequestFailed.type,
    })
  )
}
export const confirmedBuy = () => (dispatch, getState) => {
  const { cart } = getState()
  const { cartState } = getState()

  const items = cart.cartItems.map((product) => ({
    id: product.id,
    title: product.name,
    currency_id: 'ARS',
    picture_url: 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif',
    description: product.description,
    category_id: product.category_id,
    quantity: product.cartQuantity,
    unit_price: product.price,
  }))
  const order = { items, cartState }
  dispatch(
    apiCallBegan({
      url: `http://localhost:3002/api/checkout/transfer`,
      method: 'post',
      data: { order },
      onStart: preferenceRequested.type,
      onSuccess: preferenceReceived.type,
      onError: preferenceRequestFailed.type,
    })
  )
}
