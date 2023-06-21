import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  appointments: [],
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
})

export const getAllAppointments = (state) => state.appointments.appointments
export default appointmentsSlice.reducer
