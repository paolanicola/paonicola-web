import { createAction, createReducer } from '@reduxjs/toolkit'
import { apiCallBegan } from '../apiCalls'

// ACTIONS
const orderRequested = createAction('order/requested')
const orderReceived = createAction('order/received')
const orderRequestFailed = createAction('order/requestFailed')

// REDUCER
export const initialState = {
  orderData: {},
  loading: false,
  loadSuccess: false,
  success: false,
}

const orderReducer = createReducer(initialState, {
  [orderRequested.type]: (state) => {
    state.loading = true
    state.success = false
    state.loadSuccess = false
  },
  [orderReceived.type]: (state, action) => {
    state.loading = false
    state.loadSuccess = true
    state.success = true
    state.orderData = { ...action.payload }
  },
  [orderRequestFailed.type]: (state, action) => {
    state.loading = false
    state.success = false
    state.loadSuccess = false
  },
})

// PUBLIC ACTIONS

export const submitOrder =
  (method, schedule_id, personalData, products) => (dispatch) => {
    const data = {
      payment_type: method,
      schedule_id: schedule_id,
      product_ids_and_quantities: products.map((product) => [
        product.id,
        product.cartQuantity,
      ]),
      patient_info: {
        email: personalData.email,
        name: personalData.name,
        lastname: personalData.lastname,
        phone: personalData.phone,
      },
    }

    dispatch(
      apiCallBegan({
        url: `${process.env.REACT_APP_API_BASE_URL}/orders`,
        method: 'POST',
        data: data,
        onStart: orderRequested.type,
        onSuccess: orderReceived.type,
        onError: orderRequestFailed.type,
      })
    )
  }

export default orderReducer
export const getOrderData = (state) => state.order.orderData
