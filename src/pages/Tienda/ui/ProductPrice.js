import React from 'react'
import { formatNumber } from '../../../utils/utils'

/** Serif price with optional promo strikethrough and suffix (e.g. "/mes"). */
export default function ProductPrice({ product, suffix, size = 'md' }) {
  const hasPromo = product.active_promo && product.promo_price != null
  const current = hasPromo ? product.promo_price : product.price
  const original = hasPromo && product.price != null ? product.price : null

  // Producto sin precio cargado en el admin: no renderizamos nada. Un "$ "
  // suelto confunde, y antes esto rompía el render de la Tienda entera.
  if (current == null) return null

  return (
    <div className={`tienda-price tienda-price--${size}`}>
      {original != null && (
        <span className='tienda-price__original'>$ {formatNumber(original)}</span>
      )}
      <span className='tienda-price__current'>
        $ {formatNumber(current)}
        {suffix && <span className='tienda-price__suffix'>{suffix}</span>}
      </span>
    </div>
  )
}
