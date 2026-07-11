import React from 'react'
import { Link } from 'react-router-dom'
import ProductPrice from './ProductPrice'
import PillButton from '../../../components/ui/PillButton'

/**
 * A product row in the Tienda lists (Kits, Descargables, generic categories).
 * Free downloadables render a direct download link; everything else an
 * "Agregar" action. The image/title link to the product page.
 */
export default function ProductRow({ product, cta, onAdd, download = false }) {
  const detailPath = `/producto/${product.id}`
  const isFree = download && product.download_url

  return (
    <div className='tienda-row' data-testid='tienda-row'>
      <Link to={detailPath} className='tienda-row__media'>
        <img src={product.thumbnail} alt={product.name} loading='lazy' />
      </Link>
      <div className='tienda-row__info'>
        <Link to={detailPath} className='tienda-row__name'>
          {product.name}
        </Link>
        {product.description && (
          <span className='tienda-row__desc'>{product.description}</span>
        )}
      </div>
      {!isFree && <ProductPrice product={product} size='sm' />}
      {isFree ? (
        <PillButton
          href={product.download_url}
          variant='outline'
          small
          download
          className='tienda-row__action'
        >
          {cta}
        </PillButton>
      ) : (
        <PillButton
          variant='solid'
          small
          onClick={() => onAdd(product)}
          className='tienda-row__action'
        >
          {cta}
        </PillButton>
      )}
    </div>
  )
}
