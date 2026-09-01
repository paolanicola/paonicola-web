// Copy + layout de la Tienda ("Handoff: Tienda Online").
// Una sola grilla uniforme: todas las tarjetas iguales, el catálogo completo
// de una mirada. Lo que varía por categoría vive acá.

export const TIENDA_COPY = {
  kicker: 'Tienda',
  title: 'Elegí cómo empezar',
  subtitle: 'Desde un primer contacto gratuito hasta el acompañamiento completo.',
  allFilter: 'Todo',
  empty: 'No hay productos en esta categoría por ahora.',
  free: 'Gratis',
  regionAr: 'Argentina',
  regionEx: 'Exterior',
  ctaExterior: 'Comprar por WhatsApp',
}

// Desde el exterior no hay checkout (Mercado Pago solo acepta pagadores
// argentinos): la compra se coordina por WhatsApp y Pao manda el link de pago
// que corresponda (transferencia, PayPal).
export const exteriorWhatsAppMessage = (product) =>
  `¡Hola Pao! Quiero empezar ${product.name} desde el exterior. ¿Cómo coordinamos el pago?`

// Orden de las categorías en la grilla y en los chips. Las que Pao cree nuevas
// en el admin no rompen nada: caen al final con los valores de DEFAULT_CATEGORY.
export const CATEGORY_ORDER = [
  'Programa online',
  'Membresía',
  'Kits',
  'PDF descargable',
  'Descargable gratuito',
]

// Metadata de tarjeta por categoría. `note` es la etiqueta gris al lado de la
// categoría; `icon` reemplaza la foto por un bloque de color (Membresía);
// `coverTop` recorta la foto desde arriba — las tapas de guías son verticales y
// centrarlas a 170px de alto les come el título.
export const CATEGORY_META = {
  'Programa online': { cta: 'Agregar' },
  Membresía: { cta: 'Continuar', note: 'mensual', icon: '🗝️', priceSuffix: '/mes' },
  Kits: { cta: 'Agregar', note: 'acceso inmediato' },
  'PDF descargable': { cta: 'Agregar', note: 'acceso inmediato', coverTop: true },
  'Descargable gratuito': { cta: 'Descargar', coverTop: true },
}

export const DEFAULT_CATEGORY = { cta: 'Agregar' }

export const categoryMeta = (category) =>
  CATEGORY_META[category] || DEFAULT_CATEGORY

// Categorías presentes en el catálogo, en el orden del diseño primero.
export const orderedCategories = (categories) => {
  const known = CATEGORY_ORDER.filter((c) => categories.includes(c))
  const extras = categories.filter((c) => !CATEGORY_ORDER.includes(c))
  return [...known, ...extras]
}
