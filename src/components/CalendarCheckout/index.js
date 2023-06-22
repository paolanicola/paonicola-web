import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllAppointments,
  loadAppointments,
} from '../../features/appointments'
import CalendarCheckout from './CalendarCheckout'

const Index = () => {
  const dispatch = useDispatch()
  const appointments = useSelector(getAllAppointments)

  useEffect(() => {
    dispatch(loadAppointments())
  }, [dispatch])

  return (
    appointments.length > 0 ? <CalendarCheckout appointments={appointments} /> : null
  )
}

export default Index
