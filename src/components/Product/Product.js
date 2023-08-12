import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PrimaryButton from '../PrimaryButton/PrimaryButton'

import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  getTotals,
  isCartWithCalendar,
} from '../../features/cart/cartSlice'
import Modal from '../Modal/Modal'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import img1 from '../../assets/images/tienda/producto-ejemplo.jpg'
import { backStep } from '../../features/stepsCheckout/stepsSlice'
import { formatNumber, countProductInCart } from '../../utils/utils'
import { messages } from '../../utils/messages'

function Product({ product }) {
  const cart = useSelector((state) => state.cart)
  const stepLocal = useSelector((state) => state.step.step)
  const dispatch = useDispatch()
  const cartAlreadyHasCalendarProduct = useSelector(isCartWithCalendar)

  const handleAddToCart = () => {
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

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])
  //modal
  const [show, setShow] = useState(false)
  //toast

  const handleOnError = (event) => (event.target.src = img1)

  return (
    <>
      <Modal onClose={() => setShow(false)} show={show} product={product} />

      <div className='card-product-container'>
        <div className='card-product-img'>
          <div className='img-container'>
            <img
              className='img-source'
              src={product.thumbnail}
              alt=''
              onError={handleOnError}
            />
          </div>
          {product.active_promo && (
            <div className='sale-text bold'>
              {`${Math.floor(
                ((product.price - product.promo_price) / product.price) * -100
              )}%`}
            </div>
          )}
          <div className='label-text black'>{product.category}</div>
          <div className='card-product-overlay'>
            <div className='botonn1' onClick={() => setShow(true)}>
              <PrimaryButton size='md' href='#' actionText='Vista rápida' />
            </div>
            <div onClick={() => handleAddToCart()} className='botonn'>
              <PrimaryButton href='/tienda' actionText='Añadir al carrito' />
            </div>
          </div>
        </div>
        <div className='card-product-text'>
          <div style={{ cursor: 'pointer' }} onClick={() => setShow(true)}>
            <h4 className='card-product-text__name'>{product.name}</h4>
          </div>
          <div className='card-product-text__price'>
            {product.active_promo ? (
              <h4 className=' card-product-price__tachado '>
                $ {formatNumber(product.price)}
              </h4>
            ) : (
              ''
            )}
            <h4>
              ${' '}
              {product.active_promo
                ? formatNumber(product.promo_price)
                : formatNumber(product.price)}
            </h4>
          </div>
        </div>
        <div className='botones-mobile'>
          <Link
            to=''
            onClick={() => setShow(true)}
            className='botones-mobile-view'
            title='Vista rápida'
          >
            {/* <View /> */}
            Ver
          </Link>
          <button
            onClick={() => handleAddToCart()}
            className='botones-mobile-addToCart'
            title='Añadir al carrito'
          >
            {/* <AddToCart /> */}
            Añadir al Carrito
          </button>
        </div>
      </div>
    </>
  )
}

export default Product
