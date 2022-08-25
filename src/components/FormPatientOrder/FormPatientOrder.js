import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateVerificado,
  getFormulario,
  updateformulario
} from '../../features/cartState/cartStateSlice'
import { loadPreference } from '../../features/producto'
import { nextStep, backStep } from '../../features/stepsCheckout/stepsSlice'

function FormPatientOrder() {
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.step)

  const form = useSelector(getFormulario)

  const handleNextStep = () => {
    dispatch(nextStep())
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm()
  const onSubmit = (data) => {
    dispatch(updateformulario(data))
    dispatch(updateVerificado(true))
    dispatch(loadPreference())
    handleNextStep()
  }

  useEffect(() => {
    clearErrors()
  }, [step])

  return (
    <div className='form-container'>
      <p className='form-title'>
        Datos de la persona que realizará la compra y tomará el turno
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
                className={errors.nombre && 'input_error'}
                type='text'
                defaultValue={form?.nombre}
                {...register('nombre', {
                  required: {
                    value: true,
                    message: 'Nombre requerdio'
                  },
                  pattern: {
                    value: /^[a-z ,.'-]+$/i,
                    message: 'Formato incorrecto, solo letras'
                  }
                })}
              />
              {errors.nombre && (
                <span className={errors.nombre && 'span_error'}>
                  {errors.nombre.message}
                </span>
              )}
            </div>
            <div className='form-row-lastName'>
              <label>Apellido</label>
              <input
                className={errors.apellido && 'input_error'}
                type='text'
                defaultValue={form?.apellido}
                {...register('apellido', {
                  required: {
                    value: true,
                    message: 'Apellido requerdio'
                  },
                  pattern: {
                    value: /^[a-z ,.'-]+$/i,
                    message: 'Formato incorrecto, solo letras'
                  }
                })}
              />
              {errors.apellido && (
                <span className={errors.apellido && 'span_error'}>
                  {errors.apellido.message}
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
                message: 'Email requerido'
              },
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Formato del email incorrecto'
              }
            })}
          />
          {errors.email && (
            <span className={errors.email && 'span_error'}>
              {errors.email.message}
            </span>
          )}

          <p>
            <label>Telefono</label>
          </p>
          <input
            className={errors.telefono && 'input_error'}
            type='number'
            defaultValue={form?.telefono}
            {...register('telefono', {
              required: { value: true, message: 'Telefono requerido' },
              valueAsNumber: { value: true, message: 'Solo ingrese numeros' }
            })}
          />
          {errors.telefono && (
            <span className={errors.telefono && 'span_error'}>
              {errors.telefono.message}
            </span>
          )}
        </form>
      </div>
    </div>
  )
}

export default FormPatientOrder
