import { useEffect, useState } from 'react'
import {
  isoDateToSpanishString,
  formatNumber,
  getDisplayPaymentMethod,
} from '../../utils/utils'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { whatsAppUrl } from '../../utils/utils'
import { whatsAppNumber } from '../../utils/utils'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [orderData, setOrderData] = useState(null)

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

  if (orderData === null) return <div className='spinner'></div>
  else {
    const spanishPurchaseDate = isoDateToSpanishString(orderData.created_at)
    const spanishAppointmentDate = orderData.appointment_date 
      ? isoDateToSpanishString(orderData.appointment_date)
      : null
    const isMercadoPago = orderData.payment_type === 'mercadopago'
    const isPaid = orderData.status === 'paid'

    return (
      <section className='confirm'>
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
                  {orderData.status === 'paid' ? 'Pagado' : 
                   orderData.status === 'pending' ? 'Pendiente' : 
                   orderData.status}
                </p>
              </li>
            )}
          </ul>
        </div>

        {/* Mostrar instrucciones de transferencia solo si NO es Mercado Pago o si el pago no está aprobado */}
        {!isMercadoPago && (
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

        {/* Mensaje especial para Mercado Pago */}
        {isMercadoPago && isPaid && (
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