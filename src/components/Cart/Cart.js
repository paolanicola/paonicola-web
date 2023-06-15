import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import {
  addToCart,
  decreaseCart,
  getAllProductsCart,
  getTotals,
  removeFromCart,
} from '../../features/cart/cartSlice'
import { resetCartState } from '../../features/cartState/cartStateSlice'
import { backStep, resetStep } from '../../features/stepsCheckout/stepsSlice'
import { setMethod } from '../../features/validators'
import ProductCart from '../ProductCart/ProductCart'

function Cart() {
  const cart = useSelector((state) => state.cart)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const stepLocal = useSelector((state) => state.step.step)

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product))
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 2) {
        dispatch(backStep())
      }
    }
  }
  const handleIncreaseCart = (product) => {
    dispatch(addToCart(product))
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 1) {
        dispatch(backStep())
      }
    }
  }
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product))
  }
  const handleContinueBuy = (event) => {
    event.preventDefault()
    dispatch(resetStep())
    dispatch(resetCartState())
    navigate('/tienda')
  }

  let renderProducts = ''
  renderProducts =
    products.length > 0 ? (
      products.map((product) => <ProductCart product={product} />)
    ) : (
      <div>Error</div>
    )
  return (
    <div className='carrito-container1'>
      {cart.cartItems.length === 0 ? (
        <div className='carrito-container carrito-container-empty'>
          <h4 className='title-empty'>
            Tu carrito esta vacio, agrega algún producto!
          </h4>
          <div className='container-empty-link'>
            <Link onClick={handleContinueBuy} to='#' className='link-empty'>
              Tienda
            </Link>
          </div>
        </div>
      ) : (
        <div className='carrito-container'>
          <div className='carrito-cards'>{renderProducts}</div>

          <div className='carrito-total'>
            <h5 className='carrito-total-titulo'>Carrito de compras</h5>

            <table
              className='carrito-total-cuenta'
              cellpadding='0'
              cellspacing='0'
            >
              <tr>
                <td className='carrito-total-td '>Producto</td>{' '}
                <td className=' carrito-total-td text-right'>SubTotal</td>
              </tr>
              <hr />
              {products.length > 0 ? (
                products.map((product) => (
                  <tr>
                    <td className='carrito-total-td'>
                      {product.name} x {product.cartQuantity}
                    </td>
                    <td className='carrito-total-td text-right '>
                      {product.currency}
                      {product.promo ? product.promoPrice : product.price}
                    </td>
                  </tr>
                ))
              ) : (
                <p>no hay nada</p>
              )}

              <tr>
                <td className='carrito-total-td'></td>
              </tr>
              <tr className='carrito-total-price-title'>
                <td className='carrito-total-price'>Total</td>
                <td className='carrito-total-price text-right'>
                  {' '}
                  ${cart.cartTotalAmount}
                </td>
              </tr>
            </table>

            <div className='next1'>
              <Link
                to='/checkout'
                onClick={dispatch(setMethod(''))}
                className='  carrito-finalizar '
              >
                Finalizar compra
              </Link>
              <div className='carrito-container-continue'>
                <Link to='/tienda' className='carrito-continueBuy'>
                  Continuar Comprando
                </Link>
              </div>
              <div className='wizard-footer' style={{ display: 'none' }}>
                <button
                  type='button'
                  className=' wizard-prev btn btn-primary-outlined btn-irv-default'
                >
                  Atrás 1
                </button>
                <button type='button' className=' wizard-next btn btn-primary'>
                  Siguiente 1
                </button>
                <Link
                  to='/confirm'
                  className='btn btn-primary btn-md wizard-subm'
                >
                  Pagar y finalizar 1
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
