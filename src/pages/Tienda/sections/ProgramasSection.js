import React from 'react'
import { Link } from 'react-router-dom'
import Kicker from '../../../components/ui/Kicker'
import PillButton from '../../../components/ui/PillButton'
import ProductPrice from '../ui/ProductPrice'
import ProductRow from '../ui/ProductRow'

/**
 * Sección Programas: Pao elige desde su admin cómo se muestra cada producto
 * (tienda_style): 'destacado' = tarjeta blanca con foto, 'banda' = banda navy.
 * Textos de portada (badge/kicker/tagline) también vienen del producto, con
 * fallbacks del diseño. Todo compra directo (modal), sin carrito.
 */
export default function ProgramasSection({ section, products, onBuy }) {
  const featured =
    products.find((p) => p.tienda_style === 'destacado') ||
    products.find((p) => !p.tienda_style && p.requires_appointment)
  const bands = products.filter(
    (p) => p.id !== featured?.id && p.tienda_style === 'banda'
  )
  const rest = products.filter(
    (p) => p.id !== featured?.id && !bands.some((b) => b.id === p.id)
  )

  return (
    <section className='tienda__section' aria-label={section.category}>
      {featured && (
        <article className='tienda-featured' data-testid='tienda-featured'>
          <Link to={`/producto/${featured.id}`} className='tienda-featured__media'>
            <img src={featured.thumbnail} alt={featured.name} />
          </Link>
          <div className='tienda-featured__body'>
            <div className='tienda-featured__badges'>
              <span className='tienda-featured__badge'>
                {featured.tienda_badge || section.featured.badge}
              </span>
              <Kicker>{featured.tienda_kicker || section.featured.kicker}</Kicker>
            </div>
            <Link to={`/producto/${featured.id}`} className='tienda-featured__name'>
              {featured.name}
            </Link>
            {featured.tienda_tagline && (
              <p className='tienda-featured__tagline'>{featured.tienda_tagline}</p>
            )}
            <p className='tienda-featured__desc'>{featured.description}</p>
            <div className='tienda-featured__price'>
              <ProductPrice product={featured} size='lg' />
              {featured.important_note && (
                <span className='tienda-featured__installments'>
                  {featured.important_note}
                </span>
              )}
            </div>
            <div className='tienda-featured__ctas'>
              <PillButton to={`/producto/${featured.id}`} variant='solid'>
                {section.featured.detailCta}
              </PillButton>
              <PillButton variant='outline' onClick={() => onBuy(featured)}>
                {section.featured.buyCta}
              </PillButton>
            </div>
            {featured.requires_appointment && (
              <span className='tienda-featured__note'>{section.featured.note}</span>
            )}
          </div>
        </article>
      )}

      {bands.map((product) => (
        <article key={product.id} className='tienda-grupal' data-testid='tienda-grupal'>
          <div className='tienda-grupal__info'>
            <span className='tienda-grupal__kicker'>
              {product.tienda_kicker || section.band.kicker}
            </span>
            <Link to={`/producto/${product.id}`} className='tienda-grupal__name'>
              {product.name}
            </Link>
            <p className='tienda-grupal__desc'>{product.description}</p>
          </div>
          <div className='tienda-grupal__buy'>
            <span className='tienda-grupal__price'>
              $ {Number(product.price).toLocaleString('es-AR')}
            </span>
            {product.stock > 0 && product.stock < 50 && (
              <span className='tienda-grupal__cupos'>
                Quedan {product.stock} cupos
              </span>
            )}
            <div className='tienda-grupal__ctas'>
              <button
                type='button'
                className='tienda-grupal__cta'
                onClick={() => onBuy(product)}
              >
                {product.landing?.heroCta || section.band.buyCta}
              </button>
              <Link to={`/producto/${product.id}`} className='tienda-grupal__more'>
                {section.band.detailCta}
              </Link>
            </div>
          </div>
        </article>
      ))}

      {rest.length > 0 && (
        <div className='tienda__rows'>
          {rest.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              cta='Comprar'
              onAdd={onBuy}
            />
          ))}
        </div>
      )}
    </section>
  )
}
