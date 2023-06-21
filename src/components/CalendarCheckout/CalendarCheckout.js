import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import {
  deleteTime,
  getDate,
  getTime,
  updateDate,
  updateTime,
} from '../../features/cartState/cartStateSlice'
import {
  dateExistsInAppointments,
  getNewMonthViewByDate,
  getOptionsTime,
  nextAvailableDate,
  tileDisabled,
} from './utils'

const CalendarCheckout = ({ appointments }) => {
  const dispatch = useDispatch()
  const localDate = useSelector(getDate)
  const [value, setValue] = useState(null)
  const time = useSelector(getTime)

  useEffect(() => {
    if (localDate === null) {
      const nextDate = nextAvailableDate(appointments)
      setValue(nextDate)
      dispatch(updateDate(nextDate))
    } else if (dateExistsInAppointments(appointments, localDate)) {
      setValue(new Date(localDate))
      dispatch(updateDate(localDate))
    } else {
      const nextDate = nextAvailableDate(appointments)
      setValue(nextDate)
      dispatch(updateDate(nextDate))
    }
  }, [appointments])

  const onClick = (value, event) => {
    dispatch(updateDate(value))
    setValue(value)
  }

  const handleTimeSelect = (e) => {
    dispatch(updateTime(e.value))
  }

  const changeViewMonth = (activeStartDate, view, action) => {
    dispatch(deleteTime())

    if (action !== 'onChange' && view === 'month') {
      const date = getNewMonthViewByDate(
        appointments,
        activeStartDate,
        view,
        action
      )
      setValue(date)
      dispatch(updateDate(date))
    }
  }

  const handleOnActiveStartDateChange = ({ action, activeStartDate, view }) =>
    changeViewMonth(activeStartDate, view, action)

  return (
    <div className='wizard-body'>
      <div className='step initial active'>
        <h5 className='calendar-title'>
          Seleccioná la fecha y hora para tu turno:
        </h5>
        <div className='calendar-time-picker-container'>
          <div className='calendar-picker-container'>
            <Calendar
              locale='es'
              className=''
              tileDisabled={({ date, view }) =>
                tileDisabled(appointments, { date, view })
              }
              value={value}
              onChange={setValue}
              maxDate={new Date(appointments[appointments.length - 1].date)}
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarCheckout
