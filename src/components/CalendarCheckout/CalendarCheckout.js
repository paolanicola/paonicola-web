import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import 'moment/locale/es';
import { getAllAppointments } from '../../features/appointments/appointmentsSlice';

moment.locale('es');
let tomorrow = moment().add(1, 'days').startOf('day');
tomorrow = tomorrow.toDate();

function CalendarCheckout() {
  //const { fecha } = useSelector((state) => state.cartState);
  const appointments = useSelector(getAllAppointments);
  const dates = appointments.map((appointment) => moment(appointment.fecha));
  const [dateCalendar, setDateCalendar] = useState(dates[0].toDate());
  const [render1, setRender1] = useState('');
  //const dispatch = useDispatch();
  let stringdate = moment(tomorrow).format('YYYY-MM-DD');
  var mydate = new Date(stringdate + 'T03:00:00Z');

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
  const optionsMontht = arrai.map((d) => ({
    value: d.value,
    label: d.label,
  }));
  const optionsMonth = optionsMontht;
  const [selectedMonthOption, setSelectedMonthOption] = useState(optionsMonth[0]);
  const [selectedYearOption, setSelectedYearOption] = useState(optionsMonth[0].value.getFullYear());

  const handleMonthTest = (e) => {
    setSelectedYearOption(e.value.getFullYear());
    setSelectedMonthOption(e);
    console.log(e);
    // debugger;
    //setDateCalendar(e.value);
  };

  useEffect(() => {
    //sconsole.log(dateCalendar);
    setDateCalendar(dateCalendar);
    renderizar(dateCalendar);
  }, [dateCalendar]);

  const renderizar = (appoint) => {
    let fecha = appoint.toISOString().split('T')[0];
    let horas = [];
    appointments.map((ap) => (ap.fecha.split('T')[0] === fecha ? (horas = ap.horaDisponibles) : horas));
    setRender1(
      horas.map((hora, index) => (
        <div key={index} className='time-select'>
          {hora}
        </div>
      ))
    );
  };

  const handleDateChange = (e) => {
    setDateCalendar(e);
  };

  function isSameDay(a, b) {
    var temp = !(a.getTime() !== b.getTime());
    return temp;
  }

  // Disable tiles in month view only
  function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of disabled dates
      var temp = dates.find((dDate) => isSameDay(dDate.toDate(), date));
      return !temp;
    }
  }

  //------------------------EStilos del calendar
  const customStyles = {
    control: () => ({
      // none of react-select's styles are passed to <Control />
    }),
  };

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
                value={selectedMonthOption}
                onChange={handleMonthTest}
              />
              <Select
                styles={customStyles}
                className='react-select-containerC'
                classNamePrefix='react-selectC'
                isDisabled
                placeholder={selectedYearOption}
                // options={optionsYear}
                //defaultValue={optionsYear[0]}
                //value={tomorrow}
                // onChange={handleYearTest}
              />
            </div>
            <Calendar
              locale
              className=''
              tileDisabled={tileDisabled}
              value={dateCalendar}
              onChange={(value) => handleDateChange(value)}
              minDate={tomorrow}
              //onClickDay={(value, event) => setDateCalendar(value)}
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
