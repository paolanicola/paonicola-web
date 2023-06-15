import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { getAllAppointments } from '../../features/appointments/appointmentsSlice'
import {
  deleteTime,
  getDate,
  getTime,
  updateDate,
  updateTime,
} from '../../features/cartState/cartStateSlice'

const CalendarCheckout = () => {
  const dispatch = useDispatch()
  const appointments = useSelector(getAllAppointments)
  const dates = appointments.map((appointment) => new Date(appointment.date))
  const [timeSelectComponent, setTimeSelectComponent] = useState('')
  const dateRedux = useSelector(getDate)
  const [value, setValue] = useState(null)
  const time = useSelector(getTime)

  const nextDateAvailableToToday = () => {
    const temp = new Date()
    const temp2 = dates.filter((date) => date > temp)
    return temp2[0]
  }

  const dateIntoAppointments = () => {
    const temp = new Date(dateRedux)
    const dat = appointments.map((appointment) => new Date(appointment.date))
    const temp2 = dat.filter((date) => date.getTime() === temp.getTime())
    return temp2.length > 0
  }

  useEffect(() => {
    if (dateRedux === null) {
      const nextDate = nextDateAvailableToToday()
      setValue(nextDate)
      dispatch(updateDate(nextDate))
    } else if (dateIntoAppointments()) {
      setValue(new Date(dateRedux))
      dispatch(updateDate(new Date(dateRedux)))
    } else {
      const nextDate = nextDateAvailableToToday()
      setValue(nextDate)
      dispatch(updateDate(nextDate))
    }
  }, [])

  useEffect(() => {
    renderize(dateRedux)
  }, [dateRedux])

  const onClick = (value, event) => {
    dispatch(updateDate(value))
    setValue(value)
  }

  const handleTimeSelect = (e) => {
    dispatch(updateTime(e.value))
  }

  const renderize = (appoint) => {
    let date = null
    const tmp = nextDateAvailableToToday()
    const [year, month, day] = [
      tmp.getFullYear(),
      (tmp.getMonth() + 1).toString().padStart(2, '0'),
      tmp.getDate().toString().padStart(2, '0'),
    ]
    date = `${year}-${month}-${day}T03:00:00Z`

    if (appoint === null) {
      date = date.toString().split('T')[0]
    } else if (typeof appoint === 'string') {
      date = appoint.split('T')[0]
    } else {
      date = appoint.toISOString().split('T')[0]
    }

    let times = []
    appointments.forEach((ap) => {
      const apDate = new Date(ap.date)
      const apDateSplit = apDate.toISOString().split('T')[0]

      if (apDateSplit === date) {
        times = ap.available_hours
      }
    })

    const optionsTime = times.map((h) => ({
      value: h,
      label: h,
    }))

    const defaultSelectedTime =
      time !== null ? { value: time, label: time } : ''

    setTimeSelectComponent(
      <div>
        <Select
          className='react-select-containerC'
          classNamePrefix='react-selectC'
          isSearchable={false}
          placeholder='Select a time'
          options={optionsTime}
          menuIsOpen
          defaultValue={defaultSelectedTime}
          onChange={handleTimeSelect}
        />
      </div>
    )
  }

  const changeViewMonth = (activeStartDate, view, action) => {
    dispatch(deleteTime())
    if (
      action !== 'onChange' &&
      view !== 'year' &&
      view !== 'decade' &&
      view !== 'century'
    ) {
      const day = dates.find(
        (d) => d.format('M') === activeStartDate.getMonth() + 1
      )
      setValue(day.toDate())
      dispatch(updateDate(day.toDate()))
    }
  }

  const isSameDay = (a, b) => {
    const temp = !(a.getTime() !== b.getTime())
    return temp
  }

  const isCurrentMonth = (a, b) => {
    let temp = false
    if (isSameDay(a, b)) {
      const date = new Date(dateRedux)
      temp = b.getMonth() + 1 === date.getMonth() + 1
    }
    return temp
  }

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const temp = dates.find((d) => isCurrentMonth(d, date))
      return !temp
    }
  }

  return (
    <div className='wizard-body'>
      <div className='step initial active'>
        <h5 className='calendar-title'>
          Select the date and time for your appointment:
        </h5>
        <div className='calendar-time-picker-container'>
          <div className='calendar-picker-container'>
            <Calendar
              locale
              className=''
              tileDisabled={tileDisabled}
              value={value}
              onChange={setValue}
              maxDate={new Date(dates[dates.length - 1])}
              minDate={nextDateAvailableToToday()}
              onClickDay={(value, event) => onClick(value, event)}
              onActiveStartDateChange={({ action, activeStartDate, view }) =>
                changeViewMonth(activeStartDate, view, action)
              }
              activeStartDate={value}
              next2Label=''
              prev2Label=''
            />
          </div>
          <div className='calendar-time-container'>
            <div className='time-container'>{timeSelectComponent}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarCheckout
