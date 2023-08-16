import React, { useEffect, useRef } from 'react'
import 'react-calendar/dist/Calendar.css'
import { useDispatch, useSelector } from 'react-redux'

import { FormPatientOrder, PaymentMethods } from '..'
import { getTotals, isCartWithCalendar } from '../../features/cart/cartSlice'
import { getSelectedAppointmentId } from '../../features/checkout/checkoutSlice'
import CalendarCheckout from '../CalendarCheckout'
import CartTotal from '../CartTotal/CartTotal'
import Steps from '../Steps/Steps'
import { resetStep } from '../../features/stepsCheckout/stepsSlice'

const Checkout = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const withCalendar = useSelector(isCartWithCalendar)
  const { step } = useSelector((state) => state.step)
  const selectedAppointmentId = useSelector(getSelectedAppointmentId)
  const cartTotalRef = useRef(null)

  const handlePaymentMethodChangedToMercadoPago = () => {
    cartTotalRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    dispatch(getTotals())
    if (selectedAppointmentId === null && withCalendar) {
      dispatch(resetStep())
    }
  }, [cart, selectedAppointmentId, dispatch, withCalendar])

  const stepCurrent = withCalendar
    ? {
        0: <CalendarCheckout />,
        1: <FormPatientOrder withCalendar={withCalendar} />,
        2: (
          <PaymentMethods
            paymentMethodChangedToMercadoPago={
              handlePaymentMethodChangedToMercadoPago
            }
          />
        ),
      }
    : {
        1: <FormPatientOrder withCalendar={withCalendar} />,
        2: (
          <PaymentMethods
            paymentMethodChangedToMercadoPago={
              handlePaymentMethodChangedToMercadoPago
            }
          />
        ),
      }

  return (
    <div>
      <section className='first-section first-section-checkout'>
        <div className='container-checkout'>
          <div className='row-checkout'>
            <Steps />
            <div className='row-body'>
              {stepCurrent[step]}
              <CartTotal ref={cartTotalRef} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Checkout
