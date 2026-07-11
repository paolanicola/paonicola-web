import reducer, {
  login,
  logout,
  fetchLibrary,
  fetchCategory,
  markViewed,
  sessionExpired,
  isLoggedIn,
} from './portalSlice'

const initial = reducer(undefined, { type: '@@INIT' })

describe('portalSlice', () => {
  it('stores the session on login.fulfilled', () => {
    const state = reducer(initial, {
      type: login.fulfilled.type,
      payload: { token: 'tok123', patient: { id: 1, name: 'Agustín' } },
    })
    expect(state.token).toBe('tok123')
    expect(state.patient.name).toBe('Agustín')
    expect(isLoggedIn({ portal: state })).toBe(true)
  })

  it('keeps the error message on login.rejected', () => {
    const state = reducer(initial, {
      type: login.rejected.type,
      payload: 'Email o contraseña incorrectos',
    })
    expect(state.loginError).toBe('Email o contraseña incorrectos')
    expect(state.loginPending).toBe(false)
  })

  it('clears everything on logout and sessionExpired', () => {
    const logged = reducer(initial, {
      type: login.fulfilled.type,
      payload: { token: 't', patient: { id: 1 } },
    })
    for (const action of [{ type: logout.fulfilled.type }, sessionExpired()]) {
      const state = reducer(logged, action)
      expect(state.token).toBeNull()
      expect(state.patient).toBeNull()
      expect(state.library).toBeNull()
    }
  })

  it('stores library and category payloads', () => {
    const library = { categories: [], overall: { percent: 0 } }
    const withLibrary = reducer(initial, {
      type: fetchLibrary.fulfilled.type,
      payload: library,
    })
    expect(withLibrary.library).toEqual(library)

    const category = { unlocked: [], locked: [], progress: { viewed: 0, total: 0 } }
    const withCategory = reducer(withLibrary, {
      type: fetchCategory.fulfilled.type,
      payload: category,
    })
    expect(withCategory.category).toEqual(category)
  })

  it('marks a category resource as viewed and bumps progress once', () => {
    const base = reducer(initial, {
      type: fetchCategory.fulfilled.type,
      payload: {
        unlocked: [{ id: 7, viewed: false }],
        locked: [],
        progress: { viewed: 0, total: 1 },
      },
    })
    const once = reducer(base, {
      type: markViewed.fulfilled.type,
      payload: { id: 7, viewed: true },
    })
    expect(once.category.unlocked[0].viewed).toBe(true)
    expect(once.category.progress.viewed).toBe(1)

    // idempotent: a second fulfil does not double-count
    const twice = reducer(once, {
      type: markViewed.fulfilled.type,
      payload: { id: 7, viewed: true },
    })
    expect(twice.category.progress.viewed).toBe(1)
  })
})
