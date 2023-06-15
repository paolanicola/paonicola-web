import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  date: localStorage.getItem('date')
    ? new Date(JSON.parse(localStorage.getItem('date')))
    : null,
  time: localStorage.getItem('time')
    ? JSON.parse(localStorage.getItem('time'))
    : null,
  form: localStorage.getItem('form')
    ? JSON.parse(localStorage.getItem('form'))
    : null,
  verified: localStorage.getItem('verified')
    ? JSON.parse(localStorage.getItem('verified'))
    : false,
}

const cartStateSlice = createSlice({
  name: 'cartState',
  initialState,
  reducers: {
    updateDate(state, action) {
      state.date = new Date(action.payload)
      localStorage.setItem('date', JSON.stringify(state.date))
    },
    updateTime(state, action) {
      state.time = action.payload
      localStorage.setItem('time', JSON.stringify(state.time))
    },
    updateVerified(state, action) {
      state.verified = action.payload
      localStorage.setItem('verified', JSON.stringify(state.verified))
    },
    updateForm(state, action) {
      state.form = action.payload
      localStorage.setItem('form', JSON.stringify(state.form))
    },
    deleteTime(state, action) {
      state.time = null
      localStorage.setItem('time', JSON.stringify(state.time))
    },
    resetCartState(state, action) {
      state.date = null
      localStorage.setItem('date', JSON.stringify(state.date))
      state.time = null
      localStorage.setItem('time', JSON.stringify(state.time))
      state.verified = false
      localStorage.setItem('verified', JSON.stringify(state.verified))
      state.form = null
      localStorage.setItem('form', JSON.stringify(state.form))
    },
  },
})

export const {
  updateDate,
  updateTime,
  updateVerified,
  deleteTime,
  updateForm,
  resetCartState,
} = cartStateSlice.actions
export const getDate = (state) => state.cartState.date
export const getTime = (state) => state.cartState.time
export const getVerified = (state) => state.cartState.verified
export const getForm = (state) => state.cartState.form
export default cartStateSlice.reducer
