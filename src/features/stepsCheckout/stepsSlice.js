import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  step: localStorage.getItem('stepCurrent') ? JSON.parse(localStorage.getItem('stepCurrent')) : 0,
  method: localStorage.getItem('method') ? localStorage.getItem('method') : ''
}

const stepSlice = createSlice({
  name: 'stepCurrent',
  initialState,
  reducers: {
    nextStep(state, action) {
      if (state.step < 2) {
        state.step += 1
      } else if (state.step === 2) {
      }

      localStorage.setItem('stepCurrent', state.step)
    },
    backStep(state, action) {
      if (state.step > 0) {
        state.step -= 1
      } else if (state.step === 0) {
      }

      localStorage.setItem('stepCurrent', state.step)
    },
    resetStep(state, action) {
      state.step = 0
      localStorage.setItem('stepCurrent', state.step)
    },
    setFecha(state, action) {
      localStorage.setItem('method', action.payload)
    }
  }
})

export const { nextStep, backStep, setFecha, resetStep } = stepSlice.actions
export const getStateStep = (state) => state.stepCurrent.step
export const getStateFecha = (state) => state
export default stepSlice.reducer
