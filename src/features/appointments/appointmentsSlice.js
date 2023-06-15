import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  appointments: [
    {
      date: '2023-08-25T00:00:00',
      available_hours: ['10:00', '14:00', '15:00'],
    },
    {
      date: '2023-08-27T00:00:00',
      available_hours: ['12:00', '13:50', '17:00'],
    },
    {
      date: '2023-09-11T00:00:00',
      available_hours: ['15:00', '16:00', '19:30'],
    },
    {
      date: '2023-10-19T00:00:00',
      available_hours: ['17:45', '18:00', '18:45'],
    },
    {
      date: '2023-10-25T00:00:00',
      available_hours: ['16:00', '18:30', '19:45'],
    },
  ],
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
})

export const getAllAppointments = (state) => state.appointments.appointments
export default appointmentsSlice.reducer
