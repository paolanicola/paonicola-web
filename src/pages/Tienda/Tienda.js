import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Kicker from '../../components/ui/Kicker'
import useAddToCart from '../../hooks/useAddToCart'
import { getAllProducts, loadProducts } from '../../features/products'
import { whatsAppNumber } from '../../utils/utils'
import { messages } from '../../utils/messages'
import { TIENDA_COPY, SECTIONS, GENERIC_SECTION } from './tiendaConfig'
import ProgramSection from './sections/ProgramSection'
import MembershipSection from './sections/MembershipSection'
import RowsSection from './sections/RowsSection'

const SECTION_COMPONENTS = {
  featured: ProgramSection,
  membership: MembershipSection,
  rows: RowsSection,
  downloads: RowsSection,
}

// Container: loads the catalog, groups it by category and renders one
// design section per category, filterable through the chips row.
export default function Tienda() {
  const dispatch = useDispatch()
  const onAdd = useAddToCart()
  const [activeFilter, setActiveFilter] = useState(TIENDA_COPY.allFilter)
  const { allProducts, loading, failed } = useSelector(getAllProducts)

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

  // Configured sections first (design order), then any extra category as a
  // generic rows section so admin-created categories still render.
  const sections = useMemo(() => {
    const configured = SECTIONS.filter((s) => byCategory[s.category]?.length)
    const known = new Set(SECTIONS.map((s) => s.category))
    const extras = Object.keys(byCategory)
      .filter((category) => !known.has(category))
      .map((category) => ({ ...GENERIC_SECTION, category }))
    return [...configured, ...extras]
  }, [byCategory])

  const filters = [TIENDA_COPY.allFilter, ...sections.map((s) => s.category)]
  const visibleSections =
    activeFilter === TIENDA_COPY.allFilter
      ? sections
      : sections.filter((s) => s.category === activeFilter)

  if (loading) {
    return <div className='tienda__status'>{TIENDA_COPY.loading}</div>
  }
  if (failed) {
    return (
      <p className='tienda__status'>
        {messages.genericErrorMessage}. Contactarse al {whatsAppNumber}
      </p>
    )
  }

  return (
    <main className='tienda'>
      <header className='tienda__header'>
        <Kicker>{TIENDA_COPY.kicker}</Kicker>
        <h1 className='tienda__title'>{TIENDA_COPY.title}</h1>
        <p className='tienda__subtitle'>{TIENDA_COPY.subtitle}</p>
      </header>

      <div className='tienda__filters' role='group' aria-label='Filtrar por categoría'>
        {filters.map((filter) => (
          <button
            key={filter}
            type='button'
            className={`pn-chip${filter === activeFilter ? ' pn-chip--active' : ''}`}
            aria-pressed={filter === activeFilter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {visibleSections.map((section) => {
        const Section = SECTION_COMPONENTS[section.variant] || RowsSection
        return (
          <Section
            key={section.category}
            section={section}
            products={byCategory[section.category]}
            onAdd={onAdd}
          />
        )
      })}
    </main>
  )
}
