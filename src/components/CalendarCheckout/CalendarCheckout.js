import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import { useSelector, useDispatch } from 'react-redux';
import 'react-datetime-picker/dist/DateTimePicker.css';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import 'moment/locale/es';
import { getAllAppointments } from '../../features/appointments/appointmentsSlice';
import { getFecha, updateFecha } from '../../features/cartState/cartStateSlice';

moment.locale('es');
let tomorrow = moment().add(1, 'days').startOf('day');
tomorrow = tomorrow.toDate();

function CalendarCheckout() {
  //const cartState = useSelector((state) => state.cartState);
  const appointments = useSelector(getAllAppointments);
  const dates = appointments.map((appointment) => moment(appointment.fecha));
  const [render1, setRender1] = useState('');
  const [value, setValue] = useState(new Date(useSelector(getFecha)));
  const dispatch = useDispatch();
  //let stringdate = moment(tomorrow).format('YYYY-MM-DD');
  //var mydate = new Date(stringdate + 'T03:00:00Z');

  const meses = new Map();
  dates.map((d) => meses.set(d.format('MMMM'), d.toDate()));

  //console.log(useSelector(getFecha) + 'fechitaaaaaaaaaaaaaaaa');
  let dato = useSelector(getFecha);
  if (dato === null) {
    dispatch(updateFecha(tomorrow));
  } else {
    // console.log(new Date(dato) + 'datoooooooooooooooo');
    updateFecha(new Date(dato));
  }

  //dispatch(updateFecha(useSelector(getFecha)?useSelector(getFecha):tomorrow));

  useEffect(() => {
    //console.log('useEffect');
    renderizar(value);
  }, [value]);

  const onClick = (value, event) => {
    //console.log('onClick');
    //console.log(event);
    dispatch(updateFecha(value));
    setValue(value);
  };

  //------------------------EStilos del calendar
  const customStyles = {
    control: () => ({
      // none of react-select's styles are passed to <Control />
    }),
  };

  const [selectHour, setSelectHour] = useState(null);

  const renderizar = (appoint) => {
    let fecha = appoint.toISOString().split('T')[0];
    let horas = [];
    appointments.map((ap) => (ap.fecha.split('T')[0] === fecha ? (horas = ap.horaDisponibles) : horas));
    const optionsMontht = horas.map((d) => ({
      value: d,
      label: d,
    }));
    setRender1(
      <div>
        <Select
          styles={customStyles}
          className='react-select-containerC'
          classNamePrefix='react-selectC'
          //isDisabled
          isSearchable={false}
          placeholder='seleccione hora'
          options={optionsMontht}
          menuIsOpen
          defaultValue={optionsMontht[0]}
          //value={tomorrow}
          // onChange={handleYearTest}
        />
        {/*horas.map((hora, index) => (
          <div key={index} className='time-select '>
            <button className='nada '>{hora}</button>
          </div>
        ))*/}
      </div>
    );
  };

  const changeViewMonth = (activeStartDate, view, action) => {
    //console.log(activeStartDate);
    if (action !== 'onChange') {
      //console.log('Changed view to: ', activeStartDate, view);
      let dia = dates.find((day) => day.format('M') == activeStartDate.getMonth() + 1);
      //console.log(dia.toDate());
      setValue(dia.toDate());
      dispatch(updateFecha(dia.toDate()));
    }
  };

  function isSameDay(a, b) {
    var temp = !(a.getTime() !== b.getTime());
    return temp;
  }

  function itsTrue(a, b) {
    var temp = false;
    if (isSameDay(a, b)) {
      dato = new Date(dato);
      //console.log(dato + ' assssssssssssssssssssssssssssssssssssssssssssss');
      temp = b.getMonth() + 1 == dato.getMonth() + 1;
    }
    return temp;
  }

  // Disable tiles in month view only
  function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      //console.log(date + ' tile disabled');
      // Check if a date React-Calendar wants to check is on the list of disabled dates
      //console.log(dato + ' d entro del tileeeeeeeeeeeeeeeeeee');
      var temp = dates.find((dDate) => itsTrue(dDate.toDate(), date));
      return !temp;
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
              maxDate={dates[7].toDate()}
              minDate={new Date()}
              onClickDay={(value, event) => onClick(value, event)}
              //maxDate={new Date(2022, 1, 28)}
              //onViewChange={({ action, activeStartDate, value, view }) => console.log('New view is: ', value)}
              onActiveStartDateChange={({ action, activeStartDate, value, view }) => changeViewMonth(activeStartDate, view, action)}
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
  );
}

export default CalendarCheckout;
