import React from 'react'
import Skeleton, { SkeletonText } from '../../../components/ui/Skeleton'

/**
 * Estado de carga de la tienda: la misma grilla de tarjetas, en gris. Imita el
 * alto real del catálogo para que el footer no suba al medio de la pantalla
 * mientras responde la API.
 */
export default function TiendaSkeleton() {
  return (
    <div
      className='pn-skeleton-page'
      data-testid='tienda-skeleton'
      aria-busy='true'
      aria-live='polite'
    >
      <span className='sr-only'>Cargando productos…</span>

      <div className='tienda__grid' aria-hidden='true'>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <article key={i} className='tienda-card'>
            <div className='tienda-card__media'>
              <Skeleton h={null} radius={14} />
            </div>
            <div className='tienda-card__text'>
              <Skeleton w={90} h={11} radius={6} />
              <Skeleton w='80%' h={20} />
              <SkeletonText lines={2} h={12} />
            </div>
            <div className='tienda-card__buy'>
              <Skeleton w={100} h={26} />
              <Skeleton w={96} h={38} radius={18} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
