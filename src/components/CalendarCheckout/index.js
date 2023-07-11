import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllAppointments,
  getAllAppointmentsFailed,
  loadAppointments,
} from '../../features/appointments'
import CalendarCheckout from './CalendarCheckout'
import { useNavigate } from 'react-router-dom'

const Index = () => {
  const dispatch = useDispatch()
  const appointments = useSelector(getAllAppointments)
  const failed = useSelector(getAllAppointmentsFailed)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(loadAppointments())
    failed && navigate('/error')
  }, [dispatch, failed])

  return appointments.length > 0 ? (
    <CalendarCheckout appointments={appointments} />
  ) : null
}

export default Index
