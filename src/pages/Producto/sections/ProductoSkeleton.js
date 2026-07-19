import React from 'react'
import Skeleton, { SkeletonText } from '../../../components/ui/Skeleton'

/**
 * Estado de carga de la página de producto. Reserva el alto del hero (copy +
 * foto) y del bloque de compra: con el texto suelto de antes el footer subía
 * al medio de la pantalla mientras respondía la API.
 */
export default function ProductoSkeleton() {
  return (
    <div
      className='pn-skeleton-page'
      data-testid='producto-skeleton'
      aria-busy='true'
      aria-live='polite'
    >
      <span className='sr-only'>Cargando producto…</span>

      <section className='producto__hero' aria-hidden='true'>
        <div className='producto__hero-copy'>
          <Skeleton w={120} h={12} radius={6} />
          <Skeleton w='90%' h={34} />
          <Skeleton w='70%' h={34} />
          <SkeletonText lines={2} />
          <Skeleton w={170} h={32} />
          <Skeleton w={200} h={48} radius={26} />
        </div>
        <Skeleton className='producto__hero-img' h={null} radius={18} />
      </section>

      <section className='producto__signals' aria-hidden='true'>
        <SkeletonText lines={4} />
      </section>
    </div>
  )
}
