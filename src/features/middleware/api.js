import axios from 'axios'
import * as actions from '../apiCalls'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
})

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action)

    const { url, method, data, onStart, onSuccess, onError } = action.payload

    if (onStart) {
      dispatch({ type: onStart })
    }

    next(action)

    try {
      const response = await apiClient.request({
        url,
        method: method || 'get',
        data,
      })

      if (onSuccess) {
        dispatch({ type: onSuccess, payload: response.data })
      } else {
        dispatch(actions.apiCallSuccess(response.data))
      }
    } catch (error) {
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
        dispatch({ type: onError, payload: errorMessage })
      }
    }
  }

export default api