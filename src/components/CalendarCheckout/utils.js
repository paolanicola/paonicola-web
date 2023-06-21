export const nextAvailableDate = (appointments) => {
  const now = new Date()

  const futureAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) > now
  )
  return futureAppointments[0].date
}

export const dateExistsInAppointments = (appointments, localDate) => {
  const temp = new Date(localDate)
  const temp2 = appointments.filter(
    (appointment) => new Date(appointment.date).getTime() === temp.getTime()
  )
  return temp2.length > 0
}

export const tileDisabled = (appointments, { date, view }) => {
  const formattedDate = date.toISOString().split('T')[0]

  // Check if the view is 'month'
  if (view === 'month') {
    // Disable the tile if there is an appointment on the date
    return !appointments.some(
      (appointment) => appointment.date === formattedDate
    )
  }

  // Disable the tile for all other views
  return true
}

export const getOptionsTime = (appointments, localDate) =>
  appointments
    .filter((appointment) => appointment.date === localDate)
    .map(({ available_hours }) => ({
      value: available_hours,
      label: available_hours,
    }))

export const getNewMonthViewByDate = (
  appointments,
  activeStartDate,
  view,
  action
) => {
  let date
  if (action === 'next') {
    const activeMonth = activeStartDate.getMonth()
    const activeYear = activeStartDate.getFullYear()
    const nextMonthDate = new Date(activeYear, activeMonth + 1, 1)

    const validNextDates = appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date)
        return (
          appointmentDate.getMonth() !== activeMonth ||
          appointmentDate.getFullYear() !== activeYear
        )
      })
      .map((appointment) => new Date(appointment.date))
      .filter((appointmentDate) => appointmentDate > nextMonthDate)

    if (validNextDates.length > 0) {
      date = new Date(Math.min(...validNextDates))
    } else {
      date = nextMonthDate
    }
  }

  if (action === 'prev') {
    const activeMonth = activeStartDate.getMonth()
    const activeYear = activeStartDate.getFullYear()
    const prevMonthDate = new Date(activeYear, activeMonth - 1, 1)

    const validPrevDates = appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date)
        return (
          appointmentDate.getMonth() !== activeMonth ||
          appointmentDate.getFullYear() !== activeYear
        )
      })
      .map((appointment) => new Date(appointment.date))
      .filter((appointmentDate) => appointmentDate < prevMonthDate)

    if (validPrevDates.length > 0) {
      date = new Date(Math.max(...validPrevDates))
    } else {
      date = prevMonthDate
    }
  }

  return date
}
