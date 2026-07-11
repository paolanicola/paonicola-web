import React from 'react'
import PillButton from '../../../components/ui/PillButton'
import ProductPrice from '../../Tienda/ui/ProductPrice'
import useAddToCart from '../../../hooks/useAddToCart'

/**
 * Closing buy block (designs 12a/17a/21a): optional badge/tagline, live
 * price (promo-aware, from the API product), CTA and WhatsApp note.
 */
export default function PurchaseBlock({ product, purchase }) {
  const onAdd = useAddToCart()
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
      <PillButton variant='solid' onClick={() => onAdd(product)}>
        {purchase.cta}
      </PillButton>
      {purchase.note && (
        <span className='producto__purchase-note'>{purchase.note}</span>
      )}
    </section>
  )
}
