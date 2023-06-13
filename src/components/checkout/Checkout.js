import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import 'react-calendar/dist/Calendar.css'

import { getTotals } from '../../features/cart/cartSlice'
import Steps from '../Steps/Steps'
import CalendarCheckout from '../CalendarCheckout/CalendarCheckout'
import CartTotal from '../CartTotal/CartTotal'
import { FormPatientOrder, PaymentMethods } from '..'

function Checkout() {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])
  const { step } = useSelector((state) => state.step)
  //console.log(step);

  const stepCurrent = {
    0: <CalendarCheckout />,
    1: <FormPatientOrder />,
    2: <PaymentMethods />
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
