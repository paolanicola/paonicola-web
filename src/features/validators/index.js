import { createAction, createReducer } from '@reduxjs/toolkit'

// ACTIONS
const methodDepositReceived = createAction('method/received')
const mercadoPagoRequested = createAction('method/mercadoPagoRequested')
const mercadoPagoReceived = createAction('method/mercadoPagoReceived')
const methodRequestFailed = createAction('method/requestFailed')
const resetMethodAction = createAction('method/resetMethod')

// REDUCER
export const initialState = {
  method: '',
  loading: false,
  success: false,
}

const validatorsReducer = createReducer(initialState, {
  [methodDepositReceived.type]: (state, action) => {
    state.loading = false
    state.success = true
    state.method = 'deposit'
  },
  [mercadoPagoRequested.type]: (state) => {
    state.loading = true
    state.success = false
    state.method = 'mercadopago'
  },
  [mercadoPagoReceived.type]: (state) => {
    state.loading = false
    state.success = false
    state.method = 'mercadopago'
  },
  [methodRequestFailed.type]: (state) => {
    state.loading = false
    state.success = false
  },
  [resetMethodAction.type]: (state) => {
    state.loading = false
    state.success = false
    state.method = ''
  },
})

export default validatorsReducer
// PUBLIC ACTIONS

export const setMethodMercadoPago = () => (dispatch) =>
  dispatch(mercadoPagoRequested())
export const setMethodDeposit = () => (dispatch) =>
  dispatch(methodDepositReceived())
export const mercadoPagoLoadSuccess = () => (dispatch) =>
  dispatch(mercadoPagoReceived())
export const getMethod = (state) => state.validators.method
export const methodIsLoading = (state) => state.validators.loading
export const resetMethod = () => (dispatch) => dispatch(resetMethodAction())
