import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import Select, { components, DropdownIndicator, DropdownIndicatorProps } from 'react-select';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import 'moment/locale/es';
import { getAllAppointments } from '../../features/appointments/appointmentsSlice';
import { getFecha, updateFecha, updateTest } from '../../features/cartState/cartStateSlice';

moment.locale('es');
let tomorrow = moment().add(1, 'days').startOf('day');
tomorrow = tomorrow.toDate();

function CalendarCheckout() {
  const { fecha } = useSelector((state) => state.cartState);
  //fechas
  const appointments = useSelector(getAllAppointments);
  const dates = appointments.map((appointment) => moment(appointment.fecha));

  const [dateCalendar, setDateCalendar] = useState(fecha ? new Date(fecha) : dates[0].toDate()); //primer dia disponible. asumimos que vienen ordenados
  const [month, setMonth] = useState(tomorrow);
  const [year, setYear] = useState(tomorrow);
  const [render1, setRender1] = useState('');
  let stringdate = moment(tomorrow).format('YYYY-MM-DD');
  var mydate = new Date(stringdate + 'T03:00:00Z');
  //console.log(mydate);

  const dispatch = useDispatch();
  // console.log(cartState);

  const meses = new Map();

  dates.map((d) => meses.set(d.format('MMMM'), d.toDate()));
  const iterator1 = meses[Symbol.iterator]();
  let arrai = [];
  let index = 0;
  for (const item of iterator1) {
    arrai[index++] = {
      value: item[1],
      label: item[0],
    };
  }
  index = 0;
  const anios = new Map();
  dates.map((d) => anios.set(d.format('YYYY'), d.toDate()));
  const iterator2 = anios[Symbol.iterator]();
  let arrai2 = [];
  for (const item of iterator2) {
    arrai2[index++] = {
      value: item[1],
      label: item[0],
    };
  }

  const startOfMonth = moment().month(3).clone().startOf('month').format('YYYY-MM-DD');

  const optionsMontht = arrai.map((d) => ({
    value: d.value,
    label: d.label,
  }));
  const optionsMonth = optionsMontht;
  const [selectedOption, setSelectedOption] = useState(optionsMonth[0]);
  const optionsYeary = arrai2.map((d) => ({
    value: d.value,
    label: d.label,
  }));
  const optionsYear = optionsYeary;

  const customStyles = {
    control: () => ({
      // none of react-select's styles are passed to <Control />
    }),
  };

  const updateCalendar = () => {
    const moonLanding = new Date(year.getFullYear(), month.getMonth(), 1);
    //console.log(moonLanding);
    setDateCalendar(moonLanding);
  };
  const updateSelects = (e) => {
    console.log('actualizar selects');
    var mesletra = moment(e);
    var mes = optionsMontht.filter((date) => date.label === mesletra.format('MMMM')).map((date) => date);
    //console.log(mesletra.format('MMMM'));
    //console.log(JSON.stringify(mes[0]) + 'actualizando selects');
    setSelectedOption(mes[0]);
  };

  const handleMonthTest = (selectedOption) => {
    setMonth(selectedOption.value);
    setSelectedOption(selectedOption);
    const moonLanding = new Date(year.getFullYear(), month.getMonth(), 1);
    setDateCalendar(moonLanding);
  };

  const handleYearTest = (e) => {
    setYear(e.value);
    updateCalendar();
  };

  useEffect(() => {
    // console.log('renderizo');
    // const moonLanding = new Date(year.getFullYear(), month.getMonth(), 1);
    // setValue(moonLanding);
    //console.log(dateCalendar + 'soy el date calendar');
    //dispatch(updateTest());
    renderizar(dateCalendar);
  }, [dispatch, dateCalendar]);

  const renderizar = (appoint) => {
    let fecha = appoint.toISOString().split('T')[0];
    let horas = [];
    appointments.map((ap) => (ap.fecha.split('T')[0] === fecha ? (horas = ap.horaDisponibles) : horas));
    horas === 0
      ? setRender1(<div>Sin horas</div>)
      : setRender1(
          horas.map((hora, index) => (
            <div key={index} className='time-select'>
              {hora}
            </div>
          ))
        );
  };

  const handleDateChange = (e) => {
    //console.log(e.toISOString().split('T')[0]);
    let fechaTemp = e.toISOString().split('T')[0];
    let temp = false;
    dates.map((appoint) => (appoint.isSame(fechaTemp) ? (temp = appoint) : ''));
    temp ? renderizar(temp) : setRender1(<div className='time-select'>Sin horas Disponibles</div>);
    setMonth(e);
    setYear(e);
    updateSelects(e);
    dispatch(updateFecha(e));
    setDateCalendar(e);
  };

  function isSameDay(a, b) {
    var temp = !(a.getTime() !== b.getTime());
    return temp;
  }

  function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of disabled dates
      var temp = dates.find((dDate) => isSameDay(dDate.toDate(), date));
      return !temp;
    }
  }

  return (
    <div className='wizard-body'>
      <div className='step initial active'>
        <h5 className='calendar-title'>Seleccioná la fecha y hora para tu turno:</h5>
        <div className='calendar-time-picker-container'>
          <div className='calendar-picker-container'>
            <div className='calendar-select-date'>
              <Select
                styles={customStyles}
                className='react-select-containerC'
                classNamePrefix='react-selectC'
                options={optionsMonth}
                //defaultValue={optionsMontht[0]}
                value={selectedOption}
                onChange={handleMonthTest}
              />
              <Select
                styles={customStyles}
                className='react-select-containerC'
                classNamePrefix='react-selectC'
                options={optionsYear}
                defaultValue={optionsYear[0]}
                onChange={handleYearTest}
              />
            </div>
            <Calendar
              locale
              className=''
              tileDisabled={tileDisabled}
              value={dateCalendar}
              onChange={handleDateChange}
              minDate={tomorrow}
              //maxDate={new Date(2022, 1, 28)}
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
