import React, { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryButton from '../PrimaryButton/PrimaryButton'
import { toast } from 'react-toastify'
import { addToCart, isCartWithCalendar, getTotals } from '../../features/cart/cartSlice'
import { backStep } from '../../features/stepsCheckout/stepsSlice'
import { formatNumber, countProductInCart } from '../../utils/utils'
import img1 from '../../assets/images/tienda/producto-ejemplo.jpg'
import { messages } from '../../utils/messages'
import { loadProduct, getCurrentProduct, isLoadingProduct } from '../../features/products'

const ProductDetail = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const stepLocal = useSelector((state) => state.step.step)
  const cartAlreadyHasCalendarProduct = useSelector(isCartWithCalendar)
  const product = useSelector(getCurrentProduct)
  const loading = useSelector(isLoadingProduct)
  
  // Estado local para controlar si ya intentamos cargar
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)

  useEffect(() => {
    console.log('🔄 ProductDetail useEffect - Loading product:', productId)
    dispatch(loadProduct(productId))
    setHasAttemptedLoad(true)
  }, [dispatch, productId])

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch])

  console.log('📊 ProductDetail render state:', { 
    loading, 
    product: product ? 'exists' : 'null',
    hasAttemptedLoad,
    productId 
  })

  // Mostrar loading SI está cargando O si aún no intentamos cargar
  if (loading || !hasAttemptedLoad) {
    return (
      <div className='product-detail-container'>
        <div className='product-detail-loading'>Cargando producto...</div>
      </div>
    )
  }

  // Solo redirigir si terminó de cargar Y no hay producto Y ya intentamos cargarlo
  if (!loading && !product && hasAttemptedLoad) {
    console.log('⚠️ Product not found, redirecting...')
    return <Navigate to="/tienda" replace />
  }

  // Si aún no tenemos producto pero estamos cargando, mostrar loading
  if (!product) {
    return (
      <div className='product-detail-container'>
        <div className='product-detail-loading'>Cargando producto...</div>
      </div>
    )
  }

  const handleAddToCart = () => {
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
    <div className='product-detail-container'>
      <div className='breadcrumb'>
        <Link to='/tienda' className='breadcrumb-link'>← Volver a la tienda</Link>
      </div>
      
      <div className='product-detail-content'>
        <div className='product-detail-image'>
          <img
            src={product.thumbnail}
            onError={handleOnError}
            alt={product.name}
            className='detail-image'
          />
          {product.active_promo && (
            <div className='detail-sale-badge'>
              {`${Math.floor(
                ((product.price - product.promo_price) / product.price) * -100
              )}% OFF`}
            </div>
          )}
        </div>
        
        <div className='product-detail-info'>
          <div className='detail-category'>{product.category}</div>
          <h1 className='detail-title'>{product.name}</h1>
          
          <div className='detail-price'>
            {product.active_promo ? (
              <span className='original-price'>
                $ {formatNumber(product.price)}
              </span>
            ) : null}
            <span className='current-price'>
              $ {product.active_promo
                ? formatNumber(product.promo_price)
                : formatNumber(product.price)}
            </span>
          </div>
          
          {product.important_note && (
            <div className='detail-important-note'>
              <strong>Nota importante:</strong> {product.important_note}
            </div>
          )}

          {/* Botón ANTES de la descripción */}
          <div className='detail-actions'>
            <div onClick={handleAddToCart}>
              <PrimaryButton actionText='Añadir a carrito' />
            </div>
          </div>

          {/* Descripción */}
          <div className='detail-description'>
            <h3>Descripción</h3>
            <div className='description-content'>
              {product.description}
            </div>
          </div>

          {/* Botón DESPUÉS de la descripción */}
          <div className='detail-actions detail-actions--bottom'>
            <div onClick={handleAddToCart}>
              <PrimaryButton actionText='¡Quiero sentirme mejor!' />
            </div>
          </div>

          
          {product.stock <= 5 && product.stock > 0 && (
            <div className='stock-warning'>
              ¡Solo quedan {product.stock} disponibles!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail