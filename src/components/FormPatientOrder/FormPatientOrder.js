import React from 'react';
import { useForm } from 'react-hook-form';

function FormPatientOrder() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  console.log(watch('example')); // watch input value by passing the name of it

  return (
    <div className='form-container'>
      <h5 class=''>Datos de la persona que realizará la compra y tomará el turno</h5>
      <div className='caja'>
        <form id='formularioTurno' className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form-row'>
            <div className='form-row-name'>
              <label>Nombre</label>
              <input {...register('firstName', { required: true, pattern: /^[A-Za-z]+$/i, maxLength: 20 })} />
              {errors.firstName?.type === 'required' && 'Nombre es requerido'}
            </div>
            <div className='form-row-lastName'>
              <label>Apellido</label>
              <input {...register('lastName', { required: true, pattern: /^[A-Za-z]+$/i, maxLength: 40 })} />
              {errors.lastName && 'Apellido es requerido'}
            </div>
          </div>
          <label>Email</label>
          <input
            placeholder='bluebill1049@hotmail.com'
            type='text'
            {...register('email', {
              required: 'this is required',
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email address',
              },
            })}
          />
          <p>{errors.email && 'Email es requerido'}</p>

          <label>Telefono</label>
          <input {...register('telefono', { required: true, pattern: /^[0-9]+$/i, maxLength: 13 })} />
          <p>{errors.telefono && 'Telefono es requerido'}</p>
          <input type='submit' value='Verificar' className='carrito-finalizar' />
        </form>
      </div>
    </div>
  );
}

export default FormPatientOrder;
