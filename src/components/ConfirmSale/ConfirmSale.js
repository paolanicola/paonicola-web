import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTotals } from '../../features/cart/cartSlice'
import { getOrder } from '../../features/cartTotal'
import OrderSuccess from '../OrderSuccess'
import OrderFailure from '../OrderFailure'
import { useNavigate } from 'react-router-dom'

export default function ConfirmSale() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector((state) => state.cart)
  const order = useSelector(getOrder)
  const loading = order.loading
  const success = order.success

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  useEffect(() => {
    // if api call is not in progress and there are no error messages
    if (!loading && Object.keys(order.errors).length === 0) {
      navigate('/')
    }
  })

  if (loading) {
    return <div className='spinner'></div>
  } else if (success) {
    return <OrderSuccess orderData={order.orderData} />
  } else if (Object.keys(order.errors).length !== 0) {
    return <OrderFailure errors={order.errors.errors} />
  } else {
    return null
  }
}
