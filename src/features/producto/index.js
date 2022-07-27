import { createAction, createReducer } from '@reduxjs/toolkit'
import { apiCallBegan } from '../apiCalls'

// ACTIONS
const productsRequested = createAction('products/requested')
const productsRequestFailed = createAction('products/requestFailed')
const productsReceived = createAction('products/received')

const MpCheckoutRequested = createAction('mpChekout/requested')
const MpCheckoutFailed = createAction('mpChekout/requestFailed')
const MpCheckoutSuccess = createAction('mpChekout/requestSuccess')

// REDUCER
export const initialState = {
  data: [],
  loading: false,
  loadSuccess: false,
  success: false,
  preferenceSuccess: false,
  preferenceLoading: false
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
  },

  // update
  [MpCheckoutRequested.type]: (state) => {
    state.preferenceLoading = true
    state.preferenceSuccess = false
  },
  [MpCheckoutSuccess.type]: (state, action) => {
    state.data = action.payload.data
    state.preferenceSuccess = true
    state.preferenceLoading = false
  },
  [MpCheckoutFailed.type]: (state, action) => {
    state.preferenceLoading = false
    //toast.error(action.payload.message)
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

export const createPreference = (data) => (dispatch, getState) => {
  console.log(data)
  dispatch(
    apiCallBegan({
      url: `http://localhost:3002/api/checkout`,
      method: 'post',
      data,
      onStart: MpCheckoutRequested.type,
      onSuccess: MpCheckoutSuccess.type,
      onError: MpCheckoutFailed.type
    })
  )
}
