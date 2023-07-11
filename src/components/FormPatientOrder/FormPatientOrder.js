import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  getForm,
  updateForm,
  updateVerified,
} from '../../features/checkout/checkoutSlice'
import { nextStep } from '../../features/stepsCheckout/stepsSlice'

function FormPatientOrder({ withCalendar }) {
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.step)

  const form = useSelector(getForm)

  const handleNextStep = () => {
    dispatch(nextStep())
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm()
  const onSubmit = (data) => {
    dispatch(updateForm(data))
    dispatch(updateVerified(true))
    handleNextStep()
  }

  useEffect(() => {
    clearErrors()
  }, [clearErrors, step])

  const handleInputChange = (event) => {
    dispatch(
      updateForm({
        ...form,
        [event.target.name]: event.target.value,
      })
    )
  }

  return (
    <div className='form-container'>
      <p className='form-title'>
        {withCalendar
          ? 'Datos de la persona que realizará la compra y tomará el turno'
          : 'Datos de la persona que realizará la compra'}
      </p>
      <div className='caja'>
        <form
          id='formularioTurno'
          className='form'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='form-row'>
            <div className='form-row-name'>
              <label>Nombre</label>
              <input
                className={errors.name && 'input_error'}
                type='text'
                defaultValue={form?.name}
                {...register('name', {
                  required: {
                    value: true,
                    message: 'Nombre requerido',
                  },
                  onChange: handleInputChange,
                  pattern: {
                    value: /^[a-z ,.'-]+$/i,
                    message: 'Formato incorrecto, solo letras',
                  },
                })}
              />
              {errors.name && (
                <span className={errors.name && 'span_error'}>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className='form-row-lastName'>
              <label>Apellido</label>
              <input
                className={errors.lastname && 'input_error'}
                type='text'
                defaultValue={form?.lastname}
                {...register('lastname', {
                  required: {
                    value: true,
                    message: 'Apellido requerido',
                  },
                  onChange: handleInputChange,
                  pattern: {
                    value: /^[a-z ,.'-]+$/i,
                    message: 'Formato incorrecto, solo letras',
                  },
                })}
              />
              {errors.lastname && (
                <span className={errors.lastname && 'span_error'}>
                  {errors.lastname.message}
                </span>
              )}
            </div>
          </div>
          <label>Email</label>
          <input
            className={errors.email && 'input_error'}
            placeholder='ejemplo@ejemplo.com.ar'
            type='text'
            defaultValue={form?.email}
            {...register('email', {
              required: {
                value: true,
                message: 'Email requerido',
              },
              onChange: handleInputChange,
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Formato del email incorrecto',
              },
            })}
          />
          {errors.email && (
            <span className={errors.email && 'span_error'}>
              {errors.email.message}
            </span>
          )}

          <p>
            <label>Teléfono</label>
          </p>
          <input
            className={errors.phone && 'input_error'}
            type='number'
            onChange={handleInputChange}
            defaultValue={form?.phone}
            {...register('phone', {
              required: { value: true, message: 'Teléfono requerido' },
              valueAsNumber: { value: true, message: 'Solo ingrese números' },
              onChange: handleInputChange,
            })}
          />
          {errors.phone && (
            <span className={errors.phone && 'span_error'}>
              {errors.phone.message}
            </span>
          )}
        </form>
      </div>
    </div>
  )
}

export default FormPatientOrder
