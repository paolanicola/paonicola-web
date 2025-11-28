import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { getAllProductsCart, getTotals } from '../../features/cart/cartSlice'
import { resetMethod } from '../../features/validators'
import { formatNumber } from '../../utils/utils'
import ProductCart from '../ProductCart/ProductCart'

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
      // Solo redirigir si NO venimos de checkout/confirm
      const fromCheckout = location.state?.fromCheckout
      const isCheckoutPath = location.pathname.includes('/checkout')
      
      if (!fromCheckout && !isCheckoutPath) {
        const timer = setTimeout(() => {
          navigate('/tienda')
        }, 100) // Pequeño delay para que otras navegaciones tomen prioridad
        
        return () => clearTimeout(timer)
      }
    }
  }, [cart.cartItems.length, navigate, location])

  let renderProducts = ''
  renderProducts =
    products.length > 0 ? (
      products.map((product) => (
        <ProductCart product={product} key={product.id} />
      ))
    ) : (
      <div>Error</div>
    )
  
  // Si está vacío, mostrar brevemente mensaje antes de redirigir
  if (cart.cartItems.length === 0) {
    return (
      <div className='carrito-container1'>
        <div className='carrito-container carrito-container-empty'>
          <h4 className='title-empty'>
            Redirigiendo a la tienda...
          </h4>
        </div>
      </div>
    )
  }

  return (
    <div className='carrito-container1'>
      <div className='carrito-container'>
        <div className='carrito-cards'>{renderProducts}</div>

        <div className='carrito-total'>
          <h5 className='carrito-total-titulo'>Carrito de compras</h5>

          <table
            className='carrito-total-cuenta'
            cellPadding='0'
            cellSpacing='0'
          >
            <thead>
              <tr>
                <td className='carrito-total-td '>Producto</td>
                <td className=' carrito-total-td text-right'>Subtotal</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='separator'></td>
              </tr>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className='carrito-total-td'>
                      {product.name} x {product.cartQuantity}
                    </td>
                    <td className='carrito-total-td text-right '>
                      ${' '}
                      {product.active_promo
                        ? formatNumber(product.promo_price)
                        : formatNumber(product.price)}
                    </td>
                  </tr>
                ))
              ) : (
                <p>No hay productos</p>
              )}
            </tbody>

            <tfoot>
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
            </tfoot>
          </table>

          <div className='next1'>
            <Link
              to='/checkout'
              onClick={() => dispatch(resetMethod())}
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
    </div>
  )
}

export default Cart