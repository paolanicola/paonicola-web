export const createDateFromDateString = (dateString) => {
  const year = parseInt(dateString.substr(0, 4)) 
  const month = parseInt(dateString.substr(5, 2)) - 1 
  const day = parseInt(dateString.substr(8, 2)) 

  return new Date(year, month, day)
}

// Return next available date as a string
export const nextAvailableDate = (appointments) => {
  const now = new Date()

  const futureAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) > now
  )
  return futureAppointments.length ? futureAppointments[0].date: null
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
  if (view === 'month') {
    return !appointments.some(
      (appointment) => appointment.date === formattedDate
    )
  }

  return true
}

const isSameDate = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  d1.setUTCHours(0, 0, 0, 0)
  d2.setUTCHours(0, 0, 0, 0)

  return d1.getTime() === d2.getTime()
}

export const getOptionsTime = (appointments, localDate) => {

  const result =  appointments
  .filter((appointment) => isSameDate(appointment.date,localDate))
  .map(({ available_hours }) => ({
    value: available_hours,
    label: available_hours,
  }))

  return result
}
 
// Return date string
export const getNewMonthViewByDate = (appointments, activeStartDate, view, action) => {
  const date = new Date(activeStartDate)

  if (view === 'month') {
    if (action === 'next') {
      date.setUTCMonth(date.getUTCMonth() )
    } else if (action === 'prev') {
      date.setUTCMonth(date.getUTCMonth())
    }
  }

  const availableDates = appointments
    .map(appointment => appointment.date)
    .filter(appointmentDate => {
      const dateObj = new Date(appointmentDate)
      if (action === 'next') {
        return dateObj > activeStartDate && dateObj.getUTCMonth() !== date.getUTCMonth()
      } else if (action === 'prev') {
        return dateObj < activeStartDate && dateObj.getUTCMonth() !== date.getUTCMonth()
      }
      return false
    })
    .sort((a, b) => new Date(a) - new Date(b))

  if(action === 'next'){
   return  availableDates.length > 0 ? availableDates[0]: appointments[appointments.length - 1].date
  }

  if(action === 'prev'){
    return  availableDates.length > 0 ? availableDates[availableDates.length - 1]: appointments[0].date
   }

}

