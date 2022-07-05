import { createAction, createReducer } from '@reduxjs/toolkit'
import { apiCallBegan } from '../apiCalls'

// ACTIONS
const productsRequested = createAction('products/requested')
const productsRequestFailed = createAction('products/requestFailed')
const productsReceived = createAction('products/received')

// REDUCER
export const initialState = {
  data: [],
  loading: false,
  loadSuccess: false,
  success: false
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
    state.toDevelop = []
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
