import axios from 'axios'
import * as actions from '../apiCalls'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
})

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action)

    const { url, method, data, onStart, onSuccess, onError } = action.payload

    console.log('🌐 API Middleware - Action:', action.payload)

    if (onStart) {
      console.log('▶️ Dispatching onStart:', onStart)
      dispatch({ type: onStart })
    }

    next(action)

    try {
      console.log('📡 Making request to:', `${apiClient.defaults.baseURL}${url}`)
      
      const response = await apiClient.request({
        url,
        method: method || 'get',
        data,
      })

      console.log('✅ API Response:', {
        status: response.status,
        data: response.data,
        dataType: typeof response.data,
      })

      if (onSuccess) {
        console.log('🎯 Dispatching onSuccess:', onSuccess, 'with payload:', response.data)
        dispatch({ type: onSuccess, payload: response.data })
      } else {
        dispatch(actions.apiCallSuccess(response.data))
      }
    } catch (error) {
      console.error('❌ API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })

      if (
        action.payload.onSuccess !== 'auth/loggedOut' &&
        error.response &&
        error.response.status === 401
      ) {
        dispatch(
          actions.apiCallFailed(
            error.response ? error.response.data : error.message
          )
        )
      }

      if (onError) {
        let errorMessage = 'Error: '
        if (error.response) errorMessage = error.response.data
        console.log('🔴 Dispatching onError:', onError, 'with payload:', errorMessage)
        dispatch({ type: onError, payload: errorMessage })
      }
    }
  }

export default api