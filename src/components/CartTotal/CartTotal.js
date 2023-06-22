import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  deleteCartItems,
  getAllProductsCart,
  isCartWithCalendar
} from '../../features/cart/cartSlice'
import {
  getTime,
  isCheckoutCalendarValid, resetCartState,
  updateForm,
  updateVerified
} from '../../features/checkout/checkoutSlice'
import {
  backStep,
  nextStep,
  resetStep,
} from '../../features/stepsCheckout/stepsSlice'
import { setMethod } from '../../features/validators'

function CartTotal() {
  const cart = useSelector((state) => state.cart)
  const { data: method } = useSelector((state) => state.validators)
  const { preference } = useSelector((state) => state.products)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.step)
  const withCalendar = useSelector(isCartWithCalendar)
  const isCheckoutCalendarReady = useSelector(isCheckoutCalendarValid)
  const [variantTrans, setVariantTrans] = useState('carrito-finalizar__oculto ')
  const [variantMP, setVariantMP] = useState('carrito-finalizar__oculto')

  useEffect(() => {
    if(!withCalendar &&  step === 0){
      dispatch(nextStep())
    }
  }, [dispatch, step, withCalendar])

  const horario = useSelector(getTime)

  const handleNextStep = () => {
    if (withCalendar && horario === null) {
      handleVerificationSelectMethod('Seleccione un Horario!')
    } else dispatch(nextStep())
  }

  const handleEnd = () => {
    // Limpieza de todo
    // Limpiar el carrito
    dispatch(deleteCartItems())
    // limpiar step cart state limpiar validators limpiar
    dispatch(resetStep())
    dispatch(resetCartState())
    setVariantTrans('carrito-finalizar__oculto')
    setVariantMP('carrito-finalizar__oculto')
  }

  const handleVerificationSelectMethod = (text) => {
    toast(text)
  }

  const handleBackStep = () => {
    if (step === 2) {
      setVariantTrans('carrito-finalizar__oculto ')
      setVariantMP('carrito-finalizar__oculto ')
      dispatch(updateVerified(false))
    }
    if (step === 1) {
      dispatch(updateForm(null))
    }
    dispatch(setMethod(''))
    dispatch(backStep())
  }

  const hora = useSelector(getTime)

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
    variantBack = withCalendar? 'carrito-finalizar carrito-finalizar-next':'carrito-finalizar__oculto'
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
    actionVerificationMethod = () =>
      handleVerificationSelectMethod('Seleccione un metodo de pago!')
    actionEnd = () => handleEnd()
  }

  useEffect(() => {
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
  }, [method, step])

  return (
    <div className='carrito-total-container'>
      <h5 className='carrito-total-titulo'>Total del carrito</h5>

      <table className='carrito-total-items' cellPadding='0' cellSpacing='0'>
        {products.length > 0 ? (
          products.map((product) => (
            <tr className='carrito-total-item' key={product.id}>
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
          <td className='carrito-resume-price text-right'>
            {' '}
            ${cart.cartTotalAmount}
          </td>
        </tr>
      </table>

      <div className='carrito-total-buttons back'>
        <button onClick={actionBack} type={typeBack} className={variantBack}>
          atras
        </button>
        <button
          onClick={actionNext}
          type={typeNext}
          form={formNext}
          className={variantNext}
        >
          Siguiente
        </button>
        { (!withCalendar || (withCalendar && isCheckoutCalendarReady)) &&
          <button
            onClick={actionVerificationMethod}
            className={
              step !== 2 || method !== ''
                ? 'carrito-finalizar__oculto'
                : 'carrito-finalizar disabled'
            }
          >
            Pagar
          </button>
        }
     
        <Link
          to='/checkout/confirm'
          onClick={actionEnd}
          className={variantTrans}
        >
          Pagar
        </Link>
        <a href={preference} onClick={actionEnd} className={variantMP}>
          Pagar
        </a>
        <div className=''></div>
      </div>
    </div>
  )
}

export default CartTotal
