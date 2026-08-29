import React from 'react'
import { formatNumber } from '../../../utils/utils'

/** `$ 39.990` / `USD 350` — el prefijo lo decide la región, no el producto. */
const money = (amount, usd) =>
  `${usd ? 'USD' : '$'} ${formatNumber(amount)}`

/**
 * Precio de un producto: promo tachada, sufijo (`/mes`), línea de cuotas y
 * "Gratis" para los descargables. Con `region='ex'` usa el precio en dólares
 * si el producto lo tiene cargado; si no, se queda en pesos.
 */
export default function ProductPrice({
  product,
  suffix,
  size = 'md',
  region = 'ar',
  note,
  freeLabel = 'Gratis',
}) {
  const usd = region === 'ex' && product.price_usd != null
  const hasPromo = !usd && product.active_promo && product.promo_price != null

  let current = product.price
  if (usd) current = product.price_usd
  else if (hasPromo) current = product.promo_price

  const original = hasPromo && product.price != null ? product.price : null

  // Producto sin precio cargado en el admin: no renderizamos nada. Un "$ "
  // suelto confunde, y antes esto rompía el render de la Tienda entera.
  if (current == null) return null

  const installment = usd ? product.installment_price_usd : product.installment_price
  const installments =
    product.installments_count != null && installment != null
      ? `o ${product.installments_count} cuotas de ${money(installment, usd)}`
      : null

  return (
    <div className={`tienda-price tienda-price--${size}`}>
      {original != null && (
        <span className='tienda-price__original'>{money(original, false)}</span>
      )}
      {current === 0 ? (
        <span className='tienda-price__free'>{freeLabel}</span>
      ) : (
        <span className='tienda-price__current'>
          {money(current, usd)}
          {suffix && <span className='tienda-price__suffix'>{suffix}</span>}
        </span>
      )}
      {installments && (
        <span className='tienda-price__installments'>{installments}</span>
      )}
      {!installments && note && <span className='tienda-price__note'>{note}</span>}
    </div>
  )
}
