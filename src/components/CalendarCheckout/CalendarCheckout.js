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
  updateTime
} from '../../features/checkout/checkoutSlice'
import {
  createDateFromDateString,
  dateExistsInAppointments,
  getNewMonthViewByDate,
  getOptionsTime,
  nextAvailableDate,
  tileDisabled
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
      setValue(new Date(nextDate))
      dispatch(updateDate(nextDate))
    } else if (dateExistsInAppointments(appointments, localDate)) {
      setValue(new Date(localDate))
      dispatch(updateDate(localDate))
    } else {
      const nextDate = nextAvailableDate(appointments)
      setValue(new Date(nextDate))
      dispatch(updateDate(nextDate))
    }
  }, [appointments, dispatch, localDate])

  const onClick = (value) => {
    const date =  value.toISOString()
    dispatch(updateDate(date))
    dispatch(updateDateSelected(date))
    
    setValue(value)
  }

  const handleTimeSelect = (e) => {
    dispatch(updateTime(e.value))
  }

  const changeViewMonth = ( view, action) => {
    if (action !== 'onChange' && view === 'month') {
      const date = getNewMonthViewByDate(
        appointments,
        new Date(localDate),
        view,
        action
      )
      setValue(new Date(date))
      dispatch(updateDate(date))
    }
  }

  const handleOnActiveStartDateChange = ({ action, view }) =>
    changeViewMonth( view, action)

  const selectedDate = (dateSelected && time) ? `${dateSelected.split('T')[0]} ${time}`: ''

  return (
    <div className='wizard-body'>
      <div className='step initial active'>
        <h5 className='calendar-title'>
          Seleccioná la fecha y hora para tu turno: {selectedDate}
        </h5>
        <div className='calendar-time-picker-container'>
          <div className='calendar-picker-container'>
            <Calendar
              locale='es'
              className=''
              view='month'
              tileDisabled={({ date, view }) =>
                tileDisabled(appointments, { date, view })
              }
              value={value}
              onChange={setValue}
              maxDate={createDateFromDateString(appointments[appointments.length - 1].date)}
              minDate={new Date(nextAvailableDate(appointments))}
              onClickDay={(value, event) => onClick(value, event)}
              onActiveStartDateChange={handleOnActiveStartDateChange}
              activeStartDate={value}
              next2Label=''
              prev2Label=''
            />
          </div>
          <div className='calendar-time-container'>
            <div className='time-container'>
              <Select
                className='react-select-containerC'
                classNamePrefix='react-selectC'
                isSearchable={false}
                placeholder='Select a time'
                options={getOptionsTime(appointments, localDate)}
                menuIsOpen
                onChange={handleTimeSelect}
                isDisabled={!dateSelected}
                {... time ? { defaultValue: { label: time, value: time } }: {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarCheckout
