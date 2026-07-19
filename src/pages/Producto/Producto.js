import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {
  getCurrentProduct,
  hasProductFailed,
  isLoadingProduct,
  loadProduct,
} from '../../features/products'
import { getLanding } from './productLanding'
import {
  LandingHero,
  SignalsBlock,
  PhilosophyBand,
  AfterPhilosophy,
  ChecklistGrid,
  IncludesList,
} from './sections/LandingSections'
import {
  IncludesCards,
  TestimonialsStrip,
  FaqAccordion,
  ClosingBand,
  StickyBar,
  CrossLink,
} from './sections/LandingExtras'
import PurchaseBlock from './sections/PurchaseBlock'
import ProductoSkeleton from './sections/ProductoSkeleton'
import CompraDirecta from '../../components/CompraDirecta'
import Kicker from '../../components/ui/Kicker'

const GENERIC_PURCHASE = { cta: 'Comprar' }

// Product page (Tienda Rediseño): los productos insignia renderizan su
// landing completa; el resto cae a un detalle genérico armado desde la API.
// Toda compra abre el modal de compra directa — sin carrito.
export default function Producto() {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const product = useSelector(getCurrentProduct)
  const loading = useSelector(isLoadingProduct)
  const failed = useSelector(hasProductFailed)
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    dispatch(loadProduct(productId))
  }, [dispatch, productId])

  // sin el chequeo de `failed` un 404 o un timeout dejaba la página en
  // "Cargando producto ..." para siempre
  if (failed) {
    return (
      <main className='producto'>
        <nav className='producto__breadcrumb' aria-label='breadcrumb'>
          <Link to='/tienda'>Tienda</Link>
        </nav>
        <div className='producto__status' role='alert'>
          <p>No encontramos este producto.</p>
          <Link to='/tienda' className='pn-pill pn-pill--outline pn-pill--sm'>
            Volver a la tienda
          </Link>
        </div>
      </main>
    )
  }

  if (loading || !product) {
    return (
      <main className='producto'>
        <nav className='producto__breadcrumb' aria-label='breadcrumb'>
          <Link to='/tienda'>Tienda</Link>
        </nav>
        <ProductoSkeleton />
      </main>
    )
  }

  const landing = getLanding(product)
  const openBuy = () => setBuying(true)

  return (
    <main className='producto'>
      <nav className='producto__breadcrumb' aria-label='breadcrumb'>
        <Link to='/tienda'>Tienda</Link>
        <span aria-hidden='true'> / </span>
        <span className='producto__breadcrumb-current'>{product.name}</span>
      </nav>

      {landing ? (
        <>
          <LandingHero landing={landing} product={product} onBuy={openBuy} />
          <SignalsBlock landing={landing} />
          <PhilosophyBand paragraphs={landing.philosophy} />
          <AfterPhilosophy paragraphs={landing.afterPhilosophy} />
          <ChecklistGrid checklist={landing.checklist} />
          <IncludesCards includesCards={landing.includesCards} />
          <IncludesList includes={landing.includes} />
          <CrossLink crossLink={landing.includes?.crossLink} />
          <TestimonialsStrip testimonials={landing.testimonials} />
          <FaqAccordion faqs={landing.faqs} />
          <ClosingBand closing={landing.closing} product={product} onBuy={openBuy} />
          {landing.purchase && (
            <PurchaseBlock
              product={product}
              purchase={landing.purchase}
              onBuy={openBuy}
            />
          )}
          {landing.sticky && (
            <StickyBar
              product={product}
              cta={landing.closing?.cta || landing.heroCta || 'Comprar'}
              onBuy={openBuy}
              hidden={buying}
            />
          )}
        </>
      ) : (
        <>
          <section className='producto__hero'>
            <div className='producto__hero-copy'>
              <Kicker>{product.category}</Kicker>
              <h1 className='producto__headline'>{product.name}</h1>
              {product.description && (
                <p className='producto__tagline'>{product.description}</p>
              )}
            </div>
            <img
              className='producto__hero-img'
              src={product.thumbnail}
              alt={product.name}
            />
          </section>
          <PurchaseBlock
            product={product}
            purchase={GENERIC_PURCHASE}
            onBuy={openBuy}
          />
        </>
      )}

      {buying && (
        <CompraDirecta product={product} onClose={() => setBuying(false)} />
      )}
    </main>
  )
}
