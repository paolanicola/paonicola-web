import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: localStorage.getItem('stepCurrent') ? JSON.parse(localStorage.getItem('stepCurrent')) : 0,
  fecha: localStorage.getItem('fechaCurrent') ? JSON.parse(localStorage.getItem('fechaCurrent')) : 0,
};

const stepSlice = createSlice({
  name: 'stepCurrent',
  initialState,
  reducers: {
    nextStep(state, action) {
      if (state.step < 2) {
        state.step += 1;
      } else if (state.step === 2) {
      }

      localStorage.setItem('stepCurrent', state.step);
    },
    backStep(state, action) {
      if (state.step > 0) {
        state.step -= 1;
      } else if (state.step === 0) {
      }

      localStorage.setItem('stepCurrent', state.step);
    },
    setFecha(state, action) {
      localStorage.setItem('fechaCurrent', state.fecha);
    },
  },
});

export const { nextStep, backStep, setFecha } = stepSlice.actions;
export const getStateStep = (state) => state.stepCurrent.step;
export const getStateFecha = (state) => state.stepCurrent.fecha;
export default stepSlice.reducer;
