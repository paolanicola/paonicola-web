import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fecha: localStorage.getItem('fecha') ? JSON.parse(localStorage.getItem('fecha')) : null,
  hora: localStorage.getItem('hora') ? JSON.parse(localStorage.getItem('hora')) : null,
};

const cartStateSlice = createSlice({
  name: 'cartState',
  initialState,
  reducers: {
    updateFecha(state, action) {
      state.fecha = action.payload;
      localStorage.setItem('fecha', JSON.stringify(state.fecha));
    },
    updateHora(state, action) {
      state.hora = action.payload;
      localStorage.setItem('hora', JSON.stringify(state.hora));
    },
    deleteHora(state, action) {
      state.hora = null;
      localStorage.setItem('hora', JSON.stringify(state.hora));
    },
  },
});

export const { updateFecha, updateHora, deleteHora } = cartStateSlice.actions;
export const getFecha = (state) => state.cartState.fecha;
export const getHora = (state) => state.cartState.hora;
export default cartStateSlice.reducer;
