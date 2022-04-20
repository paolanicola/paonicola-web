import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fecha: localStorage.getItem('fecha') ? JSON.parse(localStorage.getItem('fecha')) : null,
  hora: localStorage.getItem('hora') ? JSON.parse(localStorage.getItem('hora')) : null,
  formulario: localStorage.getItem('formulario') ? JSON.parse(localStorage.getItem('formulario')) : null,
  verificado: localStorage.getItem('verificado') ? JSON.parse(localStorage.getItem('verificado')) : false,
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
    updateVerificado(state, action) {
      state.verificado = action.payload;
      localStorage.setItem('verificado', JSON.stringify(state.verificado));
    },
    updateformulario(state, action) {
      state.formulario = action.payload;
      localStorage.setItem('formulario', JSON.stringify(state.formulario));
    },
    deleteHora(state, action) {
      state.hora = null;
      localStorage.setItem('hora', JSON.stringify(state.hora));
    },
    resetCartState(state, action) {
      state.fecha = null;
      localStorage.setItem('fecha', JSON.stringify(state.fecha));
      state.hora = null;
      localStorage.setItem('hora', JSON.stringify(state.hora));
      state.verificado = false;
      localStorage.setItem('verificado', JSON.stringify(state.verificado));
      state.formulario = null;
      localStorage.setItem('formulario', JSON.stringify(state.formulario));
    },
  },
});

export const { updateFecha, updateHora, updateVerificado, deleteHora, updateformulario, resetCartState } = cartStateSlice.actions;
export const getFecha = (state) => state.cartState.fecha;
export const getHora = (state) => state.cartState.hora;
export const getVerificado = (state) => state.cartState.verificado;
export const getFormulario = (state) => state.cartState.formulario;
export default cartStateSlice.reducer;
