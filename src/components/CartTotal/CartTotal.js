import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllProductsCart } from '../../features/cart/cartSlice'
import { nextStep, backStep } from '../../features/stepsCheckout/stepsSlice'
import {
  getHora,
  getVerificado,
  updateformulario,
  updateVerificado
} from '../../features/cartState/cartStateSlice'
import { setMethod } from '../../features/validators'
import { toast } from 'react-toastify'

function MercadoPagoScript(publicKey, options) {
  const script = document.createElement('script')
  script.src = 'https://sdk.mercadopago.com/js/v2'

  // script.addEventListener('load', () => {
  //   setMercadopago(new window.MercadoPago(publicKey, options))
  // })

  document.body.appendChild(script)
}

function CartTotal() {
  const cart = useSelector((state) => state.cart)
  const { data: method } = useSelector((state) => state.validators)
  const { preference } = useSelector((state) => state.productos)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.step)
  const [variantTrans, setVariantTrans] = useState('carrito-finalizar__oculto ')
  const [variantMP, setVariantMP] = useState('carrito-finalizar__oculto')

  const handleNextStep = () => {
    dispatch(nextStep())
  }

  const handleEnd = () => {
    // Limpieza de todo
    // Limpiar el carrito
    // limpiar step
    // validators limpiar
    // cart state limpiar
    setVariantTrans('carrito-finalizar__oculto ')
    setVariantMP('carrito-finalizar__oculto ')
  }

  const handleVerificationSelectMethod = () => {
    toast('Seleccione un metodo de pago')
  }

  const handleBackStep = () => {
    if (step === 2) {
      //console.log('volviendo del pago');
      setVariantTrans('carrito-finalizar__oculto ')
      setVariantMP('carrito-finalizar__oculto ')
      dispatch(updateVerificado(false))
    }
    if (step === 1) {
      dispatch(updateformulario(null))
    }
    dispatch(setMethod(''))
    dispatch(backStep())
  }

  const hora = useSelector(getHora)
  const verificado = useSelector(getVerificado)
  let render = ''

  if (verificado || step === 0) {
    render = (
      <button
        onClick={() => handleNextStep()}
        type='submit'
        className={step === 2 ? 'carrito-finalizar__oculto' : 'carrito-finalizar  '}
      >
        Siguiente
      </button>
    )
  } else {
    render = (
      <button form='formularioTurno' type='submit' className='carrito-finalizar'>
        Siguente
      </button>
    )
  }
  useEffect(() => {
    //console.log('useEffect');
  }, [hora])

  let variantBack = ''
  let variantNext = ''
  let actionBack = ''
  let actionNext = ''
  let typeBack = ''
  let typeNext = ''
  let formNext = ''
  let actionEnd = ''
  let actionVerificationMethod = ''

  if (step === 0) {
    variantBack = 'carrito-finalizar__oculto'
    variantNext = 'carrito-finalizar'
    variantNext += hora !== null ? '' : ' disabled'
    actionNext = () => handleNextStep()
    typeNext = 'submit'
  }

  if (step === 1) {
    variantBack = 'carrito-finalizar carrito-finalizar-next'
    variantNext = 'carrito-finalizar'
    actionBack = () => handleBackStep()
    actionNext = ''
    typeNext = 'submit'
    formNext = 'formularioTurno'
  }

  if (step === 2) {
    variantBack = 'carrito-finalizar carrito-finalizar-next '
    variantNext = 'carrito-finalizar__oculto'
    actionBack = () => handleBackStep()
    actionVerificationMethod = () => handleVerificationSelectMethod()
    actionEnd = () => handleEnd()
  }

  useEffect(() => {
    console.log(method)
    if (step === 2) {
      if (method === 'MP') {
        setVariantTrans('carrito-finalizar__oculto')
        setVariantMP('carrito-finalizar')
      }
      if (method === 'Trans') {
        setVariantTrans('carrito-finalizar')
        setVariantMP('carrito-finalizar__oculto')
      }
    }
  }, [method])

  return (
    <div className='carrito-total-container'>
      <h5 className='carrito-total-titulo'>Total del carrito</h5>

      <table className='carrito-total-items' cellpadding='0' cellspacing='0'>
        {products.length > 0 ? (
          products.map((product) => (
            <tr className='carrito-total-item'>
              <td className='carrito-total-item-name'>
                {product.name} x {product.cartQuantity}
              </td>
              <td className='carrito-total-item-price text-right'>
                {product.currency}
                {product.promoPrice}
              </td>
            </tr>
          ))
        ) : (
          <p>no hay nada</p>
        )}

        <tr>
          <td className='carrito-total-ch-td'></td>
        </tr>
        <tr className='carrito-resume'>
          <td className='carrito-resume-title'>Total</td>
          <td className='carrito-resume-price text-right'> ${cart.cartTotalAmount}</td>
        </tr>
      </table>

      <div className='carrito-total-buttons back'>
        <button onClick={actionBack} type={typeBack} className={variantBack}>
          atras
        </button>
        <button onClick={actionNext} type={typeNext} form={formNext} className={variantNext}>
          Siguiente
        </button>
        <button
          onClick={actionVerificationMethod}
          className={
            step !== 2 || method !== ''
              ? 'carrito-finalizar__oculto'
              : 'carrito-finalizar carrito-finalizar-next disabled'
          }
        >
          Pagar
        </button>
        <Link to='/checkout/confirm' onClick={actionEnd} className={variantTrans}>
          Pagar
        </Link>
        <a href={preference} onClick={actionEnd} className={variantMP}>
          Pagar
        </a>
      </div>
    </div>
  )
}

export default CartTotal
