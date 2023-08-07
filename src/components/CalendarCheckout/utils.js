import dayjs from 'dayjs'

// Return next available date as a string
export const nextAvailableDate = (appointments) => {
  const now = new Date()

  const futureAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) > now
  )
  return futureAppointments.length ? futureAppointments[0].date : null
}

export const dateExistsInAppointments = (appointments, localDate) => {
  const temp = new Date(localDate)
  const temp2 = appointments.filter(
    (appointment) => new Date(appointment.date).getTime() === temp.getTime()
  )
  return temp2.length > 0
}

export const tileDisabled = (appointments, { date, view }) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD')

  if (view === 'month') {
    return !appointments.some((appointment) =>
      dayjs(appointment.date).isSame(formattedDate, 'day')
    )
  }

  return true
}

export const getOptionsTime = (appointments, localDate) => {
  return appointments
    .filter((appointment) => dayjs(appointment.date).isSame(localDate, 'date'))
    .map(({ available_hours, id }) => ({
      value: id,
      label: available_hours,
    }))
}

// Return date string
export const getNewMonthViewByDate = (
  appointments,
  activeStartDate,
  view,
  action
) => {
  const date = dayjs(activeStartDate)

  if (view === 'month') {
    if (action === 'next') {
      date.add(1, 'month')
    } else if (action === 'prev') {
      date.subtract(1, 'month')
    }
  }

  const availableDates = appointments
    .map((appointment) => appointment.date)
    .filter((appointmentDate) => {
      const dateObj = dayjs(appointmentDate)
      if (action === 'next') {
        return (
          dateObj.isAfter(activeStartDate, 'day') &&
          !dateObj.isSame(date, 'month')
        )
      } else if (action === 'prev') {
        return (
          dateObj.isBefore(activeStartDate, 'day') &&
          !dateObj.isSame(date, 'month')
        )
      }
      return false
    })
    .sort((a, b) => dayjs(a).diff(b))

  if (action === 'next') {
    return availableDates.length > 0
      ? availableDates[0]
      : appointments[appointments.length - 1].date
  }

  if (action === 'prev') {
    return availableDates.length > 0
      ? availableDates[availableDates.length - 1]
      : appointments[0].date
  }
}

export const newDate = (stringDate) => {
  return dayjs(stringDate).toDate()
}

export const isoStringToHumanReadable = (isoString, time) => {
  const date = isoString ? dayjs(isoString).format('DD/MM/YYYY') : ''
  return `${date} ${time ?? ''}`
}
