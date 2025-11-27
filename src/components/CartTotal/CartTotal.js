import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  deleteCartItems,
  getAllProductsCart,
  isCartWithCalendar,
} from '../../features/cart/cartSlice'
import {
  getTime,
  isCheckoutCalendarValid,
  resetCartState,
  updateVerified,
  getForm,
  getSelectedAppointmentId,
} from '../../features/checkout/checkoutSlice'
import {
  backStep,
  nextStep,
  resetStep,
} from '../../features/stepsCheckout/stepsSlice'
import {
  getMethod,
  resetMethod,
} from '../../features/validators'
import { formatNumber } from '../../utils/utils'
import { messages } from '../../utils/messages'
import { submitOrder } from '../../features/cartTotal'

const CartTotal = forwardRef((props, ref) => {
  const cartTotalRef = useRef(null)

  useImperativeHandle(ref, () => ({
    scrollIntoView: () => {
      if (window.innerWidth <= 768 && cartTotalRef.current) {
        cartTotalRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    },
  }))

  const cart = useSelector((state) => state.cart)
  const method = useSelector(getMethod)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.step)
  const withCalendar = useSelector(isCartWithCalendar)
  const isCheckoutCalendarReady = useSelector(isCheckoutCalendarValid)
  const [variantTrans, setVariantTrans] = useState('carrito-finalizar__oculto')
  const [isProcessing, setIsProcessing] = useState(false)
  const selectedAppointmentId = useSelector(getSelectedAppointmentId)
  const personalData = useSelector(getForm)
  const navigate = useNavigate()

  useEffect(() => {
    if (!withCalendar && step === 0) {
      dispatch(nextStep())
    }
  }, [dispatch, step, withCalendar])

  const horario = useSelector(getTime)

  const handleNextStep = () => {
    if (withCalendar && horario === null) {
      handleVerificationSelectMethod(messages.appoitmentMissing)
    } else dispatch(nextStep())
  }

  const handleEnd = async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      const scheduleId = withCalendar ? selectedAppointmentId : null
      
      // Crear la orden
      const orderData = {
        order: {
          payment_type: method,
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

      console.log('🚀 Sending order data:', orderData)

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()
      
      console.log('📦 Response from backend:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden')
      }

      // Si es Mercado Pago, redirigir al checkout
      if (method === 'mercadopago') {
        if (data.mercadopago_init_point) {
          console.log('💳 Redirecting to MercadoPago:', data.mercadopago_init_point)
          
          // Limpiar el carrito antes de redirigir
          dispatch(deleteCartItems())
          dispatch(resetStep())
          dispatch(resetCartState())
          
          // Redirigir a Mercado Pago
          window.location.href = data.mercadopago_init_point
        } else {
          throw new Error('No se recibió el link de pago de MercadoPago')
        }
      } else {
        // Para transferencias bancarias, ir a la página de confirmación
        dispatch(deleteCartItems())
        dispatch(resetStep())
        dispatch(resetCartState())
        navigate(`/checkout/confirm/${data.order_id}`)
      }
    } catch (error) {
      console.error('❌ Error creating order:', error)
      toast.error(error.message || 'Error al procesar la orden')
      setIsProcessing(false)
    }
  }

  const handleVerificationSelectMethod = (text) => {
    toast.warning(text)
  }

  const handleBackStep = () => {
    if (step === 2) {
      setVariantTrans('carrito-finalizar__oculto')
      dispatch(updateVerified(false))
    }
    dispatch(resetMethod())
    dispatch(backStep())
  }

  const hora = useSelector(getTime)

  let variantBack = ''
  let variantNext = ''
  let actionBack = ''
  let typeBack = ''
  let typeNext = ''
  let formNext = ''
  let actionEnd = ''
  let actionVerificationMethod = ''

  if (step === 0) {
    variantBack = 'carrito-finalizar__oculto'
    variantNext = 'carrito-finalizar'
    variantNext += hora !== null ? '' : ' disabled'
    typeNext = 'submit'
  }

  if (step === 1) {
    variantBack = withCalendar
      ? 'carrito-finalizar carrito-finalizar-next'
      : 'carrito-finalizar__oculto'
    variantNext = 'carrito-finalizar'
    actionBack = () => handleBackStep()
    typeNext = 'submit'
    formNext = 'formularioTurno'
  }

  if (step === 2) {
    variantBack = 'carrito-finalizar carrito-finalizar-next'
    variantNext = 'carrito-finalizar__oculto'
    actionBack = () => handleBackStep()
    actionVerificationMethod = () =>
      handleVerificationSelectMethod(messages.paymentMethodMissing)
    actionEnd = () => handleEnd()
  }

  useEffect(() => {
    if (step === 2 && method !== '') {
      setVariantTrans('carrito-finalizar')
    } else {
      setVariantTrans('carrito-finalizar__oculto')
    }
  }, [method, step])

  const handleOnClick = (event) => {
    if (step === 0) {
      event.preventDefault()
      handleNextStep()
    }
    window.innerWidth < 768 && window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={cartTotalRef} className='carrito-total-container'>
      <h5 className='carrito-total-titulo'>Total del carrito</h5>

      <table className='carrito-total-items' cellPadding='0' cellSpacing='0'>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr className='carrito-total-item' key={product.id}>
                <td className='carrito-total-item-name'>
                  {product.name} x {product.cartQuantity}
                </td>
                <td className='carrito-total-item-price text-right'>
                  ${' '}
                  {product.active_promo
                    ? formatNumber(product.promo_price)
                    : formatNumber(product.price)}
                </td>
              </tr>
            ))
          ) : (
            <p>No hay productos</p>
          )}

          <tr>
            <td className='carrito-total-ch-td'></td>
          </tr>
          <tr className='carrito-resume'>
            <td className='carrito-resume-title'>Total</td>
            <td className='carrito-resume-price text-right'>
              $ {formatNumber(cart.cartTotalAmount)}
            </td>
          </tr>
        </tbody>
      </table>

      {isProcessing && (
        <div className='spinner spinnerMercadoPago'></div>
      )}

      <div className='carrito-total-buttons back'>
        <button onClick={actionBack} type={typeBack} className={variantBack}>
          Atrás
        </button>
        
        <button
          onClick={handleOnClick}
          type={typeNext}
          form={formNext}
          className={variantNext}
        >
          Siguiente
        </button>
        
        {(!withCalendar || (withCalendar && isCheckoutCalendarReady)) && (
          <button
            onClick={actionVerificationMethod}
            className={
              step !== 2 || method !== ''
                ? 'carrito-finalizar__oculto'
                : 'carrito-finalizar disabled'
            }
          >
            Pagar
          </button>
        )}

        <button
          onClick={actionEnd}
          disabled={isProcessing}
          className={variantTrans}
        >
          {isProcessing ? 'Procesando...' : 'Pagar'}
        </button>

        <div className=''></div>
      </div>
    </div>
  )
})

export default CartTotal