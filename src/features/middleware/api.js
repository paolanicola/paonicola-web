import axios from 'axios'
import API from 'constants/api'
import i18n from 'i18n'
import * as actions from '../apiCalls'
import authHeader from './auth-header'
import tokenRefresh from './token-refresh'

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action)

    const { url, method, data, params, onStart, onSuccess, onError } = action.payload

    if (onStart) dispatch({ type: onStart })

    next(action)

    const headers = authHeader()

    try {
      const response = await axios.request({
        baseURL: API.BASE_URL,
        params: { ...API.DEFAULT_PARAMS, ...params },
        url,
        method,
        data,
        headers
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
      ) {
        return tokenRefresh(dispatch, () => dispatch(action))
      }

      // General api error
      dispatch(actions.apiCallFailed(error.response ? error.response.data : error.message))

      // Sepecific API error handling.
      if (onError) {
        let errorMessage = { message: i18n.t('errors.wrong') }
        if (error.response) errorMessage = error.response.data
        dispatch({ type: onError, payload: errorMessage })
      }
    }
  }

export default api
