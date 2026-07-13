import axios from 'axios'

// Token-authenticated client for the patient portal API (/api/portal).
// The token lives in localStorage so the session survives reloads.

const TOKEN_KEY = 'portal_token'
const PATIENT_KEY = 'portal_patient'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getStoredPatient = () => {
  try {
    return JSON.parse(localStorage.getItem(PATIENT_KEY))
  } catch {
    return null
  }
}

export const storeSession = ({ token, patient }) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(PATIENT_KEY, JSON.stringify(patient))
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(PATIENT_KEY)
}

const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/portal`,
})

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const portalApi = {
  login: (email, password) =>
    client.post('/session', { email, password }).then((r) => r.data),
  logout: () => client.delete('/session'),
  fetchLibrary: () => client.get('/library').then((r) => r.data),
  fetchCategory: (id) =>
    client.get(`/library/categories/${id}`).then((r) => r.data),
  markViewed: (resourceId) =>
    client.post(`/resources/${resourceId}/view`).then((r) => r.data),
  search: (q) =>
    client.get('/search', { params: { q } }).then((r) => r.data),
  setPassword: (token, password) =>
    client.post('/password', { token, password }).then((r) => r.data),
  requestReset: (email) =>
    client.post('/password/reset', { email }).then((r) => r.data),
}

export default portalApi
