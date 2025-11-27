import { createAction, createReducer } from '@reduxjs/toolkit'

// ACTIONS
const methodDepositReceived = createAction('method/received')
const mercadoPagoSelected = createAction('method/mercadoPagoSelected')
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
  [mercadoPagoSelected.type]: (state) => {
    state.loading = false
    state.success = true
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
  dispatch(mercadoPagoSelected())
export const setMethodDeposit = () => (dispatch) =>
  dispatch(methodDepositReceived())
export const getMethod = (state) => state.validators.method
export const methodIsLoading = (state) => state.validators.loading
export const resetMethod = () => (dispatch) => dispatch(resetMethodAction())