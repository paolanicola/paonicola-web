// Copy + layout de la Tienda rediseñada ("Tienda Rediseño.dc.html").
// Las secciones se renderizan en este orden cuando la categoría tiene
// productos; categorías nuevas del admin caen a una sección de filas genérica.

export const TIENDA_COPY = {
  kicker: 'Tienda',
  title: 'Elegí cómo empezar',
  subtitle: 'Desde un primer contacto gratuito hasta el acompañamiento completo.',
  allFilter: 'Todo',
  loading: 'Cargando productos ...',
  empty: 'No hay productos en esta categoría por ahora.',
}

// Filtros del diseño (no son 1:1 con las categorías del admin).
export const FILTERS = [
  { label: 'Todo' },
  { label: 'Programas', categories: ['Programa online'] },
  { label: 'Kits', categories: ['Kits'] },
  { label: 'Gratis', categories: ['Descargable gratuito'] },
]

export const SECTIONS = [
  {
    category: 'Programa online',
    variant: 'programas',
    // tarjeta destacada = el producto con primer turno (Método 1:1)
    featured: {
      badge: 'Más elegido',
      kicker: 'Programa 1 a 1 · 12 semanas',
      tagline: 'La improvisación termina acá.',
      detailCta: 'Conocer el programa',
      buyCta: 'Empezar ahora',
      note: 'Después de comprar, elegís tu primer turno acá mismo',
    },
    // banda navy = el resto de los programas (Grupal Regula)
    // el texto del botón sale del heroCta de la landing del producto;
    // esto es solo el fallback si no tiene página personalizada
    band: {
      kicker: 'Programa grupal · 4 semanas',
      buyCta: 'Empezar ahora',
      detailCta: 'Conocer más',
    },
  },
  {
    category: 'Kits',
    variant: 'kitCards',
    hint: 'acceso inmediato',
    cta: 'Comprar',
  },
  {
    // fuera de los filtros del diseño pero visible en "Todo": el upsell del
    // portal manda acá a los pacientes que quieren seguir con el material
    category: 'Membresía',
    variant: 'membership',
    icon: '🗝️',
    cta: 'Continuar',
    priceSuffix: '/mes',
  },
  {
    category: 'Descargable gratuito',
    variant: 'downloads',
    kicker: 'Empezá gratis',
    cta: 'Descargar gratis',
    note: 'Descarga directa — sin checkout ni registro.',
  },
]

export const GENERIC_SECTION = { variant: 'rows', cta: 'Comprar' }
