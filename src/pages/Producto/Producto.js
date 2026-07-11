import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {
  getCurrentProduct,
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
import PurchaseBlock from './sections/PurchaseBlock'
import Kicker from '../../components/ui/Kicker'

const GENERIC_PURCHASE = { cta: 'Agregar al carrito' }

// Product page: flagship products render their full landing (designs
// 12a/17a/21a); any other product falls back to a generic detail built
// from the API fields only.
export default function Producto() {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const product = useSelector(getCurrentProduct)
  const loading = useSelector(isLoadingProduct)

  useEffect(() => {
    dispatch(loadProduct(productId))
  }, [dispatch, productId])

  if (loading || !product) {
    return <div className='producto__status'>Cargando producto ...</div>
  }

  const landing = getLanding(product.name)

  return (
    <main className='producto'>
      <nav className='producto__breadcrumb' aria-label='breadcrumb'>
        <Link to='/tienda'>Tienda</Link>
        <span aria-hidden='true'> / </span>
        <span className='producto__breadcrumb-current'>{product.name}</span>
      </nav>

      {landing ? (
        <>
          <LandingHero landing={landing} product={product} />
          <SignalsBlock landing={landing} />
          <PhilosophyBand paragraphs={landing.philosophy} />
          <AfterPhilosophy paragraphs={landing.afterPhilosophy} />
          <ChecklistGrid checklist={landing.checklist} />
          <IncludesList includes={landing.includes} />
          <PurchaseBlock product={product} purchase={landing.purchase} />
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
          <PurchaseBlock product={product} purchase={GENERIC_PURCHASE} />
        </>
      )}
    </main>
  )
}
