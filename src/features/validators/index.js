import { createAction, createReducer } from '@reduxjs/toolkit'

// ACTIONS
const methodRequested = createAction('method/requested')
const methodRequestFailed = createAction('method/requestFailed')
const methodReceived = createAction('method/received')

// REDUCER
export const initialState = {
  data: '',
  loading: false,
  loadSuccess: false,
  success: false
}

const validatorsReducer = createReducer(initialState, {
  [methodRequested.type]: (state) => {
    state.loading = true
    state.success = false
    state.loadSuccess = false
  },
  [methodReceived.type]: (state, action) => {
    state.loading = false
    state.loadSuccess = true
    state.success = true
    state.data = action.payload
  },
  [methodRequestFailed.type]: (state, action) => {
    state.loading = false
    state.success = false
    state.loadSuccess = false
  }
})

export default validatorsReducer
// PUBLIC ACTIONS

export const setMethod = (a) => (dispatch) =>  dispatch(methodReceived(a))
export const getMethod = () => (dispatch) => dispatch()
export const loadMethod = () => (dispatch) => dispatch()
