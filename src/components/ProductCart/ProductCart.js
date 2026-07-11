import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

// One cart row (design 7b): image, category kicker, name, qty stepper,
// eliminar and serif price. Behavior unchanged from the legacy card.
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

  const decreaseDisabled = product.cartQuantity === 1
  const increaseDisabled =
    product.cartQuantity >= product.stock ||
    (product.category === 'Consultas Online' && cartAlreadyHasCalendarProduct)

  const lineTotal =
    (product.active_promo ? product.promo_price : product.price) *
    product.cartQuantity

  return (
    <div className='carrito-item' data-testid='carrito-item'>
      <img
        className='carrito-item__img'
        src={product.thumbnail}
        onError={handleOnError}
        alt={product.name}
      />

      <div className='carrito-item__info'>
        <span className='carrito-item__category'>{product.category}</span>
        <span className='carrito-item__name'>{product.name}</span>
        {product.description && (
          <span className='carrito-item__desc'>{product.description}</span>
        )}
        <div className='carrito-item__controls'>
          <div className='carrito-item__qty' aria-label='Cantidad'>
            <button
              type='button'
              onClick={() => handleDecreaseCart(product)}
              className='carrito-item__qty-btn'
              disabled={decreaseDisabled}
              aria-label='Restar uno'
            >
              −
            </button>
            <span className='carrito-item__qty-value'>{product.cartQuantity}</span>
            <button
              type='button'
              onClick={() => handleIncreaseCart()}
              className='carrito-item__qty-btn'
              disabled={increaseDisabled}
              aria-label='Sumar uno'
            >
              +
            </button>
          </div>
          <button
            type='button'
            onClick={handleDeleteButton}
            className='carrito-item__remove'
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className='carrito-item__price'>
        {product.active_promo && (
          <span className='carrito-item__price-original'>
            $ {formatNumber(product.price * product.cartQuantity)}
          </span>
        )}
        <span className='carrito-item__price-current'>
          $ {formatNumber(lineTotal)}
        </span>
      </div>
    </div>
  )
}

export default ProductCart
