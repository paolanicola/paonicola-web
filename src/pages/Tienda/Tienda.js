import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Kicker from '../../components/ui/Kicker'
import CompraDirecta from '../../components/CompraDirecta'
import { getAllProducts, loadProducts } from '../../features/products'
import { whatsAppNumber } from '../../utils/utils'
import { messages } from '../../utils/messages'
import { TIENDA_COPY, FILTERS, SECTIONS, GENERIC_SECTION } from './tiendaConfig'
import ProgramasSection from './sections/ProgramasSection'
import KitCardsSection from './sections/KitCardsSection'
import MembershipSection from './sections/MembershipSection'
import RowsSection from './sections/RowsSection'
import TiendaSkeleton from './sections/TiendaSkeleton'

const SECTION_COMPONENTS = {
  programas: ProgramasSection,
  kitCards: KitCardsSection,
  membership: MembershipSection,
  rows: RowsSection,
  downloads: RowsSection,
}

// Container (Tienda Rediseño): carga el catálogo, lo agrupa por categoría y
// renderiza una sección por categoría. Compra directa vía modal — sin carrito.
export default function Tienda() {
  const dispatch = useDispatch()
  const [activeFilter, setActiveFilter] = useState(TIENDA_COPY.allFilter)
  const [buyProduct, setBuyProduct] = useState(null)
  const { allProducts, loading, failed, loadSuccess } = useSelector(getAllProducts)

  useEffect(() => {
    dispatch(loadProducts())
  }, [dispatch])

  // { 'Programa online': [..], 'Kits': [..], ... } — insertion order preserved
  const byCategory = useMemo(
    () =>
      allProducts.reduce((groups, product) => {
        ;(groups[product.category] = groups[product.category] || []).push(product)
        return groups
      }, {}),
    [allProducts]
  )

  // Secciones configuradas primero (orden del diseño), después cualquier
  // categoría extra del admin como filas genéricas (solo visibles en "Todo").
  const sections = useMemo(() => {
    const configured = SECTIONS.filter((s) => byCategory[s.category]?.length)
    const known = new Set(SECTIONS.map((s) => s.category))
    const extras = Object.keys(byCategory)
      .filter((category) => !known.has(category))
      .map((category) => ({ ...GENERIC_SECTION, category }))
    return [...configured, ...extras]
  }, [byCategory])

  const activeCategories = useMemo(() => {
    const filter = FILTERS.find((f) => f.label === activeFilter)
    return filter?.categories ? new Set(filter.categories) : null
  }, [activeFilter])

  const visibleSections = activeCategories
    ? sections.filter((s) => activeCategories.has(s.category))
    : sections

  // `loading` arranca en false: sin el `!loadSuccess` el primer paint (antes de
  // que corra el efecto) mostraba una tienda vacía por un frame
  const isLoading = loading || (!loadSuccess && !failed)

  return (
    <main className='tienda'>
      <header className='tienda__header'>
        <Kicker>{TIENDA_COPY.kicker}</Kicker>
        <h1 className='tienda__title'>{TIENDA_COPY.title}</h1>
        <p className='tienda__subtitle'>{TIENDA_COPY.subtitle}</p>
      </header>

      <div className='tienda__filters' role='group' aria-label='Filtrar por categoría'>
        {FILTERS.map(({ label }) => (
          <button
            key={label}
            type='button'
            className={`pn-chip${label === activeFilter ? ' pn-chip--active' : ''}`}
            aria-pressed={label === activeFilter}
            disabled={isLoading || failed}
            onClick={() => setActiveFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading && <TiendaSkeleton />}

      {failed && (
        <div className='tienda__status' role='alert'>
          <p>
            {messages.genericErrorMessage}. Contactarse al {whatsAppNumber}
          </p>
          <button
            type='button'
            className='pn-pill pn-pill--outline pn-pill--sm'
            onClick={() => dispatch(loadProducts())}
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading &&
        !failed &&
        visibleSections.map((section) => {
          const Section = SECTION_COMPONENTS[section.variant] || RowsSection
          return (
            <Section
              key={section.category}
              section={section}
              products={byCategory[section.category]}
              onBuy={setBuyProduct}
              onAdd={setBuyProduct}
            />
          )
        })}

      {!isLoading && !failed && visibleSections.length === 0 && (
        <p className='tienda__status'>{TIENDA_COPY.empty}</p>
      )}

      {buyProduct && (
        <CompraDirecta product={buyProduct} onClose={() => setBuyProduct(null)} />
      )}
    </main>
  )
}
