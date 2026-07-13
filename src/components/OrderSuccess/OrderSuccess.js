import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { resetCartState } from '../../features/checkout/checkoutSlice'
import { deleteCartItems } from '../../features/cart/cartSlice'
import { resetStep } from '../../features/stepsCheckout/stepsSlice'
import {
  isoDateToSpanishString,
  formatNumber,
  whatsAppLink,
  whatsAppNumber,
} from '../../utils/utils'

// Página post-pago (Tienda Rediseño): check + "Qué sigue" en pasos.
// Sigue viviendo en /checkout/confirm/:orderId — acá vuelve Mercado Pago.
const OrderSuccess = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orderId } = useParams()
  const [orderData, setOrderData] = useState(null)
  const cartCleared = useRef(false)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}`)
      .then((response) => setOrderData(response.data))
      .catch(() => navigate('/error'))
  }, [orderId, navigate])

  // Limpia el carrito legacy apenas la orden queda confirmada
  useEffect(() => {
    if (orderData && orderData.status === 'done' && !cartCleared.current) {
      dispatch(deleteCartItems())
      dispatch(resetStep())
      dispatch(resetCartState())
      cartCleared.current = true
    }
  }, [orderData, dispatch])

  if (orderData === null) return <div className='spinner' />

  const isMercadoPago = orderData.payment_type === 'mercadopago'
  const isPaid = orderData.status === 'done'
  const isPendingDeposit = !isMercadoPago && orderData.status !== 'done'
  const appointmentDate = orderData.appointment_date
    ? isoDateToSpanishString(orderData.appointment_date)
    : null

  const steps = [
    'Te escribimos hoy mismo por WhatsApp para darte la bienvenida.',
    appointmentDate
      ? `Tu primer encuentro quedó agendado: ${appointmentDate}. Recibís el link de la videollamada por WhatsApp.`
      : 'El acceso al material se habilita apenas se acredita el pago — revisá tu correo (y la casilla de spam).',
    appointmentDate
      ? 'Ya tenés acceso a la biblioteca de material del portal durante todo el programa.'
      : `Cualquier duda, escribinos por WhatsApp: ${whatsAppNumber}.`,
  ]

  return (
    <main className='gracias' data-testid='gracias'>
      <div className='gracias__check' aria-hidden='true'>✓</div>
      <h1 className='gracias__title'>
        {isPendingDeposit
          ? '¡Tu pedido fue registrado!'
          : appointmentDate
            ? '¡Listo! Tu lugar está reservado.'
            : '¡Listo! Ya es tuyo.'}
      </h1>
      <p className='gracias__subtitle'>
        Pedido #{orderData.order_id} · ${formatNumber(orderData.total_price)}
        {isPaid && isMercadoPago && ' — pago acreditado vía Mercado Pago'}
        {orderData.patient?.email && ` · ${orderData.patient.email}`}
      </p>

      {isPendingDeposit ? (
        <div className='gracias__card'>
          <span className='gracias__card-kicker'>Cómo completar tu compra</span>
          <p className='gracias__transfer'>
            Realizá la transferencia y envianos el comprobante por WhatsApp:
          </p>
          <p className='gracias__cbu'>
            CVU: 0000003100040321195999
            <br />
            Titular: PAOLA VANESA, NICOLA — Mercado Pago
          </p>
          <a
            className='gracias__whatsapp'
            href={whatsAppLink(
              `¡Hola Pao! Te envío el comprobante de mi pedido #${orderData.order_id}.`
            )}
            target='_blank'
            rel='noopener noreferrer'
          >
            Enviar comprobante · {whatsAppNumber}
          </a>
        </div>
      ) : (
        <div className='gracias__card'>
          <span className='gracias__card-kicker'>Qué sigue</span>
          {steps.map((text, i) => (
            <div key={i} className='gracias__step'>
              <span className='gracias__step-n'>{i + 1}</span>
              <span className='gracias__step-text'>{text}</span>
            </div>
          ))}
        </div>
      )}

      <Link to='/tienda' className='gracias__back'>
        Volver a la tienda
      </Link>
    </main>
  )
}

export default OrderSuccess
