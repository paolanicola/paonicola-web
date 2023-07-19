import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  date: '',
  dateSelected: null,
  time: null,
  selectedAppointmentId: localStorage.getItem('selectedAppointmentId')
    ? localStorage.getItem('selectedAppointmentId')
    : null,
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
    updateSelectedAppointmentId(state, action) {
      state.selectedAppointmentId = action.payload
      localStorage.setItem('selectedAppointmentId', state.selectedAppointmentId)
    },
    deleteTime(state) {
      state.time = null
    },
    deleteDateSelected(state) {
      state.dateSelected = null
    },
    deleteSelectedAppointmentId(state) {
      state.selectedAppointmentId = null
      localStorage.setItem('selectedAppointmentId', state.selectedAppointmentId)
    },
    resetCartState(state, action) {
      state.date = null
      state.time = null
      state.dateSelected = null
      state.verified = false
      localStorage.setItem('verified', JSON.stringify(state.verified))
      state.form = null
      localStorage.setItem('form', JSON.stringify(state.form))
      state.selectedAppointmentId = null
      localStorage.setItem('selectedAppointmentId', state.selectedAppointmentId)
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
  deleteSelectedAppointmentId,
  updateForm,
  resetCartState,
  updateSelectedAppointmentId,
} = checkoutSlice.actions

export const getDate = (state) => state.checkout.date
export const getDateSelected = (state) => state.checkout.dateSelected
export const getSelectedAppointmentId = (state) =>
  state.checkout.selectedAppointmentId
export const getTime = (state) => state.checkout.time
export const getVerified = (state) => state.checkout.verified
export const getForm = (state) => state.checkout.form
export const isCheckoutCalendarValid = (state) =>
  state.checkout.dateSelected && state.checkout.time
export default checkoutSlice.reducer
