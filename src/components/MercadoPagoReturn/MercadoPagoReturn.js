import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const MercadoPagoReturn = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const status = searchParams.get('status')
    const paymentId = searchParams.get('payment_id')
    const externalReference = searchParams.get('external_reference')
    const merchantOrderId = searchParams.get('merchant_order_id')

    console.log('MercadoPago return params:', {
      status,
      paymentId,
      externalReference,
      merchantOrderId
    })

    if (status === 'approved' && externalReference) {
      // Pago aprobado, redirigir a la página de éxito
      navigate(`/checkout/confirm/${externalReference}`)
    } else if (status === 'pending') {
      toast.info('Tu pago está pendiente de procesamiento')
      navigate(`/checkout/confirm/${externalReference}`)
    } else if (status === 'failure' || status === 'rejected') {
      toast.error('El pago fue rechazado. Por favor, intenta nuevamente.')
      navigate('/checkout')
    } else {
      // Si no hay parámetros, redirigir al checkout
      navigate('/checkout')
    }
  }, [searchParams, navigate])

  return (
    <div className='spinner-container' style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className='spinner'></div>
      <p style={{ marginTop: '20px' }}>Procesando tu pago...</p>
    </div>
  )
}

export default MercadoPagoReturn