// Copy + section layout for the redesigned Tienda (design Turno 11a).
// Sections render in this order when the category has products; categories
// not listed here fall back to a generic rows section, so new categories
// created in the admin still show up.

export const TIENDA_COPY = {
  kicker: 'Tienda',
  title: 'Elegí cómo empezar',
  subtitle: 'Desde un primer contacto gratuito hasta el acompañamiento completo.',
  allFilter: 'Todo',
  loading: 'Cargando productos ...',
}

export const SECTIONS = [
  {
    category: 'Programa online',
    variant: 'featured',
    badge: 'Más elegido',
    cta: 'Agregar al carrito',
    note: 'Después de comprar, coordinamos tu turno por WhatsApp',
  },
  {
    category: 'Membresía',
    variant: 'membership',
    icon: '🗝️',
    cta: 'Continuar',
    priceSuffix: '/mes',
  },
  {
    category: 'Kits',
    variant: 'rows',
    hint: 'acceso inmediato',
    cta: 'Agregar',
  },
  {
    category: 'Descargable gratuito',
    variant: 'downloads',
    cta: 'Descargar',
  },
]

export const GENERIC_SECTION = { variant: 'rows', cta: 'Agregar' }
