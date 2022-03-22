import React from 'react';

function FormPatientOrder() {
  return (
    <div className='form-container'>
      <h5 class=''>Datos de la persona que realizará la compra y tomará el turno</h5>
      <div className='caja'>
        <form className='form'>
          <div className='form-row'>
            <div className='form-row-name'>
              <label>Nombre</label>
              <input type='text' className='form-input' name='nombre' />
            </div>
            <div className='form-row-lastName'>
              <label>Apellido</label>
              <input type='text' className='form-input' name='apellido' />
            </div>
          </div>
          <label>Email</label>
          <input type='email' className='form-input' name='email' />
          <label>Telefono</label>
          <input type='tel' className='form-input' name='telefono' />
        </form>
      </div>
    </div>
  );
}

export default FormPatientOrder;
