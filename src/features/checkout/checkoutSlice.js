import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  date: '',
  dateSelected: localStorage.getItem('dateSelected')
    ? JSON.parse(localStorage.getItem('dateSelected'))
    : null,
  time: null,
  form: localStorage.getItem('form')
    ? JSON.parse(localStorage.getItem('form'))
    : null,
  verified: localStorage.getItem('verified')
    ? JSON.parse(localStorage.getItem('verified'))
    : false,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateDate(state, { payload }) {
      state.date = payload
    },
    updateDateSelected(state, { payload }) {
      state.dateSelected = payload
      state.time = null
      localStorage.setItem('dateSelected', JSON.stringify(state.dateSelected))
    },
    updateTime(state, action) {
      state.time = action.payload
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
    },
    deleteDateSelected(state, action) {
      state.dateSelected = null
      localStorage.setItem('dateSelected', state.dateSelected)
    },
    resetCartState(state, action) {
      state.date = null
      state.dateSelected = null
      localStorage.setItem('dateSelected', JSON.stringify(state.dateSelected))
      state.time = null
      state.verified = false
      localStorage.setItem('verified', JSON.stringify(state.verified))
      state.form = null
      localStorage.setItem('form', JSON.stringify(state.form))
    },
  },
})

export const {
  updateDate,
  updateDateSelected,
  updateTime,
  updateVerified,
  deleteTime,
  deleteDateSelected,
  updateForm,
  resetCartState,
} = checkoutSlice.actions

export const getDate = (state) => state.checkout.date
export const getDateSelected = (state) => state.checkout.dateSelected
export const getTime = (state) => state.checkout.time
export const getVerified = (state) => state.checkout.verified
export const getForm = (state) => state.checkout.form
export const isCheckoutCalendarValid = (state) =>
  state.checkout.dateSelected && state.checkout.time
export default checkoutSlice.reducer
