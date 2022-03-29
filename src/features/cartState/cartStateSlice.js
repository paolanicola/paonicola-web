import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fecha: localStorage.getItem('fecha') ? JSON.parse(localStorage.getItem('fecha')) : null,
};

const cartStateSlice = createSlice({
  name: 'cartState',
  initialState,
  reducers: {
    updateFecha(state, action) {
      state.fecha = action.payload;
      localStorage.setItem('fecha', JSON.stringify(state.fecha));
    },
  },
});

export const { updateFecha } = cartStateSlice.actions;
export const getFecha = (state) => state.cartState.fecha;
export default cartStateSlice.reducer;
