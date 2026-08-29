import React from 'react'
import { Link } from 'react-router-dom'
import PillButton from '../../../components/ui/PillButton'
import ProductPrice from './ProductPrice'
import { TIENDA_COPY, categoryMeta } from '../tiendaConfig'

/**
 * Tarjeta de producto de la tienda — la misma para las siete, sea programa,
 * kit, membresía o descargable. La fila de precio va con `margin-top:auto`
 * para que precios y botones queden alineados aunque las descripciones tengan
 * largos distintos: es lo que sostiene la grilla.
 *
 * El selector Argentina/Exterior aparece solo si el producto tiene precio en
 * dólares cargado en el admin.
 */
export default function ProductCard({ product, region, onRegion, onBuy }) {
  const meta = categoryMeta(product.category)
  const detailPath = `/producto/${product.id}`
  const isFree = product.price === 0 && Boolean(product.download_url)
  const hasRegions = product.price_usd != null

  return (
    <article className='tienda-card' data-testid='tienda-card'>
      {product.tienda_badge && (
        <span className='tienda-card__badge'>{product.tienda_badge}</span>
      )}

      {meta.icon ? (
        <div className='tienda-card__icon' aria-hidden='true'>
          {meta.icon}
        </div>
      ) : (
        <Link
          to={detailPath}
          className={`tienda-card__media${
            meta.coverTop ? ' tienda-card__media--top' : ''
          }`}
        >
          <img src={product.thumbnail} alt={product.name} loading='lazy' />
        </Link>
      )}

      <div className='tienda-card__text'>
        <div className='tienda-card__labels'>
          <span className='tienda-card__category'>
            {product.tienda_kicker || product.category}
          </span>
          {meta.note && <span className='tienda-card__note'>{meta.note}</span>}
        </div>
        <Link to={detailPath} className='tienda-card__name'>
          {product.name}
        </Link>
        {product.description && (
          <p className='tienda-card__desc'>{product.description}</p>
        )}
      </div>

      {hasRegions && (
        <div className='tienda-card__regions' role='group' aria-label='Región'>
          {[
            ['ar', TIENDA_COPY.regionAr],
            ['ex', TIENDA_COPY.regionEx],
          ].map(([value, label]) => (
            <button
              key={value}
              type='button'
              className={`tienda-card__region${
                region === value ? ' tienda-card__region--active' : ''
              }`}
              aria-pressed={region === value}
              onClick={() => onRegion(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className='tienda-card__buy'>
        <ProductPrice
          product={product}
          region={region}
          suffix={meta.priceSuffix}
          note={product.important_note}
          freeLabel={TIENDA_COPY.free}
          size='card'
        />
        {isFree ? (
          <PillButton
            href={product.download_url}
            variant='outline'
            small
            download
            className='tienda-card__action'
          >
            {meta.cta}
          </PillButton>
        ) : (
          <PillButton
            variant='solid'
            small
            onClick={() => onBuy(product)}
            className='tienda-card__action'
          >
            {meta.cta}
          </PillButton>
        )}
      </div>
    </article>
  )
}
