import React from 'react'
import { Link } from 'react-router-dom'
import Kicker from '../../../components/ui/Kicker'
import ProductPrice from '../ui/ProductPrice'

/** Kits del rediseño: grilla de tarjetas con compra directa. */
export default function KitCardsSection({ section, products, onBuy }) {
  return (
    <section className='tienda__section' aria-label={section.category}>
      <div className='tienda__section-head'>
        <Kicker>{section.category}</Kicker>
        {section.hint && <span className='tienda__section-hint'>{section.hint}</span>}
      </div>
      <div className='tienda-kits'>
        {products.map((product) => (
          <article key={product.id} className='tienda-kit' data-testid='tienda-kit'>
            <Link to={`/producto/${product.id}`} className='tienda-kit__media'>
              <img src={product.thumbnail} alt={product.name} loading='lazy' />
            </Link>
            {product.active_promo && product.promo_price != null && (
              <span className='tienda-kit__promo'>Promo</span>
            )}
            <Link to={`/producto/${product.id}`} className='tienda-kit__name'>
              {product.name}
            </Link>
            <p className='tienda-kit__desc'>{product.description}</p>
            <div className='tienda-kit__buy'>
              <ProductPrice product={product} />
              <button
                type='button'
                className='tienda-kit__cta'
                onClick={() => onBuy(product)}
              >
                {section.cta}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
