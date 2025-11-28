import { useEffect, useState, useRef } from 'react'
import {
  isoDateToSpanishString,
  formatNumber,
  getDisplayPaymentMethod,
} from '../../utils/utils'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetCartState } from '../../features/checkout/checkoutSlice'
import { deleteCartItems } from '../../features/cart/cartSlice'
import { resetStep } from '../../features/stepsCheckout/stepsSlice'
import { whatsAppUrl } from '../../utils/utils'
import { whatsAppNumber } from '../../utils/utils'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orderId } = useParams()
  const [orderData, setOrderData] = useState(null)
  
  // Ref para evitar limpiar múltiples veces
  const cartCleared = useRef(false)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}`)
      .then((response) => {
        setOrderData(response.data)
      })
      .catch((error) => {
        navigate('/error')
      })
  }, [orderId, navigate])

  // Limpiar carrito cuando la orden está confirmada
  useEffect(() => {
    if (orderData && orderData.status === 'done' && !cartCleared.current) {
      console.log('✅ Orden confirmada (done), limpiando carrito...')
      
      // Limpiar carrito
      dispatch(deleteCartItems())
      dispatch(resetStep())
      dispatch(resetCartState())
      
      // Marcar como limpiado
      cartCleared.current = true
      
      console.log('🧹 Carrito limpiado')
    }
  }, [orderData, dispatch])

  if (orderData === null) return <div className='spinner'></div>
  else {
    const spanishPurchaseDate = isoDateToSpanishString(orderData.created_at)
    const spanishAppointmentDate = orderData.appointment_date 
      ? isoDateToSpanishString(orderData.appointment_date)
      : null
    const isMercadoPago = orderData.payment_type === 'mercadopago'
    const isPaid = orderData.status === 'done' // Cambiado de 'paid' a 'done'

    return (
      <section className='confirm'>
        <br/>
        <br/>
        <br/>
        <h3 className='confirm__h3'>
          {isPaid || isMercadoPago 
            ? '¡Tu compra fue realizada con éxito!' 
            : '¡Tu pedido fue registrado!'}
        </h3>
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
            {spanishAppointmentDate && (
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
            {orderData.status && (
              <li className='data__list-li-not'>
                <p className='data__list-title'>ESTADO</p>
                <p className='data__list-description'>
                  {orderData.status === 'done' ? 'Completado' : 
                   orderData.status === 'pending' ? 'Pendiente' : 
                   orderData.status === 'canceled' ? 'Cancelado' : 
                   orderData.status}
                </p>
              </li>
            )}
          </ul>
        </div>

        {/* Mostrar instrucciones de transferencia solo si NO es Mercado Pago Y el pago NO está completado */}
        {!isMercadoPago && orderData.status !== 'done' && (
          <div className='confirm__data-transfer'>
            <p className='data__transfer-title '>
              Para hacer efectiva tu compra, realizá el pago a la siguiente cuenta:
            </p>
            <h6 className='data__transfer-cbu'>
              CVU: 0000003100040321195999 <br />
              Titular: PAOLA VANESA, NICOLA <br />
              Mercado Pago <br />
            </h6>
            <h5 className='data__transfer-text-important '>
              IMPORTANTE: Si no recibís un e-mail de confirmación, por favor,
              revisá tu casilla de spam.
              <br />
              Ante cualquier inconveniente, escribime por WhatsApp:
              <div className='confirm__data-transfer'>
                <a href={whatsAppUrl} className='data__transfer-email'>
                  <h6 className='data__transfer-title'>🌐 {whatsAppNumber}</h6>
                </a>
              </div>
            </h5>
          </div>
        )}

        {/* Mensaje especial para Mercado Pago o pagos completados */}
        {(isMercadoPago || isPaid) && orderData.status === 'done' && (
          <div className='confirm__data-transfer'>
            <h5 className='data__transfer-text-important '>
              ¡Gracias por tu compra! Tu pago fue procesado exitosamente.
              <br />
              Recibirás un email de confirmación en los próximos minutos.
              <br />
              Si no recibís el correo, revisá tu casilla de spam.
              <br />
              <br />
              Ante cualquier inconveniente, escribime por WhatsApp:
              <div className='confirm__data-transfer'>
                <a href={whatsAppUrl} className='data__transfer-email'>
                  <h6 className='data__transfer-title'>🌐 {whatsAppNumber}</h6>
                </a>
              </div>
            </h5>
          </div>
        )}
      </section>
    )
  }
}

export default OrderSuccess