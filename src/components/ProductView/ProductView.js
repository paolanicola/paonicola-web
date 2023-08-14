import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryButton from '../PrimaryButton/PrimaryButton'

import { toast } from 'react-toastify'
import { addToCart, isCartWithCalendar } from '../../features/cart/cartSlice'
import { backStep } from '../../features/stepsCheckout/stepsSlice'
import { formatNumber, countProductInCart } from '../../utils/utils'
import img1 from '../../assets/images/tienda/producto-ejemplo.jpg'
import { messages } from '../../utils/messages'

export default function ProductView({ product }) {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const stepLocal = useSelector((state) => state.step.step)
  const cartAlreadyHasCalendarProduct = useSelector(isCartWithCalendar)

  const handleAddToCartView = () => {
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
      toast.success(messages.productAddedToCart)
    }
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 1) {
        dispatch(backStep())
      }
    }
  }

  const handleOnError = (event) => (event.target.src = img1)

  return (
    <>
      <div className='view-container'>
        <div className='view-product'>
          <div className='view-img-container'>
            <img
              className='view-img-source'
              src={product.thumbnail}
              onError={handleOnError}
              alt=''
            />
          </div>
        </div>
        <div className='view-detail-container'>
          <h4 className='view-detail-title'>{product.name}</h4>
          <div className='view-category'>{product.category}</div>
          <div className='view-detail-price'>
            {product.active_promo ? (
              <h4 className='price-off card-product-price__tachado '>
                $ {formatNumber(product.price)}
              </h4>
            ) : (
              ''
            )}
            <h4 className='price'>
              ${' '}
              {product.active_promo
                ? formatNumber(product.promo_price)
                : formatNumber(product.price)}
            </h4>
          </div>
          <div className=' view-detail-raiting'> </div>
          <div className='view-detail-important'>{product.important_note}</div>
          <textarea
            className='view-detail-description'
            value={product.description}
            readOnly
          ></textarea>

          <div className='view-detail-button' onClick={handleAddToCartView}>
            <PrimaryButton href='/tienda' actionText='Añadir al carrito' />
          </div>
        </div>
      </div>
    </>
  )
}
