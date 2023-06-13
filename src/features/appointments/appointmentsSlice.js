import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  appointments: [
    {
      fecha: '2022-08-25T00:00:00',
      horaDisponibles: ['10:00', '14:00', '15:00']
    },
    {
      fecha: '2022-09-09T00:00:00',
      horaDisponibles: ['12:00', '13:50', '17:00']
    },
    {
      fecha: '2022-09-11T00:00:00',
      horaDisponibles: ['15:00', '16:00', '19:30']
    },
    {
      fecha: '2022-10-19T00:00:00',
      horaDisponibles: ['17:45', '18:00', '18:45']
    },
    {
      fecha: '2022-10-25T00:00:00',
      horaDisponibles: ['16:00', '18:30', '19:45']
    }
  ]
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {}
})

export const getAllAppointments = (state) => state.appointments.appointments
export default appointmentsSlice.reducer
