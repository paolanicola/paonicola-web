import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fecha: localStorage.getItem('fecha') ? JSON.parse(localStorage.getItem('fecha')) : null,
  formulario: null,
};

const cartStateSlice = createSlice({
  name: 'cartState',
  initialState,
  reducers: {
    updateFecha(state, action) {
      state.fecha = action.payload;
      localStorage.setItem('fecha', JSON.stringify(action.payload));
    },
    updateTest(state, action) {
      updateFecha(state, action);
    },
  },
});

export const { updateFecha, updateTest } = cartStateSlice.actions;
export const getFecha = (state) => state.cartState.fecha;
export default cartStateSlice.reducer;
