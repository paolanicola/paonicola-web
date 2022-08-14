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
  preference: ''
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
  }
})

export default productosReducer
// PUBLIC ACTIONS

export const loadProducts = () => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: `http://localhost:3002/api/products`,
      onStart: productsRequested.type,
      onSuccess: productsReceived.type,
      onError: productsRequestFailed.type
    })
  )
}
export const loadPreference = () => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: `http://localhost:3002/api/checkout`,
      method: 'post',
      data: [],
      onStart: preferenceRequested.type,
      onSuccess: preferenceReceived.type,
      onError: preferenceRequestFailed.type
    })
  )
}
