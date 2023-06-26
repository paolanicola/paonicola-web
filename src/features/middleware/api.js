import axios from 'axios'
import * as actions from '../apiCalls'

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action)

    const { url, method, data, onStart, onSuccess, onError } = action.payload

    if (onStart) dispatch({ type: onStart })

    next(action)

    try {
      const response = await axios.request({
        baseURL: '',
        params: '',
        url,
        method,
        data
      })
      // Specific Api call
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data })
      else dispatch(actions.apiCallSuccess(response.data))
    } catch (error) {
      // Refresh token
      if (
        action.payload.onSuccess !== 'auth/loggedOut' &&
        error.response &&
        error.response.status === 401
      )
        // General api error
        dispatch(actions.apiCallFailed(error.response ? error.response.data : error.message))

      // Sepecific API error handling.
      if (onError) {
        let errorMessage = 'error'
        if (error.response) errorMessage = error.response.data
        dispatch({ type: onError, payload: errorMessage })
      }
    }
  }

export default api
