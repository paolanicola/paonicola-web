import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTotals } from '../../features/cart/cartSlice'
import { getOrderData } from '../../features/cartTotal'
import {
  isoDateToSpanishString,
  formatNumber,
  getDisplayPaymentMethod,
} from '../../utils/utils'

export default function ConfirmSale({ products }) {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const orderData = useSelector(getOrderData)
  const spanishPurchaseDate = isoDateToSpanishString(orderData.created_at)
  const spanishAppointmentDate = isoDateToSpanishString(
    orderData.appointment_date
  )

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  // show spinner until the order data comes from the api
  if (Object.keys(orderData).length === 0) {
    return <div className='spinner'></div>
  }

  return (
    <>
      <section className='confirm'>
        <h3 className='confirm__h3'>¡Tu compra fue realizada con éxito!</h3>
        <div className='confirm__data-sale'>
          <div className='data__nro '>
            <h6 className='data__nro-title'>NÚMERO DE PEDIDO:</h6>
            <h4 className='data__nro-number'>#{orderData.order_id}</h4>
          </div>
          <ul className='data__list'>
            <li className='data__list-li'>
              <p className='data__list-title'>FECHA DE COMPRA</p>
              <p className='data__list-description'>
                {spanishPurchaseDate.split('-')[0]}
              </p>
            </li>
            {orderData.appointment_date && (
              <li className='data__list-li'>
                <p className='data__list-title'>FECHA DEL TURNO</p>
                <p className='data__list-description'>
                  {spanishAppointmentDate}
                </p>
              </li>
            )}
            <li className='data__list-li'>
              <p className='data__list-title'>EMAIL</p>
              <p className='data__list-description'>
                {orderData.patient.email}
              </p>
            </li>
            <li className='data__list-li'>
              <p className='data__list-title'>TOTAL</p>
              <p className='data__list-description'>
                $ {formatNumber(orderData.total_price)}
              </p>
            </li>
            <li className='data__list-li-not'>
              <p className='data__list-title'>MÉTODO DE PAGO</p>
              <p className='data__list-description'>
                {getDisplayPaymentMethod(orderData.payment_type)}
              </p>
            </li>
          </ul>
        </div>
        <div className='confirm__data-transfer'>
          <p className='data__transfer-title '>
            Para hacer efectiva tu compra, realizá el pago la siguiente cuenta:
          </p>
          <h6 className='data__transfer-cbu'>
            CBU: 0000123456789123 / Alias test.test.test <br />
            Titular: Paola Nicola <br />
            Banco Provincia <br />
          </h6>
          <h5 className='data__transfer-text-important '>
            IMPORTANTE: Si no recibís un e-mail de confirmación, por favor,
            revisá tu casilla de spam.
            <br />
            Ante cualquier inconveniente, escribime a
            <a href='mailto:' className='data__transfer-email'>
              EMAIL
            </a>
          </h5>
        </div>
      </section>
    </>
  )
}
