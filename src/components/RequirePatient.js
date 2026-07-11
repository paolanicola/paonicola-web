import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { isLoggedIn } from '../features/portal/portalSlice'

/** Route guard: portal pages require a patient session. */
export default function RequirePatient({ children }) {
  const logged = useSelector(isLoggedIn)
  const location = useLocation()

  if (!logged) {
    return <Navigate to='/ingresar' replace state={{ from: location.pathname }} />
  }
  return children
}
