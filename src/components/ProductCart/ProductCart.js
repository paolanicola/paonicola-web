import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  addToCart,
  decreaseCart,
  getAllProductsCart,
  getTotals,
  removeFromCart
} from '../../features/cart/cartSlice'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { backStep } from '../../features/stepsCheckout/stepsSlice'

function ProductCart({ product }) {
  const cart = useSelector((state) => state.cart)
  const stepLocal = useSelector((state) => state.step.step)
  const products = useSelector(getAllProductsCart)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product))
    toast('Producto eliminado del Carrito!')
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 1) {
        dispatch(backStep())
      }
    }
  }
  const handleIncreaseCart = (product) => {
    dispatch(addToCart(product))
    toast('Producto agregado al Carrito!')
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 1) {
        dispatch(backStep())
      }
    }
  }
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product))
    toast('Producto removido del Carrito!')
  }

  return (
    <div className='carrito-card'>
      <div className='carrito-img'>
        <img className='img-source' src={product.displayThumbnail} alt='' />
      </div>

      <div className='carrito-content'>
        <div className='content-title'>
          <Link className='' to={`/producto/${product.id}`}>
            <p className='content-title__h6'>{product.name}</p>
          </Link>
          <button
            onClick={() => handleRemoveFromCart(product)}
            className='content-delete'
          >
            <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
          </button>
        </div>
        <div className='content-description'>
          <p className='content-descripcion-corta-carrito'>
            {product.description}
          </p>
        </div>

        <div class='content-botton-precio'>
          <div class='content-quantity-selector'>
            <button
              onClick={() => handleDecreaseCart(product)}
              class={
                product.cartQuantity === 1
                  ? 'btn-disabled btn-quantity'
                  : 'btn-quantity'
              }
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>

            <input
              className='quantity'
              min='0'
              name='quantity'
              value={product.cartQuantity}
              type='number'
            />

            <button
              onClick={() => handleIncreaseCart(product)}
              className='btn-quantity '
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className='content-precio'>
            {product.promo ? (
              <p class='content-precio-text'>
                <span className=' card-product-price__tachado '>
                  {product.currency} {product.price}
                </span>
              </p>
            ) : (
              ''
            )}
            <p class='content-precio-text'>
              {product.currency}{' '}
              {product.promo ? product.promoPrice : product.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCart
