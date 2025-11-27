import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { ReactComponent as MercadoPago } from '../../assets/images/tienda/mercadopago.svg'
import {
  setMethodMercadoPago,
  setMethodDeposit,
} from '../../features/validators'

function PaymentMethods({ paymentMethodChangedToMercadoPago }) {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => null

  const PaymentMP = () => {
    dispatch(setMethodMercadoPago())
    // No llamamos a paymentMethodChangedToMercadoPago porque ya no usamos el formulario inline
  }
  
  const PaymentTrans = () => {
    dispatch(setMethodDeposit())
  }

  return (
    <div className='payment-container'>
      <h5 className='payment-title'>Seleccioná el método de pago</h5>
      <form className='payment-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='payment-block' onClick={PaymentMP}>
          <label className='block-label block-selected'>
            <input
              className='block-radio'
              {...register}
              type='radio'
              name='pago'
              value='mercadopago'
            />
            <div className='block-data'>
              <p className='block-title'>Mercado Pago</p>
              <MercadoPago />
              <div className='block-description'>
                <p className='description-text'>
                  Pagá con tarjeta de débito/crédito, dinero en cuenta de Mercado Pago o efectivo.
                </p>
              </div>
            </div>
          </label>
        </div>

        <div className='payment-block' onClick={PaymentTrans}>
          <label className='block-label block-selected'>
            <input
              className='block-radio'
              {...register}
              type='radio'
              name='pago'
              value='transferencia'
            />
            <div className='block-data'>
              <p className='block-title'>Transferencia Bancaria</p>
              <div className='block-description'>
                <p className='description-text'>
                  Realizá una transferencia al CBU que te indicaré al finalizar
                  la compra. La compra se efectuará una vez que me envíes el
                  comprobante de pago.
                </p>
              </div>
            </div>
          </label>
        </div>
        <input type='submit' hidden />
      </form>
    </div>
  )
}

export default PaymentMethods