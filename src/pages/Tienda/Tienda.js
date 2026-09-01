import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Kicker from '../../components/ui/Kicker'
import CompraDirecta from '../../components/CompraDirecta'
import { getAllProducts, loadProducts } from '../../features/products'
import { whatsAppLink, whatsAppNumber } from '../../utils/utils'
import { messages } from '../../utils/messages'
import {
  TIENDA_COPY,
  CATEGORY_ORDER,
  orderedCategories,
  exteriorWhatsAppMessage,
} from './tiendaConfig'
import ProductCard from './ui/ProductCard'
import TiendaSkeleton from './sections/TiendaSkeleton'

// Container: carga el catálogo y lo muestra en una grilla uniforme — todas las
// tarjetas iguales, todo el catálogo de una mirada. Los chips filtran por la
// categoría real del producto. Compra directa vía modal — sin carrito.
export default function Tienda() {
  const dispatch = useDispatch()
  const [activeFilter, setActiveFilter] = useState(TIENDA_COPY.allFilter)
  const [region, setRegion] = useState('ar')
  const [buyProduct, setBuyProduct] = useState(null)
  const { allProducts, loading, failed, loadSuccess } = useSelector(getAllProducts)

  useEffect(() => {
    dispatch(loadProducts())
  }, [dispatch])

  // Categorías del catálogo en el orden del diseño; las que Pao cree nuevas en
  // el admin aparecen al final en vez de quedar invisibles.
  const categories = useMemo(
    () => orderedCategories([...new Set(allProducts.map((p) => p.category))]),
    [allProducts]
  )

  const products = useMemo(() => {
    const rank = new Map(categories.map((category, i) => [category, i]))
    const visible =
      activeFilter === TIENDA_COPY.allFilter
        ? allProducts
        : allProducts.filter((p) => p.category === activeFilter)
    // sort estable: dentro de la categoría se respeta el orden de la API
    return [...visible].sort(
      (a, b) => rank.get(a.category) - rank.get(b.category)
    )
  }, [allProducts, activeFilter, categories])

  // Con región Exterior no hay checkout — Mercado Pago solo acepta pagadores
  // argentinos — así que el CTA abre WhatsApp con el pedido armado y el pago se
  // coordina en el chat. Solo para productos con precio USD: la región es
  // estado global, pero los productos sin USD ni muestran el selector.
  const handleBuy = (product) => {
    if (region === 'ex' && product.price_usd != null) {
      window.open(whatsAppLink(exteriorWhatsAppMessage(product)), '_blank', 'noopener')
      return
    }
    setBuyProduct(product)
  }

  // `loading` arranca en false: sin el `!loadSuccess` el primer paint (antes de
  // que corra el efecto) mostraba una tienda vacía por un frame
  const isLoading = loading || (!loadSuccess && !failed)

  // Mientras carga todavía no hay categorías: sin este fallback la fila de
  // chips colapsa a "Todo" y da un salto de layout cuando llega el catálogo.
  const chipCategories = isLoading ? CATEGORY_ORDER : categories

  return (
    <main className='tienda'>
      <header className='tienda__header'>
        <Kicker>{TIENDA_COPY.kicker}</Kicker>
        <h1 className='tienda__title'>{TIENDA_COPY.title}</h1>
        <p className='tienda__subtitle'>{TIENDA_COPY.subtitle}</p>
      </header>

      <div className='tienda__filters' role='group' aria-label='Filtrar por categoría'>
        {[TIENDA_COPY.allFilter, ...chipCategories].map((label) => (
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

      {!isLoading && !failed && products.length > 0 && (
        <div className='tienda__grid'>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              region={region}
              onRegion={setRegion}
              onBuy={handleBuy}
            />
          ))}
        </div>
      )}

      {!isLoading && !failed && products.length === 0 && (
        <p className='tienda__status'>{TIENDA_COPY.empty}</p>
      )}

      {buyProduct && (
        <CompraDirecta product={buyProduct} onClose={() => setBuyProduct(null)} />
      )}
    </main>
  )
}
