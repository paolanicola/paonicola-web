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
  const { loading, success, errors, orderData } = useSelector(getOrder)

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  useEffect(() => {
    if (!loading && !success && Object.keys(errors).length === 0) {
      navigate('/')
    }
  })

  if (loading) {
    return <div className='spinner'></div>
  }

  if (success) {
    return <OrderSuccess orderData={orderData} />
  }

  if (Object.keys(errors).length > 0) {
    return <OrderFailure errors={errors.errors} />
  }

  return null
}
