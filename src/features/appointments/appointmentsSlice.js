import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [
    {
      fecha: '2022-04-o2T00:00:00',
      horaDisponibles: ['10:00', '14:00', '15:00'],
    },
    {
      fecha: '2022-04-06T00:00:00',
      horaDisponibles: ['12:00', '13:50', '17:00'],
    },
    {
      fecha: '2022-04-07T00:00:00',
      horaDisponibles: ['03:00', '04:00', '07:30'],
    },
    {
      fecha: '2022-04-19T00:00:00',
      horaDisponibles: ['05:45', '06:00', '06:45'],
    },
    {
      fecha: '2022-05-25T00:00:00',
      horaDisponibles: ['04:00', '06:30', '07:45'],
    },
    {
      fecha: '2022-05-29T00:00:00',
      horaDisponibles: ['04:00', '06:00', '07:00'],
    },
    {
      fecha: '2022-06-03T00:00:00',
      horaDisponibles: ['02:00', '03:30', '05:00'],
    },
    {
      fecha: '2022-06-16T00:00:00',
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
