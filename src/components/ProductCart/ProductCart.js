import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { faMinus, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  addToCart,
  decreaseCart,
  getTotals,
  removeFromCart,
  isCartWithCalendar,
} from '../../features/cart/cartSlice'
import img1 from '../../assets/images/tienda/producto-ejemplo.jpg'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { backStep } from '../../features/stepsCheckout/stepsSlice'
import { formatNumber, countProductInCart } from '../../utils/utils'
import { messages } from '../../utils/messages'
import { deleteSelectedAppointmentId } from '../../features/checkout/checkoutSlice'

function ProductCart({ product }) {
  const cart = useSelector((state) => state.cart)
  const stepLocal = useSelector((state) => state.step.step)
  const cartAlreadyHasCalendarProduct = useSelector(isCartWithCalendar)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  const handleDecreaseCart = () => {
    dispatch(decreaseCart(product))
    toast.info(messages.cartProductQuantityUpdated)
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 1) {
        dispatch(backStep())
      }
    }
  }
  const handleIncreaseCart = () => {
    // this allows only one calendar product on the cart
    if (
      product.category === 'Consultas Online' &&
      cartAlreadyHasCalendarProduct
    ) {
      toast.info(messages.cartAlreadyHasCalendarProduct)
    } else if (countProductInCart(product.id, cart) >= product.stock) {
      toast.error(messages.stockLimitReached)
    } else {
      dispatch(addToCart(product))
      toast.info(messages.cartProductQuantityUpdated)
    }
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 1) {
        dispatch(backStep())
      }
    }
  }
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product))
    toast.info(messages.productRemovedFromCart)
  }

  const handleOnError = (event) => (event.target.src = img1)

  const handleDeleteButton = () => {
    handleRemoveFromCart(product)
    if (product.category === 'Consultas Online') {
      dispatch(deleteSelectedAppointmentId())
    }
  }

  return (
    <div className='carrito-card'>
      <div className='carrito-img'>
        <img
          className='img-source'
          src={product.thumbnail}
          onError={handleOnError}
          alt=''
        />
      </div>

      <div className='carrito-content'>
        <div className='content-title'>
          <p className='content-title__h6'>{product.name}</p>
          <button onClick={handleDeleteButton} className='content-delete'>
            <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
          </button>
        </div>
        <div className='content-description'>
          <p className='content-descripcion-corta-carrito'>
            {product.description}
          </p>
        </div>

        <div className='content-botton-precio'>
          <div className='content-quantity-selector'>
            <button
              onClick={() => handleDecreaseCart(product)}
              className={
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
              readOnly
            />

            <button
              onClick={() => handleIncreaseCart()}
              className={
                product.cartQuantity >= product.stock ||
                (product.category === 'Consultas Online' &&
                  cartAlreadyHasCalendarProduct)
                  ? 'btn-disabled btn-quantity'
                  : 'btn-quantity'
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className='content-precio'>
            {product.active_promo ? (
              <p className='content-precio-text'>
                <span className=' card-product-price__tachado '>
                  $ {formatNumber(product.price * product.cartQuantity)}
                </span>
              </p>
            ) : (
              ''
            )}
            <p className='content-precio-text'>
              ${' '}
              {product.active_promo
                ? formatNumber(product.promo_price * product.cartQuantity)
                : formatNumber(product.price * product.cartQuantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCart
