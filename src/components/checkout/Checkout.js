import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import 'react-calendar/dist/Calendar.css'

import { FormPatientOrder, PaymentMethods } from '..'
import {
  getAllAppointments,
  loadAppointments,
} from '../../features/appointments/index'
import { getTotals } from '../../features/cart/cartSlice'
import CalendarCheckout from '../CalendarCheckout/CalendarCheckout'
import CartTotal from '../CartTotal/CartTotal'
import Steps from '../Steps/Steps'

function Checkout() {
  const dispatch = useDispatch()
  const appointments = useSelector(getAllAppointments)
  const cart = useSelector((state) => state.cart)
  useEffect(() => {
    dispatch(getTotals())
    dispatch(loadAppointments())
  }, [cart, dispatch])
  const { step } = useSelector((state) => state.step)
  const stepCurrent = {
    0:
      appointments.length > 0 ? (
        <CalendarCheckout appointments={appointments} />
      ) : null,
    1: <FormPatientOrder />,
    2: <PaymentMethods />,
  }

  return (
    <div>
      <section className='first-section first-section-checkout'>
        <div className='container-checkout'>
          <div className='row-checkout'>
            <Steps />
            <div className='row-body'>
              {stepCurrent[step]}
              <CartTotal />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Checkout
