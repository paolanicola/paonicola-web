import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import portalApi, {
  clearSession,
  getStoredPatient,
  getToken,
  storeSession,
} from '../../services/portalApi'

// Patient-portal state: session + library + current category.

export const login = createAsyncThunk(
  'portal/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await portalApi.login(email, password)
      storeSession(data)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'No pudimos iniciar sesión. Probá de nuevo.'
      )
    }
  }
)

export const logout = createAsyncThunk('portal/logout', async () => {
  try {
    await portalApi.logout()
  } finally {
    clearSession()
  }
})

export const fetchLibrary = createAsyncThunk(
  'portal/fetchLibrary',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      return await portalApi.fetchLibrary()
    } catch (error) {
      if (error.response?.status === 401) dispatch(sessionExpired())
      return rejectWithValue('No pudimos cargar tu biblioteca.')
    }
  }
)

export const fetchCategory = createAsyncThunk(
  'portal/fetchCategory',
  async (categoryId, { dispatch, rejectWithValue }) => {
    try {
      return await portalApi.fetchCategory(categoryId)
    } catch (error) {
      if (error.response?.status === 401) dispatch(sessionExpired())
      return rejectWithValue('No pudimos cargar la categoría.')
    }
  }
)

export const markViewed = createAsyncThunk(
  'portal/markViewed',
  async (resourceId) => portalApi.markViewed(resourceId)
)

// Canjea el token del email por una contraseña nueva; devuelve sesión iniciada.
export const createAccess = createAsyncThunk(
  'portal/createAccess',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const data = await portalApi.setPassword(token, password)
      storeSession(data)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'No pudimos crear tu acceso. Probá de nuevo.'
      )
    }
  }
)

export const searchLibrary = createAsyncThunk(
  'portal/searchLibrary',
  async (q, { dispatch, rejectWithValue }) => {
    try {
      return await portalApi.search(q)
    } catch (error) {
      if (error.response?.status === 401) dispatch(sessionExpired())
      return rejectWithValue('No pudimos buscar.')
    }
  }
)

const initialState = {
  token: getToken(),
  patient: getStoredPatient(),
  library: null,
  category: null,
  loading: false,
  categoryLoading: false,
  loginError: null,
  loginPending: false,
  accessError: null,
  accessPending: false,
  search: null,
  searchPending: false,
}

const portalSlice = createSlice({
  name: 'portal',
  initialState,
  reducers: {
    sessionExpired(state) {
      clearSession()
      state.token = null
      state.patient = null
      state.library = null
      state.category = null
      state.search = null
    },
    clearSearch(state) {
      state.search = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginPending = true
        state.loginError = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginPending = false
        state.token = action.payload.token
        state.patient = action.payload.patient
      })
      .addCase(login.rejected, (state, action) => {
        state.loginPending = false
        state.loginError = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null
        state.patient = null
        state.library = null
        state.category = null
      })
      .addCase(fetchLibrary.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchLibrary.fulfilled, (state, action) => {
        state.loading = false
        state.library = action.payload
      })
      .addCase(fetchLibrary.rejected, (state) => {
        state.loading = false
      })
      .addCase(fetchCategory.pending, (state) => {
        state.categoryLoading = true
        state.category = null
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.categoryLoading = false
        state.category = action.payload
      })
      .addCase(fetchCategory.rejected, (state) => {
        state.categoryLoading = false
      })
      .addCase(createAccess.pending, (state) => {
        state.accessPending = true
        state.accessError = null
      })
      .addCase(createAccess.fulfilled, (state, action) => {
        state.accessPending = false
        state.token = action.payload.token
        state.patient = action.payload.patient
      })
      .addCase(createAccess.rejected, (state, action) => {
        state.accessPending = false
        state.accessError = action.payload
      })
      .addCase(searchLibrary.pending, (state) => {
        state.searchPending = true
      })
      .addCase(searchLibrary.fulfilled, (state, action) => {
        state.searchPending = false
        state.search = action.payload
      })
      .addCase(searchLibrary.rejected, (state) => {
        state.searchPending = false
      })
      .addCase(markViewed.fulfilled, (state, action) => {
        const id = action.payload.id
        const row = state.category?.unlocked?.find((r) => r.id === id)
        if (row && !row.viewed) {
          row.viewed = true
          state.category.progress.viewed += 1
        }
      })
  },
})

export const { sessionExpired, clearSearch } = portalSlice.actions

export const isLoggedIn = (state) => Boolean(state.portal.token)
export const getPatient = (state) => state.portal.patient
export const getLibrary = (state) => state.portal.library
export const getCategory = (state) => state.portal.category

export default portalSlice.reducer
