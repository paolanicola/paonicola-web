// @ts-check
const { test, expect } = require('@playwright/test')

/**
 * Regresión de las fotos de la tienda (bug 2026-07-19: los kits y la banda
 * grupal se renderizaban sin <img>, así que en /tienda sólo se veía la foto
 * del Método Regula aunque el detalle de cada producto sí la mostraba).
 *
 * A diferencia de tienda.spec.js, este spec NO necesita el backend: stubea
 * /api/products y las imágenes, así que corre sólo con el dev server.
 */

// PNG 2x2 rosa opaco — sirve para que naturalWidth > 0 sin pegarle a la red.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z4AAT' +
    'BhsRvJhAAAA//8DTgEF0iCB6wAAAABJRU5ErkJggg==',
  'base64'
)

const PRODUCTS = [
  {
    id: 1,
    name: 'Método Regula - Programa personalizado 1:1',
    description: 'Acompañamiento personalizado de 12 semanas.',
    important_note: 'pago único',
    price: 499000,
    active: true,
    stock: 19,
    category: 'Programa online',
    active_promo: false,
    promo_price: null,
    download_url: '',
    thumbnail: 'https://img.test/metodo.png',
    requires_appointment: true,
    tienda_style: 'destacado',
    tienda_badge: 'Más elegido',
    tienda_kicker: 'Programa 1 a 1 · 12 semanas',
    tienda_tagline: 'La improvisación termina acá.',
  },
  {
    id: 2,
    name: 'PROGRAMA GRUPAL REGULA',
    description: 'Regulá tu alimentación en 4 semanas.',
    price: 99000,
    active: true,
    stock: 12,
    category: 'Programa online',
    active_promo: false,
    promo_price: null,
    download_url: '',
    thumbnail: 'https://img.test/grupal.jpg',
    requires_appointment: false,
    tienda_style: 'banda',
    landing: { heroCta: 'Sumarme al grupal' },
  },
  {
    id: 3,
    name: 'KIT RENDIMIENTO INTELIGENTE',
    description: 'Nutrición deportiva práctica.',
    price: 48000,
    active: true,
    stock: 999,
    category: 'Kits',
    active_promo: true,
    promo_price: 39990,
    download_url: '',
    thumbnail: 'https://img.test/kit-rendimiento.png',
    requires_appointment: false,
    tienda_style: 'destacado', // la sección de Kits lo ignora a propósito
  },
  {
    id: 4,
    name: 'KIT REGULA',
    description: 'Reset de 7 días.',
    price: 27990,
    active: true,
    stock: 999,
    category: 'Kits',
    active_promo: false,
    promo_price: null,
    download_url: '',
    thumbnail: 'https://img.test/kit-regula.png',
    requires_appointment: false,
  },
  {
    id: 5,
    name: 'Guía de Compras Saludables',
    description: 'Guía para elegir mejor en el supermercado.',
    price: 0,
    active: true,
    stock: 999,
    category: 'Descargable gratuito',
    active_promo: false,
    promo_price: null,
    download_url: '/descargables/compras-saludables.pdf',
    thumbnail: 'https://img.test/compras.png',
    requires_appointment: false,
  },
]

async function stubCatalog(page, products = PRODUCTS) {
  await page.route('**/api/products*', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(products) })
  )
  await page.route('https://img.test/**', (route) =>
    route.fulfill({ contentType: 'image/png', body: PNG })
  )
}

/** Todas las tarjetas que deben mostrar foto, con su testid y el nombre esperado. */
const CARDS_WITH_IMAGE = [
  { testId: 'tienda-featured', name: 'Método Regula' },
  { testId: 'tienda-grupal', name: 'PROGRAMA GRUPAL REGULA' },
  { testId: 'tienda-kit', name: 'KIT RENDIMIENTO INTELIGENTE' },
  { testId: 'tienda-kit', name: 'KIT REGULA' },
  { testId: 'tienda-row', name: 'Guía de Compras Saludables' },
]

test.describe('Tienda — fotos de producto', () => {
  test.beforeEach(async ({ page }) => {
    await stubCatalog(page)
    await page.goto('/tienda')
    await expect(page.getByRole('heading', { name: 'Elegí cómo empezar' })).toBeVisible()
  })

  for (const { testId, name } of CARDS_WITH_IMAGE) {
    test(`"${name}" muestra su foto realmente cargada`, async ({ page }) => {
      const card = page.getByTestId(testId).filter({ hasText: name })
      const img = card.locator('img').first()
      await expect(img).toBeVisible()
      // no alcanza con que el <img> exista: tiene que haber decodificado
      await expect
        .poll(() => img.evaluate((el) => el.naturalWidth))
        .toBeGreaterThan(0)
      await expect(img).toHaveAttribute('alt', /\S/)
    })
  }

  test('ninguna tarjeta del catálogo queda sin foto', async ({ page }) => {
    // guardia genérica: si mañana se agrega otra sección sin <img>, esto falla
    for (const testId of ['tienda-featured', 'tienda-grupal', 'tienda-kit', 'tienda-row']) {
      const cards = page.getByTestId(testId)
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i).locator('img')).toHaveCount(1)
      }
    }
  })

  test('la foto linkea al detalle del producto', async ({ page }) => {
    const kit = page.getByTestId('tienda-kit').filter({ hasText: 'KIT REGULA' })
    await kit.locator('a:has(img)').click()
    await expect(page).toHaveURL(/\/producto\/4$/)
  })

  test('no hay imágenes rotas ni 404 en la página', async ({ page }) => {
    const failed = []
    page.on('requestfailed', (req) => {
      if (req.resourceType() === 'image') failed.push(req.url())
    })
    await page.reload()
    await expect(page.getByTestId('tienda-kit').first()).toBeVisible()
    const broken = await page.evaluate(() =>
      [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
    )
    expect(broken, `imágenes rotas: ${broken.join(', ')}`).toEqual([])
    expect(failed, `requests fallidos: ${failed.join(', ')}`).toEqual([])
  })
})

test.describe('Tienda — layout mobile', () => {
  // el viewport lo pone el proyecto mobile-chrome (Pixel 5) de playwright.config.js
  test.skip(({ isMobile }) => !isMobile, 'sólo aplica al proyecto mobile-chrome')

  test.beforeEach(async ({ page }) => {
    await stubCatalog(page)
    await page.goto('/tienda')
    await expect(page.getByRole('heading', { name: 'Elegí cómo empezar' })).toBeVisible()
  })

  test('la página no scrollea en horizontal', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow, 'la tienda desborda a lo ancho').toBeLessThanOrEqual(0)
  })

  test('ninguna foto se sale de su tarjeta', async ({ page }) => {
    const overflowing = await page.evaluate(() => {
      const out = []
      document
        .querySelectorAll(
          '[data-testid="tienda-kit"], [data-testid="tienda-grupal"], [data-testid="tienda-featured"], [data-testid="tienda-row"]'
        )
        .forEach((card) => {
          const cb = card.getBoundingClientRect()
          card.querySelectorAll('img').forEach((img) => {
            const ib = img.getBoundingClientRect()
            // 1px de tolerancia por redondeo subpíxel
            if (ib.left < cb.left - 1 || ib.right > cb.right + 1) {
              out.push(`${card.dataset.testid}: ${img.alt}`)
            }
          })
        })
      return out
    })
    expect(overflowing, `fotos fuera de la tarjeta: ${overflowing.join(', ')}`).toEqual([])
  })

  test('la foto del kit ocupa el ancho de la tarjeta (full-bleed)', async ({ page }) => {
    const kit = page.getByTestId('tienda-kit').first()
    const { cardWidth, imgWidth, imgHeight } = await kit.evaluate((card) => {
      const img = card.querySelector('img')
      return {
        cardWidth: card.getBoundingClientRect().width,
        imgWidth: img.getBoundingClientRect().width,
        imgHeight: img.getBoundingClientRect().height,
      }
    })
    // full-bleed: la foto rompe el padding de 28px y llega borde a borde
    expect(Math.abs(imgWidth - cardWidth)).toBeLessThanOrEqual(2)
    // cuadrada: aspect-ratio 1 aplicado (no colapsada por el flex column)
    expect(Math.abs(imgHeight - imgWidth)).toBeLessThanOrEqual(2)
  })

  test('las fotos no comen la pantalla: cada tarjeta entra en el viewport', async ({
    page,
  }) => {
    const vh = page.viewportSize().height
    const tall = await page.evaluate(
      (limit) =>
        [...document.querySelectorAll('[data-testid="tienda-kit"]')]
          .filter((c) => c.getBoundingClientRect().height > limit)
          .map((c) => c.querySelector('img')?.alt || '?'),
      vh
    )
    expect(tall, `tarjetas más altas que la pantalla: ${tall.join(', ')}`).toEqual([])
  })

  test('los botones de compra son tocables (>= 44px)', async ({ page }) => {
    const small = await page.evaluate(() => {
      const out = []
      document
        .querySelectorAll(
          '.tienda-kit__cta, .tienda-grupal__cta, .tienda-grupal__more, ' +
            '.tienda__filters button, .tienda-row__action, .tienda-featured__ctas > *'
        )
        .forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.height < 44) out.push(`${el.textContent.trim()} (${Math.round(r.height)}px)`)
        })
      return out
    })
    expect(small, `tap targets chicos: ${small.join(', ')}`).toEqual([])
  })

  test('las fotos reservan espacio: sin layout shift al cargar', async ({ page }) => {
    // aspect-ratio en CSS evita el salto; si se saca, la altura arranca en 0
    const heights = await page.evaluate(() =>
      [...document.querySelectorAll('[data-testid="tienda-kit"] img')].map(
        (img) => img.getBoundingClientRect().height
      )
    )
    expect(heights.length).toBeGreaterThan(0)
    heights.forEach((h) => expect(h).toBeGreaterThan(0))
  })
})

test.describe('Tienda — catálogo degradado', () => {
  test('un producto sin thumbnail no rompe la tienda', async ({ page }) => {
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await stubCatalog(
      page,
      PRODUCTS.map((p) => (p.category === 'Kits' ? { ...p, thumbnail: null } : p))
    )
    await page.goto('/tienda')
    await expect(page.getByRole('heading', { name: 'Elegí cómo empezar' })).toBeVisible()
    await expect(page.getByTestId('tienda-kit')).toHaveCount(2)
    // la tarjeta sigue comprable aunque no haya foto
    await expect(
      page.getByTestId('tienda-kit').first().getByRole('button', { name: 'Comprar' })
    ).toBeVisible()
    expect(errors).toEqual([])
  })
})
