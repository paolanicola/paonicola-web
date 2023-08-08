import React, { useEffect, useState } from 'react'
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
  mercadoPagoLoadSuccess,
  methodIsLoading,
  resetMethod,
} from '../../features/validators'
import { formatNumber } from '../../utils/utils'
import { messages } from '../../utils/messages'
import { submitOrder } from '../../features/cartTotal'
import {
  initMercadoPago,
  CardPayment,
  StatusScreen,
} from '@mercadopago/sdk-react'

function CartTotal() {
  const cart = useSelector((state) => state.cart)
  const method = useSelector(getMethod)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.step)
  const withCalendar = useSelector(isCartWithCalendar)
  const isCheckoutCalendarReady = useSelector(isCheckoutCalendarValid)
  const [variantTrans, setVariantTrans] = useState('carrito-finalizar__oculto ')
  const selectedAppointmentId = useSelector(getSelectedAppointmentId)
  const personalData = useSelector(getForm)
  initMercadoPago(process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY, {
    locale: 'es-AR',
  })
  const mercadoPagoIsLoading = useSelector(methodIsLoading)
  const navigate = useNavigate()
  const [mercadoPagoPaymentId, setMercadoPagoPaymentId] = useState(null)
  const [mercadoPagoPaymentFailed, setMercadoPagoPaymentFailed] =
    useState(false)

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

  const handleEnd = (mercadoPagoPaymentId = 'null') => {
    const scheduleId = withCalendar ? selectedAppointmentId : null
    dispatch(
      submitOrder(
        method,
        scheduleId,
        personalData,
        products,
        mercadoPagoPaymentId
      )
    )

    dispatch(deleteCartItems())
    dispatch(resetStep())
    dispatch(resetCartState())
    setVariantTrans('carrito-finalizar__oculto')
  }

  const handleMercadoPagoEnd = () => {
    dispatch(deleteCartItems())
    dispatch(resetStep())
    dispatch(resetCartState())
    setVariantTrans('carrito-finalizar__oculto')
  }

  const handleVerificationSelectMethod = (text) => {
    toast.warning(text)
  }

  const handleBackStep = () => {
    if (step === 2) {
      setVariantTrans('carrito-finalizar__oculto ')
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
    variantBack = 'carrito-finalizar carrito-finalizar-next '
    variantNext = 'carrito-finalizar__oculto'
    actionBack = () => handleBackStep()
    actionVerificationMethod = () =>
      handleVerificationSelectMethod(messages.paymentMethodMissing)
    actionEnd = () => handleEnd()
  }

  useEffect(() => {
    if (step === 2) {
      if (method === 'mercadopago') {
        setVariantTrans('carrito-finalizar__oculto')
      }
      if (method === 'deposit') {
        setVariantTrans('carrito-finalizar')
      }
    }
  }, [method, step])

  const handleOnClick = (event) => {
    if (step === 0) {
      event.preventDefault()
      handleNextStep()
    }
    // if user is using a mobile device, scroll to top after clicking on "next"
    window.innerWidth < 768 && window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // mercadoPago begin

  const initialization = {
    amount: cart.cartTotalAmount,
  }

  const onSubmit = async (formData) => {
    return new Promise((resolve, reject) => {
      const orderData = {
        payment_type: method,
        schedule_id: withCalendar ? selectedAppointmentId : null,
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
      const data = {
        orderData: orderData,
        mercadoPagoData: JSON.stringify(formData),
      }
      console.log({ data })
      fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/process_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      })
        .then((response) => response.json())
        .then((response) => {
          console.log({ response })
          resolve()
          // response.id ?? setMercadoPagoPaymentId(response.id)
          // if (response.status === 'approved') {
          //   handleMercadoPagoEnd()
          //   navigate('/checkout/confirm')
          //   resolve()
          // } else {
          //   setMercadoPagoPaymentFailed(true)
          // }
        })
        .catch((error) => {
          // manejar la respuesta de error al intentar crear el pago
          navigate('/error')
          reject()
        })
    })
  }

  const onError = async (error) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error)
  }

  const onReady = async () => {
    dispatch(mercadoPagoLoadSuccess())
  }

  const statusOnError = async (error) => {
    // callback llamado solicitada para todos los casos de error de Brick
    console.log(error)
  }
  const statusOnReady = async () => {
    /*
   Callback llamado cuando Brick está listo.
   Aquí puede ocultar cargamentos de su sitio, por ejemplo.
 */
  }

  const handleRetryPayment = () => {
    setMercadoPagoPaymentId(null)
  }

  // mercadoPago end

  return (
    <div className='carrito-total-container'>
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
              {' '}
              $ {formatNumber(cart.cartTotalAmount)}
            </td>
          </tr>
        </tbody>
      </table>

      {mercadoPagoIsLoading && !mercadoPagoPaymentId && (
        <div className='spinner spinnerMercadoPago'></div>
      )}

      {method === 'mercadopago' && step === 2 && !mercadoPagoPaymentId && (
        <CardPayment
          initialization={initialization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      )}

      {method === 'mercadopago' && step === 2 && mercadoPagoPaymentId && (
        <StatusScreen
          initialization={{ paymentId: mercadoPagoPaymentId }}
          onReady={statusOnReady}
          onError={statusOnError}
        />
      )}

      <div className='carrito-total-buttons back'>
        <button onClick={actionBack} type={typeBack} className={variantBack}>
          Atrás
        </button>
        {method === 'mercadopago' && mercadoPagoPaymentFailed && (
          <button onClick={handleRetryPayment} className={variantBack}>
            Reintentar
          </button>
        )}
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

        <Link
          to='/checkout/confirm'
          onClick={actionEnd}
          className={variantTrans}
        >
          Pagar
        </Link>

        <div className=''></div>
      </div>
    </div>
  )
}

export default CartTotal
