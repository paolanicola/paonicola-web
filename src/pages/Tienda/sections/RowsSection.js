import React from 'react'
import Kicker from '../../../components/ui/Kicker'
import ProductRow from '../ui/ProductRow'

/** List-style section (Kits, Descargables gratuitos, generic categories). */
export default function RowsSection({ section, products, onAdd }) {
  return (
    <section className='tienda__section' aria-label={section.category}>
      <div className='tienda__section-head'>
        <Kicker>{section.category}</Kicker>
        {section.hint && <span className='tienda__section-hint'>{section.hint}</span>}
      </div>
      <div className='tienda__rows'>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            cta={section.cta}
            onAdd={onAdd}
            download={section.variant === 'downloads'}
          />
        ))}
      </div>
    </section>
  )
}
