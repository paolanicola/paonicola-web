import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { useSelector, useDispatch } from 'react-redux'
import 'react-datetime-picker/dist/DateTimePicker.css'
import Select from 'react-select'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import moment from 'moment'
import 'moment/locale/es'
import { getAllAppointments } from '../../features/appointments/appointmentsSlice'
import {
  getFecha,
  getHora,
  updateFecha,
  updateHora,
  deleteHora
} from '../../features/cartState/cartStateSlice'

moment.locale('es')

function CalendarCheckout() {
  //const cartState = useSelector((state) => state.cartState);
  const appointments = useSelector(getAllAppointments)
  const dates = appointments.map((appointment) => moment(appointment.fecha))
  const [render1, setRender1] = useState('')
  const dispatch = useDispatch()
  //let stringdate = moment(tomorrow).format('YYYY-MM-DD');
  //var mydate = new Date(stringdate + 'T03:00:00Z');
  const meses = new Map()
  dates.map((d) => meses.set(d.format('MMMM'), d.toDate()))

  const dateRedux = useSelector(getFecha)

  const nextDateAvailbleToToday = () => {
    const temp = moment()
    const temp2 = dates.filter((date) => date > temp)
    return temp2[0].toDate()
  }

  const [value, setValue] = useState(null)

  const dateIntoAppoints = () => {
    const temp = new Date(dateRedux)
    const dat = appointments.map((appointment) => new Date(appointment.fecha))
    const temp2 = dat.filter((date) => date.getTime() === temp.getTime())
    return temp2.length > 0
  }

  useEffect(() => {
    if (dateRedux === null) {
      setValue(nextDateAvailbleToToday())
      dispatch(updateFecha(nextDateAvailbleToToday()))
    } else if (dateIntoAppoints()) {
      setValue(new Date(dateRedux))
      dispatch(updateFecha(new Date(dateRedux)))
    } else {
      setValue(nextDateAvailbleToToday())
      dispatch(updateFecha(nextDateAvailbleToToday()))
    }
  }, [])

  useEffect(() => {
    renderizar(dateRedux)
  }, [value])

  const onClick = (value, event) => {
    dispatch(updateFecha(value))
    setValue(value)
  }

  //------------------------EStilos del calendar
  const customStyles = {
    control: () => ({
      // none of react-select's styles are passed to <Control />
    })
  }

  const handleHourSelect = (e) => {
    dispatch(updateHora(e.value))
  }

  let hora = useSelector(getHora)

  const renderizar = (appoint) => {
    let fecha = null
    if (typeof appoint === 'string') {
      fecha = appoint.toString().split('T')[0]
    } else {
      fecha = appoint.toISOString().split('T')[0]
    }
    let horas = []
    appointments.map((ap) =>
      ap.fecha.toString().split('T')[0] === fecha ? (horas = ap.horaDisponibles) : horas
    )
    const optionsHour = horas.map((d) => ({
      value: d,
      label: d
    }))
    let horaSelecionadaDefecto = hora !== null ? { value: hora, label: hora } : optionsHour[0]
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
    if (action !== 'onChange' && view !== 'year' && view !== 'decade' && view !== 'century') {
      let dia = dates.find((day) => day.format('M') == activeStartDate.getMonth() + 1)
      setValue(dia.toDate())
      dispatch(updateFecha(dia.toDate()))
    }
  }

  function isSameDay(a, b) {
    var temp = !(a.getTime() !== b.getTime())
    return temp
  }

  function itsTrue(a, b) {
    var temp = false
    if (isSameDay(a, b)) {
      let dato = new Date(dateRedux)
      temp = b.getMonth() + 1 == dato.getMonth() + 1
    }
    return temp
  }

  // Disable tiles in month view only
  function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of disabled dates
      var temp = dates.find((dDate) => itsTrue(dDate.toDate(), date))
      return !temp
    }
  }

  return (
    <div className='wizard-body'>
      <div className='step initial active'>
        <h5 className='calendar-title'>Seleccioná la fecha y hora para tu turno:</h5>
        <div className='calendar-time-picker-container'>
          <div className='calendar-picker-container'>
            <Calendar
              locale
              className=''
              tileDisabled={tileDisabled}
              value={value}
              onChange={setValue}
              maxDate={dates[dates.length - 1].toDate()}
              minDate={nextDateAvailbleToToday()}
              onClickDay={(value, event) => onClick(value, event)}
              //maxDate={new Date(2022, 1, 28)}
              //onViewChange={({ action, activeStartDate, value, view }) => console.log('New view is: ', value)}
              onActiveStartDateChange={({ action, activeStartDate, value, view }) =>
                changeViewMonth(activeStartDate, view, action)
              }
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
