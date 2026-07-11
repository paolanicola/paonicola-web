import React from 'react'
import Kicker from '../../../components/ui/Kicker'
import PillButton from '../../../components/ui/PillButton'
import ProductPrice from '../ui/ProductPrice'

/** Membresía row card (design 11a). */
export default function MembershipSection({ section, products, onAdd }) {
  return (
    <section className='tienda__section' aria-label={section.category}>
      <Kicker>{section.category}</Kicker>
      {products.map((product) => (
        <div key={product.id} className='tienda-membership' data-testid='tienda-membership'>
          <div className='tienda-membership__icon' aria-hidden='true'>
            {section.icon}
          </div>
          <div className='tienda-membership__info'>
            <span className='tienda-membership__name'>{product.name}</span>
            <span className='tienda-membership__desc'>{product.description}</span>
          </div>
          <div className='tienda-membership__buy'>
            <ProductPrice product={product} suffix={section.priceSuffix} />
            {product.important_note && (
              <span className='tienda-membership__note'>
                {product.important_note}
              </span>
            )}
            <PillButton variant='solid' small onClick={() => onAdd(product)}>
              {section.cta}
            </PillButton>
          </div>
        </div>
      ))}
    </section>
  )
}
