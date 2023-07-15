import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import {
  getDate,
  getDateSelected,
  getTime,
  updateDate,
  updateDateSelected,
  updateTime,
  updateSelectedAppointmentId,
} from '../../features/checkout/checkoutSlice'
import {
  dateExistsInAppointments,
  getNewMonthViewByDate,
  getOptionsTime,
  nextAvailableDate,
  tileDisabled,
  getAppointmentId,
  newUtcDate,
} from './utils'

const CalendarCheckout = ({ appointments }) => {
  const dispatch = useDispatch()
  const localDate = useSelector(getDate)
  const dateSelected = useSelector(getDateSelected)
  const [value, setValue] = useState(null)
  const time = useSelector(getTime)

  useEffect(() => {
    if (!localDate) {
      const nextDate = nextAvailableDate(appointments)
      setValue(newUtcDate(nextDate))
      dispatch(updateDate(nextDate))
    } else if (dateExistsInAppointments(appointments, localDate)) {
      setValue(newUtcDate(localDate))
      dispatch(updateDate(localDate))
    } else {
      const nextDate = nextAvailableDate(appointments)
      setValue(newUtcDate(nextDate))
      dispatch(updateDate(nextDate))
    }
  }, [appointments, dispatch, localDate])

  const handleOnClickDay = (value) => {
    const stringDate = value.toISOString()
    // dispatch(updateDate(stringDate))
    dispatch(updateDateSelected(stringDate))
    setValue(value)
  }

  const handleTimeSelect = (e) => {
    const newTime = e.value
    dispatch(updateTime(newTime))

    // get appointment id based on date and time
    const selectedAppointmentId = getAppointmentId(
      appointments,
      dateSelected.split('T')[0],
      newTime
    )
    dispatch(updateSelectedAppointmentId(selectedAppointmentId))
  }

  const changeViewMonth = (view, action) => {
    if (action !== 'onChange') {
      const date = getNewMonthViewByDate(
        appointments,
        newUtcDate(localDate),
        view,
        action
      )
      setValue(newUtcDate(date))
      dispatch(updateDate(date))
      console.log({ date })
    }
  }

  const handleOnActiveStartDateChange = ({ action, view }) =>
    changeViewMonth(view, action)

  // iso string to human readable date and time
  const dateTimeSelected =
    (dateSelected !== null
      ? `${dateSelected.split('T')[0].split('-')[2]}/${
          dateSelected.split('T')[0].split('-')[1]
        }/${dateSelected.split('T')[0].split('-')[0]}`
      : '') + (time !== null ? ` ${time}` : '')

  return (
    <div className='wizard-body'>
      <div className='step initial active'>
        <h4 className='calendar-title'>
          Seleccioná la fecha y hora para tu turno: {dateTimeSelected}
        </h4>
        <div className='calendar-time-picker-container'>
          <div className='calendar-picker-container'>
            <Calendar
              locale='es'
              className=''
              view='month'
              minDetail='month'
              showNeighboringMonth={false}
              tileDisabled={({ date, view }) =>
                tileDisabled(appointments, { date, view })
              }
              maxDate={newUtcDate(appointments[appointments.length - 1].date)}
              minDate={newUtcDate(nextAvailableDate(appointments))}
              onClickDay={handleOnClickDay}
              onActiveStartDateChange={handleOnActiveStartDateChange}
              activeStartDate={value}
            />
          </div>
          <div className='calendar-time-container'>
            <div className='time-container'>
              <Select
                className='react-select-containerC'
                classNamePrefix='react-selectC'
                isSearchable={false}
                placeholder='Select a time'
                options={
                  dateSelected ? getOptionsTime(appointments, dateSelected) : []
                }
                menuIsOpen
                onChange={handleTimeSelect}
                isDisabled={!dateSelected}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarCheckout
