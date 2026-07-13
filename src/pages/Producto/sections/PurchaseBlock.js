import React from 'react'
import PillButton from '../../../components/ui/PillButton'
import ProductPrice from '../../Tienda/ui/ProductPrice'

/**
 * Closing buy block de los kits/productos genéricos: badge/tagline opcional,
 * precio vivo (con promo, desde la API), CTA de compra directa y nota.
 */
export default function PurchaseBlock({ product, purchase, onBuy }) {
  return (
    <section className='producto__purchase' data-testid='purchase-block'>
      {purchase.badge && (
        <span className='producto__purchase-badge'>{purchase.badge}</span>
      )}
      {purchase.tagline && (
        <p className='producto__purchase-tagline'>{purchase.tagline}</p>
      )}
      <ProductPrice product={product} size='lg' />
      {product.important_note && (
        <span className='producto__purchase-installments'>
          {product.important_note}
        </span>
      )}
      <PillButton variant='solid' onClick={onBuy}>
        {purchase.cta}
      </PillButton>
      {purchase.note && (
        <span className='producto__purchase-note'>{purchase.note}</span>
      )}
    </section>
  )
}
