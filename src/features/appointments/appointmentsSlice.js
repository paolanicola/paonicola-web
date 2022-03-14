import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [
    {
      fecha: '2022-03-16T00:00:00',
      horaDisponibles: ['01:00', '02:00', '03:00'],
    },
    {
      fecha: '2022-03-18T00:00:00',
      horaDisponibles: ['12:00', '01:00', '05:00'],
    },
    {
      fecha: '2022-03-22T00:00:00',
      horaDisponibles: ['03:00', '04:00', '07:30'],
    },
    {
      fecha: '2022-03-24T00:00:00',
      horaDisponibles: ['05:45', '06:00', '06:45'],
    },
    {
      fecha: '2022-03-25T00:00:00',
      horaDisponibles: ['04:00', '06:30', '07:45'],
    },
    {
      fecha: '2023-04-15T00:00:00',
      horaDisponibles: ['04:00', '06:00', '07:00'],
    },
    {
      fecha: '2023-10-16T00:00:00',
      horaDisponibles: ['02:00', '03:30', '05:00'],
    },
    {
      fecha: '2023-01-03T00:00:00',
      horaDisponibles: ['05:00', '05:30', '07:00'],
    },
  ],
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
});

export const getAllAppointments = (state) => state.appointments.appointments;
export default appointmentsSlice.reducer;
