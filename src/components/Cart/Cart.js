import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import {
  deleteCartItems,
  getAllProductsCart,
  getTotals,
} from '../../features/cart/cartSlice'
import { resetMethod } from '../../features/validators'
import { formatNumber, whatsAppNumber } from '../../utils/utils'
import ProductCart from '../ProductCart/ProductCart'

// Carrito (design 7b): editorial list + summary card. All cart behavior
// (totals, empty-redirect, quantity rules) stays in the slice/ProductCart.
function Cart() {
  const cart = useSelector((state) => state.cart)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  // 🛒 Redirigir a tienda si el carrito está vacío
  // PERO NO si venimos de checkout (para evitar conflicto con órdenes gratis)
  useEffect(() => {
    if (cart.cartItems.length === 0) {
      const fromCheckout = location.state?.fromCheckout
      const isCheckoutPath = location.pathname.includes('/checkout')

      if (!fromCheckout && !isCheckoutPath) {
        const timer = setTimeout(() => {
          navigate('/tienda')
        }, 100)

        return () => clearTimeout(timer)
      }
    }
  }, [cart.cartItems.length, navigate, location])

  if (cart.cartItems.length === 0) {
    return (
      <div className='carrito'>
        <div className='carrito__status'>Redirigiendo a la tienda...</div>
      </div>
    )
  }

  const itemsLabel = `${cart.cartTotalQuantity} ${
    cart.cartTotalQuantity === 1 ? 'producto' : 'productos'
  }`

  return (
    <main className='carrito'>
      <div className='carrito__grid'>
        <section className='carrito__items' aria-label='Productos en el carrito'>
          <header className='carrito__header'>
            <h1 className='carrito__title'>Tu carrito</h1>
            <span className='carrito__count'>
              {itemsLabel} ·{' '}
              <button
                type='button'
                className='carrito__clear'
                onClick={() => dispatch(deleteCartItems())}
              >
                vaciar
              </button>
            </span>
          </header>

          {products.map((product) => (
            <ProductCart product={product} key={product.id} />
          ))}

          <p className='carrito__help'>
            ¿Dudas antes de comprar?{' '}
            <a
              className='carrito__help-link'
              href={`https://wa.me/${whatsAppNumber}`}
              target='_blank'
              rel='noreferrer'
            >
              Escribime por WhatsApp
            </a>
          </p>
        </section>

        <aside className='carrito__summary' aria-label='Resumen del pedido'>
          <h2 className='carrito__summary-title'>Resumen del pedido</h2>
          <div className='carrito__summary-rows'>
            {products.map((product) => (
              <div key={product.id} className='carrito__summary-row'>
                <span>
                  {product.name} x {product.cartQuantity}
                </span>
                <span>
                  ${' '}
                  {formatNumber(
                    (product.active_promo ? product.promo_price : product.price) *
                      product.cartQuantity
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className='carrito__total'>
            <span className='carrito__total-label'>Total</span>
            <span className='carrito__total-amount'>
              $ {formatNumber(cart.cartTotalAmount)}
            </span>
          </div>
          <Link
            to='/checkout'
            onClick={() => dispatch(resetMethod())}
            className='pn-pill pn-pill--solid carrito__checkout'
          >
            Finalizar compra
          </Link>
          <span className='carrito__secure'>PAGO 100% SEGURO</span>
          <Link to='/tienda' className='carrito__continue'>
            Continuar comprando
          </Link>
        </aside>
      </div>
    </main>
  )
}

export default Cart
