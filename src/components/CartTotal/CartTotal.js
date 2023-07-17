import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
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
import { setMethod } from '../../features/validators'
import { formatNumber } from '../../utils/utils'
import { messages } from '../../utils/messages'
import { submitOrder } from '../../features/cartTotal'
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'

function CartTotal() {
  const cart = useSelector((state) => state.cart)
  const { data: method } = useSelector((state) => state.validators)
  const { preference } = useSelector((state) => state.products)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.step)
  const withCalendar = useSelector(isCartWithCalendar)
  const isCheckoutCalendarReady = useSelector(isCheckoutCalendarValid)
  const [variantTrans, setVariantTrans] = useState('carrito-finalizar__oculto ')
  const [variantMP, setVariantMP] = useState('carrito-finalizar__oculto')
  const selectedAppointmentId = useSelector(getSelectedAppointmentId)
  const personalData = useSelector(getForm)
  initMercadoPago('TEST-94c7b04c-6ca8-478b-b3a8-85199c019b3b', {
    locale: 'es-AR',
  })

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

  const handleEnd = () => {
    const schedule_id = withCalendar ? selectedAppointmentId : null
    dispatch(submitOrder(method, schedule_id, personalData, products))

    dispatch(deleteCartItems())
    dispatch(resetStep())
    dispatch(resetCartState())
    setVariantTrans('carrito-finalizar__oculto')
    setVariantMP('carrito-finalizar__oculto')
  }

  const handleVerificationSelectMethod = (text) => {
    toast.warning(text)
  }

  const handleBackStep = () => {
    if (step === 2) {
      setVariantTrans('carrito-finalizar__oculto ')
      setVariantMP('carrito-finalizar__oculto ')
      dispatch(updateVerified(false))
    }
    dispatch(setMethod(''))
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
        setVariantMP('carrito-finalizar')
      }
      if (method === 'deposit') {
        setVariantTrans('carrito-finalizar')
        setVariantMP('carrito-finalizar__oculto')
      }
    }
  }, [method, step])

  const handleOnClick = (event) => {
    if (step === 0) {
      event.preventDefault()
      handleNextStep()
    }

    if (step === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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

      {method === 'mercadopago' && step === 2 && (
        <CardPayment
          initialization={{
            amount: 100,
            preferenceId: '207446753-ea3adb2e-a4f2-41dd-a656-11cb01b8772c',
          }}
          customization={{
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
            },
            visual: {
              style: {
                theme: 'default', // | 'dark' | 'bootstrap' | 'flat'
                successColor: 'green',
              },
            },
          }}
          onSubmit={async (param) => {
            console.log(param)
          }}
        />
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

        <Link
          to='/checkout/confirm'
          onClick={actionEnd}
          className={variantTrans}
        >
          Pagar
        </Link>
        <a href={preference} onClick={actionEnd} className={variantMP}>
          Pagar
        </a>
        <div className=''></div>
      </div>
    </div>
  )
}

export default CartTotal
