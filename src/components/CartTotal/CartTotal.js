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
import { createPreference } from '../../features/producto'

function CartTotal() {
  const cart = useSelector((state) => state.cart)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.step)

  const handleNextStep = () => {
    dispatch(nextStep())
  }

  const handleBackStep = () => {
    if (step === 2) {
      //console.log('volviendo del pago');
      dispatch(updateVerificado(false))
    }
    if (step === 1) {
      dispatch(updateformulario(null))
    }
    dispatch(backStep())
  }

  const a = useSelector(getHora)
  const verificado = useSelector(getVerificado)
  let render = ''
  //console.log(verificado);
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
  }, [a])

  const [mobile, setMobile] = useState(window.screen.width <= 677)
  const [end, setEnd] = useState(false)

  const crearPreference = () => {
    dispatch(createPreference(cart))
  }

  useEffect(() => {
    const changeNavbarSizeFs = () => {
      if (window.screen.width <= 767) {
        setMobile(true)
      }
    }
    window.addEventListener('resize', changeNavbarSizeFs)
    return () => window.removeEventListener('resize', changeNavbarSizeFs)
  }, [])
  useEffect(() => {
    const changeNavbarSizeFss = () => {
      if (window.screen.width > 677) {
        setMobile(false)
      }
    }
    window.addEventListener('resize', changeNavbarSizeFss)
    return () => window.removeEventListener('resize', changeNavbarSizeFss)
  }, [])

  useEffect(() => {
    const changeNavbarSizeFsss = () => {
      if (document.body.scrollHeight === window.scrollY + window.innerHeight) {
        //console.log('llegue al final');
        setEnd(true)
      }
    }

    window.addEventListener('scroll', changeNavbarSizeFsss)
    return () => window.removeEventListener('scroll', changeNavbarSizeFsss)
  }, [])
  useEffect(() => {
    const changeNavbarSizeFssss = () => {
      if (document.body.scrollHeight > window.scrollY + window.innerHeight) {
        //console.log('no es el final');
        setEnd(false)
      }
    }

    window.addEventListener('scroll', changeNavbarSizeFssss)
    return () => window.removeEventListener('scroll', changeNavbarSizeFssss)
  }, [])

  return (
    <div className='carrito-total-container'>
      <h5 class='carrito-total-titulo'>Total del carrito</h5>

      <table class='carrito-total-items' cellpadding='0' cellspacing='0'>
        {products.length > 0 ? (
          products.map((product) => (
            <tr className='carrito-total-item'>
              <td className='carrito-total-item-name'>
                {product.name} x {product.cartQuantity}
              </td>
              <td className='carrito-total-item-price text-right'>
                {product.currency}${product.price}
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

      <div
        class={mobile && end ? 'carrito-total-buttons back mobile' : 'carrito-total-buttons back'}
      >
        <button
          onClick={() => handleBackStep()}
          type='button'
          className={
            step === 0 ? 'carrito-finalizar__oculto' : 'carrito-finalizar carrito-finalizar-next'
          }
        >
          Atrás
        </button>
        {a !== null ? (
          render
        ) : (
          <button
            onClick={() => handleNextStep()}
            type='button'
            className={step === 2 ? 'carrito-finalizar__oculto' : 'disabled carrito-finalizar  '}
            disabled
          >
            Siguiente
          </button>
        )}

        <Link
          to='/'
          onClick={crearPreference}
          className={
            step !== 2 ? 'carrito-finalizar__oculto' : 'carrito-finalizar carrito-finalizar-next'
          }
        >
          Pagar y finalizar
        </Link>
      </div>
    </div>
  )
}

export default CartTotal
