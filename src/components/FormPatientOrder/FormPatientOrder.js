import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getForm,
  updateForm,
  updateVerified,
  resetCartState,
  getSelectedAppointmentId,
} from '../../features/checkout/checkoutSlice'
import { nextStep, resetStep } from '../../features/stepsCheckout/stepsSlice'
import {
  deleteCartItems,
  getAllProductsCart,
} from '../../features/cart/cartSlice'

function FormPatientOrder({ withCalendar }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { step } = useSelector((state) => state.step)
  const cart = useSelector((state) => state.cart)
  const products = useSelector(getAllProductsCart)
  const selectedAppointmentId = useSelector(getSelectedAppointmentId)
  const form = useSelector(getForm)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNextStep = () => {
    dispatch(nextStep())
  }
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm()
  
  const onSubmit = async (data) => {
    dispatch(updateForm(data))
    dispatch(updateVerified(true))
    
    // 🎁 Si el carrito es gratis (total = 0), crear orden directamente
    if (cart.cartTotalAmount === 0) {
      await createFreeOrder(data)
    } else {
      // Si no es gratis, continuar al paso de métodos de pago
      handleNextStep()
    }
  }

  const createFreeOrder = async (personalData) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      const scheduleId = withCalendar ? selectedAppointmentId : null
      
      const orderData = {
        order: {
          payment_type: 'free',
          appointment_id: scheduleId,
          product_ids_and_quantities: products.map((product) => [
            product.id,
            product.cartQuantity,
          ]),
          patient_info: {
            email: personalData.email,
            name: personalData.name,
            lastname: personalData.lastname,
            phone: personalData.phone,
          },
        }
      }

      console.log('🎁 Creating free order:', orderData)

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const responseData = await response.json()
      
      console.log('📦 Response from backend:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || 'Error al crear la orden')
      }

      // Limpiar carrito
      dispatch(deleteCartItems())
      dispatch(resetStep())
      dispatch(resetCartState())
      
      // Mostrar mensaje de éxito
      toast.success('¡Reserva confirmada exitosamente!')
      
      // Redirigir a confirmación
      navigate(`/checkout/confirm/${responseData.order_id}`)
      
    } catch (error) {
      console.error('❌ Error creating free order:', error)
      toast.error(error.message || 'Error al procesar la reserva')
      setIsProcessing(false)
    }
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
                name='given-name'
                autoComplete='given-name'
                defaultValue={form?.name}
                disabled={isProcessing}
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
                name='family-name'
                autoComplete='family-name'
                defaultValue={form?.lastname}
                disabled={isProcessing}
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
            type='email'
            name='email'
            autoComplete='email'
            defaultValue={form?.email}
            disabled={isProcessing}
            {...register('email', {
              required: {
                value: true,
                message: 'Email requerido',
              },
              onChange: handleInputChange,
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
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
            type='tel'
            name='tel'
            autoComplete='tel'
            onChange={handleInputChange}
            defaultValue={form?.phone}
            disabled={isProcessing}
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
          
          {isProcessing && (
            <div className='spinner-container' style={{ marginTop: '20px', textAlign: 'center' }}>
              <div className='spinner'></div>
              <p>Procesando reserva...</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default FormPatientOrder