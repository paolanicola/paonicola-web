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
    if (!loading && !success && Object.keys(order.orderData).length === 0) {
      navigate('/')
    }
  }, [loading, success, order.orderData, navigate])

  if (loading) {
    return <div className='spinner'></div>
  } else if (success) {
    return <OrderSuccess orderData={order.orderData} />
  } else if (!success && Object.keys(order.orderData).length === 0) {
    return <OrderFailure />
  } else {
    return null
  }
}
