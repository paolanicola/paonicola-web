import React, { useState } from 'react';
import Calendar from 'react-calendar';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
function CalendarCheckout() {
  const [value, onChange] = useState(new Date());
  return (
    <div class='wizard-body'>
      <div class='step initial active'>
        <h5>Seleccioná la fecha y hora para tu turno:</h5>
        {
          //<Calendar onChange={onChange} value={value} />
        }
      </div>
      <div>
        {
          //<DateTimePicker onChange={onChange} value={value} />
        }
      </div>
    </div>
  );
}

export default CalendarCheckout;
