import React from 'react'
import Skeleton, { SkeletonText } from '../../../components/ui/Skeleton'

/**
 * Estado de carga de la tienda. Imita el orden real del catálogo (destacado,
 * banda grupal, grilla de kits) para que la página tenga el alto que va a
 * tener: con el texto suelto de antes el footer quedaba en medio de la
 * pantalla hasta que respondía la API.
 */
const ON_DARK = 'pn-skeleton--on-dark'

export default function TiendaSkeleton() {
  return (
    <div
      className='pn-skeleton-page'
      data-testid='tienda-skeleton'
      aria-busy='true'
      aria-live='polite'
    >
      <span className='sr-only'>Cargando productos…</span>

      <section className='tienda__section' aria-hidden='true'>
        <article className='tienda-featured'>
          <div className='tienda-featured__media'>
            <Skeleton h={null} radius={0} />
          </div>
          <div className='tienda-featured__body'>
            <Skeleton w={110} h={22} radius={11} />
            <Skeleton w='85%' h={30} />
            <SkeletonText lines={3} />
            <Skeleton w={150} h={30} />
            <div className='tienda-featured__ctas'>
              <Skeleton w={170} h={44} radius={24} />
              <Skeleton w={140} h={44} radius={24} />
            </div>
          </div>
        </article>

        {/* la banda es navy: los bloques van invertidos o no se ven */}
        <article className='tienda-grupal'>
          <div className='tienda-grupal__media'>
            <Skeleton h={null} radius={0} className={ON_DARK} />
          </div>
          <div className='tienda-grupal__info'>
            <Skeleton w={180} h={12} radius={6} className={ON_DARK} />
            <Skeleton w='70%' h={24} className={ON_DARK} />
            <SkeletonText lines={2} className={ON_DARK} />
          </div>
          <div className='tienda-grupal__buy'>
            <Skeleton w={130} h={28} className={ON_DARK} />
            <Skeleton w={180} h={46} radius={24} className={ON_DARK} />
          </div>
        </article>
      </section>

      <section className='tienda__section' aria-hidden='true'>
        <div className='tienda__section-head'>
          <Skeleton w={70} h={12} radius={6} />
        </div>
        <div className='tienda-kits'>
          {[0, 1].map((i) => (
            <article key={i} className='tienda-kit'>
              <div className='tienda-kit__media'>
                <Skeleton h={null} radius={0} />
              </div>
              <Skeleton w='75%' h={20} />
              <SkeletonText lines={2} />
              <div className='tienda-kit__buy'>
                <Skeleton w={110} h={24} />
                <Skeleton w={120} h={44} radius={22} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
