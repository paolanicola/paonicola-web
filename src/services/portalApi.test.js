import {
  getToken,
  getStoredPatient,
  storeSession,
  clearSession,
} from './portalApi'

describe('portalApi session storage', () => {
  afterEach(() => localStorage.clear())

  it('stores and reads the session', () => {
    storeSession({ token: 'tok123', patient: { id: 1, name: 'Agustín' } })
    expect(getToken()).toBe('tok123')
    expect(getStoredPatient()).toEqual({ id: 1, name: 'Agustín' })
  })

  it('clears the session completely', () => {
    storeSession({ token: 'tok123', patient: { id: 1 } })
    clearSession()
    expect(getToken()).toBeNull()
    expect(getStoredPatient()).toBeNull()
  })

  it('survives corrupt patient JSON', () => {
    localStorage.setItem('portal_patient', '{no-es-json')
    expect(getStoredPatient()).toBeNull()
  })
})
