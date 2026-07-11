import React from 'react'
import { Link } from 'react-router-dom'
import Kicker from '../../../components/ui/Kicker'
import PillButton from '../../../components/ui/PillButton'
import ProductPrice from '../ui/ProductPrice'

/** Featured navy card for the Programa online (design 11a). */
export default function ProgramSection({ section, products, onAdd }) {
  return (
    <section className='tienda__section' aria-label={section.category}>
      <Kicker>{section.category}</Kicker>
      {products.map((product) => (
        <div key={product.id} className='tienda-featured' data-testid='tienda-featured'>
          {section.badge && (
            <span className='tienda-featured__badge'>{section.badge}</span>
          )}
          <Link to={`/producto/${product.id}`} className='tienda-featured__media'>
            <img src={product.thumbnail} alt={product.name} />
          </Link>
          <div className='tienda-featured__info'>
            <Link to={`/producto/${product.id}`} className='tienda-featured__name'>
              {product.name}
            </Link>
            <p className='tienda-featured__desc'>{product.description}</p>
          </div>
          <div className='tienda-featured__buy'>
            <ProductPrice product={product} size='lg' />
            {product.important_note && (
              <span className='tienda-featured__installments'>
                {product.important_note}
              </span>
            )}
            <PillButton
              variant='light'
              onClick={() => onAdd(product)}
              className='tienda-featured__cta'
            >
              {section.cta}
            </PillButton>
            {section.note && (
              <span className='tienda-featured__note'>{section.note}</span>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
