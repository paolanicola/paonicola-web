import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import 'react-datetime-picker/dist/DateTimePicker.css'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { getAllAppointments } from '../../features/appointments/appointmentsSlice'
import {
  deleteHora,
  getFecha,
  getHora,
  updateFecha,
  updateHora,
} from '../../features/cartState/cartStateSlice'

function CalendarCheckout() {
  //const cartState = useSelector((state) => state.cartState);
  const appointments = useSelector(getAllAppointments)
  const dates = appointments.map((appointment) => new Date(appointment.fecha))
  const [render1, setRender1] = useState('')
  const dispatch = useDispatch()
  //let stringdate = moment(tomorrow).format('YYYY-MM-DD');
  //var mydate = new Date(stringdate + 'T03:00:00Z');
  const meses = new Map()

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  dates.map((d) => meses.set(monthNames[d.getMonth()], new Date(d)))

  const dateRedux = useSelector(getFecha)
  const [value, setValue] = useState(null)

  const nextDateAvailableToToday = () => {
    const temp = new Date()
    const temp2 = dates.filter((date) => date > temp)
    return temp2[0]
  }

  const dateIntoAppoints = () => {
    const temp = new Date(dateRedux)
    const dat = appointments.map((appointment) => new Date(appointment.date))
    const temp2 = dat.filter((date) => date.getTime() === temp.getTime())
    return temp2.length > 0
  }

  useEffect(() => {
    if (dateRedux === null) {
      setValue(nextDateAvailableToToday())
      dispatch(updateFecha(nextDateAvailableToToday()))
    } else if (dateIntoAppoints()) {
      setValue(new Date(dateRedux))
      dispatch(updateFecha(new Date(dateRedux)))
    } else {
      setValue(nextDateAvailableToToday())
      dispatch(updateFecha(nextDateAvailableToToday()))
    }
  }, [])

  useEffect(() => {
    renderizar(dateRedux)
  }, [dateRedux])

  const onClick = (value, event) => {
    dispatch(updateFecha(value))
    setValue(value)
  }

  //------------------------EStilos del calendar
  const customStyles = {
    control: () => ({
      // none of react-select's styles are passed to <Control />
    }),
  }

  const handleHourSelect = (e) => {
    dispatch(updateHora(e.value))
  }

  let hora = useSelector(getHora)

  const renderizar = (appoint) => {
    let date = null
    const tmp = nextDateAvailableToToday()
    const year = tmp.getFullYear()
    const month = (tmp.getMonth() + 1).toString().padStart(2, '0')
    const day = tmp.getDate().toString().padStart(2, '0')
    date = `${year}-${month}-${day}T03:00:00Z`

    if (appoint === null) {
      date = date.toString().split('T')[0]
    } else if (typeof appoint === 'string') {
      date = appoint.split('T')[0]
    } else {
      date = appoint.toISOString().split('T')[0]
    }

    let horas = []
    console.log(appointments)
    appointments.forEach((ap) => {
      const apDate = new Date(ap.fecha)
      const apDateSplit = apDate.toISOString().split('T')[0]

      if (apDateSplit === date) {
        horas = ap.horaDisponibles
      }
    })

    const optionsHour = horas.map((d) => ({
      value: d,
      label: d,
    }))

    const horaSelecionadaDefecto =
      hora !== null ? { value: hora, label: hora } : ''

    setRender1(
      <div>
        <Select
          styles={customStyles}
          className='react-select-containerC'
          classNamePrefix='react-selectC'
          //isDisabled
          isSearchable={false}
          placeholder='seleccione hora'
          options={optionsHour}
          menuIsOpen
          defaultValue={horaSelecionadaDefecto}
          //value={tomorrow}
          onChange={handleHourSelect}
        />
        {/*horas.map((hora, index) => (
            <div key={index} className='time-select '>
              <button className='nada '>{hora}</button>
            </div>
          ))*/}
      </div>
    )
  }

  const changeViewMonth = (activeStartDate, view, action) => {
    dispatch(deleteHora())
    if (
      action !== 'onChange' &&
      view !== 'year' &&
      view !== 'decade' &&
      view !== 'century'
    ) {
      let dia = dates.find(
        (day) => day.format('M') === activeStartDate.getMonth() + 1
      )
      setValue(dia.toDate())
      dispatch(updateFecha(dia.toDate()))
    }
  }

  function isSameDay(a, b) {
    var temp = !(a.getTime() !== b.getTime())
    return temp
  }

  function itsTrue(a, b) {
    let temp = false
    if (isSameDay(a, b)) {
      const date = new Date(dateRedux)
      temp = b.getMonth() + 1 === date.getMonth() + 1
    }
    return temp
  }

  // Disable tiles in month view only
  function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of disabled dates
      const temp = dates.find((dDate) => itsTrue(dDate, date))
      return !temp
    }
  }

  return (
    <div className='wizard-body'>
      <div className='step initial active'>
        <h5 className='calendar-title'>
          Seleccioná la fecha y hora para tu turno:
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
              //maxDate={new Date(2022, 1, 28)}
              //onViewChange={({ action, activeStartDate, value, view }) => console.log('New view is: ', value)}
              onActiveStartDateChange={({
                action,
                activeStartDate,
                value,
                view,
              }) => changeViewMonth(activeStartDate, view, action)}
              activeStartDate={value}
              next2Label=''
              prev2Label=''
            />
          </div>
          <div className='calendar-time-container'>
            <div className='time-container'>{render1}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarCheckout
