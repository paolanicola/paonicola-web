import { createAction, createReducer } from '@reduxjs/toolkit'
import { apiCallBegan } from '../apiCalls'

// ACTIONS
const categoriesRequested = createAction('categories/requested')
const categoriesRequestFailed = createAction('categories/requestFailed')
const categoriesReceived = createAction('categories/received')

// REDUCER
export const initialState = {
  data: [],
  loading: false,
  loadSuccess: false,
  success: false
}

const categoriesReducer = createReducer(initialState, {
  [categoriesRequested.type]: (state) => {
    state.loading = true
    state.success = false
    state.loadSuccess = false
  },
  [categoriesReceived.type]: (state, action) => {
    state.loading = false
    state.loadSuccess = true
    console.log(action.payload)
    state.data = action.payload
  },
  [categoriesRequestFailed.type]: (state, action) => {
    state.loading = false
    state.success = false
    state.loadSuccess = false
    state.toDevelop = []
  }
})

export default categoriesReducer
// PUBLIC ACTIONS

export const loadCategories = () => (dispatch, getState) => {
  console.log()
  dispatch(
    apiCallBegan({
      url: `http://localhost:3002/api/categories`,
      onStart: categoriesRequested.type,
      onSuccess: categoriesReceived.type,
      onError: categoriesRequestFailed.type
    })
  )
}
