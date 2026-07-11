import React from 'react'
import { formatNumber } from '../../../utils/utils'

/** Serif price with optional promo strikethrough and suffix (e.g. "/mes"). */
export default function ProductPrice({ product, suffix, size = 'md' }) {
  const hasPromo = product.active_promo && product.promo_price != null
  return (
    <div className={`tienda-price tienda-price--${size}`}>
      {hasPromo && (
        <span className='tienda-price__original'>
          $ {formatNumber(product.price)}
        </span>
      )}
      <span className='tienda-price__current'>
        $ {formatNumber(hasPromo ? product.promo_price : product.price)}
        {suffix && <span className='tienda-price__suffix'>{suffix}</span>}
      </span>
    </div>
  )
}
