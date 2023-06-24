import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PrimaryButton from '../PrimaryButton/PrimaryButton'

import { useDispatch, useSelector } from 'react-redux'
import { addToCart, getTotals } from '../../features/cart/cartSlice'
import Modal from '../Modal/Modal'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import img1 from '../../assets/images/tienda/producto-ejemplo.jpg'
import { backStep } from '../../features/stepsCheckout/stepsSlice'
import { formatNumber } from '../../utils/utils'

function Product({ product }) {
  const cart = useSelector((state) => state.cart)
  const stepLocal = useSelector((state) => state.step.step)
  const dispatch = useDispatch()

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    toast('Producto agregado al carrito!')
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 1) {
        dispatch(backStep())
      }
    }
    //navigate('/cart');
  }

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])
  //modal
  const [show, setShow] = useState(false)
  //toast

  return (
    <>
      <Modal onClose={() => setShow(false)} show={show} product={product} />

      <div className='card-product-container'>
        <div className='card-product-img'>
          <div className='img-container'>
            <img className='img-source' src={img1} alt='' />
          </div>
          <div className='sale-text bold'>-20%</div>
          <div className='label-text black'>{product.category}</div>
          <div className='card-product-overlay'>
            <div className='botonn1' onClick={() => setShow(true)}>
              <PrimaryButton size='md' href='#' actionText='Vista rapida' />
            </div>
            <div onClick={() => handleAddToCart(product)} className='botonn'>
              <PrimaryButton href='/tienda' actionText='Añadir al carrito' />
            </div>
          </div>
        </div>
        <div className='card-product-text'>
          <NavLink to={`/producto/${product.id}`}>
            <h4 className='card-product-text__name'>{product.name}</h4>
          </NavLink>
          <div className='card-product-text__price'>
            {product.promo ? (
              <h4 className=' card-product-price__tachado '>
                {product.currency} {formatNumber(product.price)}
              </h4>
            ) : (
              ''
            )}
            <h4>
              {product.currency}{' '}
              {product.promo
                ? formatNumber(product.promoPrice)
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
            onClick={() => handleAddToCart(product)}
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
