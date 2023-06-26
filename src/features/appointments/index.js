import { createAction, createReducer } from '@reduxjs/toolkit'
import { apiCallBegan } from '../apiCalls'

// ACTIONS
const appointmentsRequested = createAction('appointments/requested')
const appointmentsRequestFailed = createAction('appointments/requestFailed')
const appointmentsReceived = createAction('appointments/received')

// REDUCER
export const initialState = {
  appointments: [],
  loading: false,
  loadSuccess: false,
  success: false,
  preference: '',
}

const appointmentsReducer = createReducer(initialState, {
  [appointmentsRequested.type]: (state) => {
    state.loading = true
    state.success = false
    state.loadSuccess = false
  },
  [appointmentsReceived.type]: (state, action) => {
    state.loading = false
    state.loadSuccess = true
    state.success = true
    state.appointments = [...action.payload]
  },
  [appointmentsRequestFailed.type]: (state, action) => {
    state.loading = false
    state.success = false
    state.loadSuccess = false
  },
})

// PUBLIC ACTIONS

export const loadAppointments = () => (dispatch) => {
  dispatch(
    apiCallBegan({
      url: `${process.env.REACT_APP_API_BASE_URL}/schedules`,
      onStart: appointmentsRequested.type,
      onSuccess: appointmentsReceived.type,
      onError: appointmentsRequestFailed.type,
    })
  )
}

export default appointmentsReducer
export const getAllAppointments = (state) => state.schedules.appointments
