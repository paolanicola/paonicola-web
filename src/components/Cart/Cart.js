import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { getAllProductsCart, getTotals } from '../../features/cart/cartSlice'
import { resetCartState } from '../../features/checkout/checkoutSlice'
import { resetStep } from '../../features/stepsCheckout/stepsSlice'
import { setMethod } from '../../features/validators'
import { formatNumber } from '../../utils/utils'
import ProductCart from '../ProductCart/ProductCart'

function Cart() {
  const cart = useSelector((state) => state.cart)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  const handleContinueBuy = (event) => {
    event.preventDefault()
    dispatch(resetStep())
    dispatch(resetCartState())
    navigate('/tienda')
  }

  let renderProducts = ''
  renderProducts =
    products.length > 0 ? (
      products.map((product) => (
        <ProductCart product={product} key={product.id} />
      ))
    ) : (
      <div>Error</div>
    )
  return (
    <div className='carrito-container1'>
      {cart.cartItems.length === 0 ? (
        <div className='carrito-container carrito-container-empty'>
          <h4 className='title-empty'>
            Tu carrito está vacío, agrega algún producto!
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
              cellPadding='0'
              cellSpacing='0'
            >
              <tr>
                <td className='carrito-total-td '>Producto</td>{' '}
                <td className=' carrito-total-td text-right'>Subtotal</td>
              </tr>
              <hr />
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className='carrito-total-td'>
                      {product.name} x {product.cartQuantity}
                    </td>
                    <td className='carrito-total-td text-right '>
                      {product.currency}{' '}
                      {product.promo
                        ? formatNumber(product.promoPrice)
                        : formatNumber(product.price)}
                    </td>
                  </tr>
                ))
              ) : (
                <p>No hay productos</p>
              )}

              <tr>
                <td className='carrito-total-td'></td>
              </tr>
              <tr className='carrito-total-price-title'>
                <td className='carrito-total-price'>Total</td>
                <td className='carrito-total-price text-right'>
                  {' '}
                  $ {formatNumber(cart.cartTotalAmount)}
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
                  Continuar comprando
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
