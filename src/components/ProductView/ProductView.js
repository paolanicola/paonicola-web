import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryButton from '../PrimaryButton/PrimaryButton'

import { toast } from 'react-toastify'
import { addToCart } from '../../features/cart/cartSlice'
import { backStep } from '../../features/stepsCheckout/stepsSlice'
import { formatNumber } from '../../utils/utils'

export default function ProductView({ product }) {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const stepLocal = useSelector((state) => state.step.step)

  const handleAddToCartView = async () => {
    try {
      await dispatch(addToCart(product))
      toast.success('Producto agregado al Carrito!')
    } catch (error) {
      toast.error('Límite de stock alcanzado!')
    }
    if (stepLocal === 2) {
      if (cart.cartTotalQuantity > 1) {
        dispatch(backStep())
      }
    }
    //navigate('/cart');
  }

  return (
    <>
      <div className='view-container'>
        <div className='view-product'>
          <div className='view-img-container'>
            <img
              className='view-img-source'
              src={product.displayThumbnail}
              alt=''
            />
          </div>
        </div>
        <div className='view-detail-container'>
          <h4 className='view-detail-title'>{product.name}</h4>
          <div className='view-category'>{product.category}</div>
          <div className='view-detail-price'>
            {product.promo ? (
              <h4 className='price-off card-product-price__tachado '>
                {product.currency} {formatNumber(product.price)}
              </h4>
            ) : (
              ''
            )}
            <h4 className='price'>
              {product.currency}{' '}
              {product.promo
                ? formatNumber(product.promoPrice)
                : formatNumber(product.price)}
            </h4>
          </div>
          <div className=' view-detail-raiting'> </div>
          <div className='view-detail-important'>
            IMPORTANTE: Este producto tiene una vigencia de <b>50</b> días desde
            el día de su compra. La consulta es <b>online</b> .
          </div>
          <div className='view-detail-description'> {product.description} </div>

          <div className='view-detail-button' onClick={handleAddToCartView}>
            <PrimaryButton href='/tienda' actionText='Añadir al carrito' />
          </div>
        </div>
      </div>
    </>
  )
}
