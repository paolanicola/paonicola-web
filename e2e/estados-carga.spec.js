// @ts-check
const { test, expect } = require('@playwright/test')

/**
 * Estados de carga y error de /tienda y /producto/:id.
 *
 * El pedido original: mientras cargaba, el contenido era una sola línea de
 * texto, así que la página no tenía alto y el footer quedaba flotando en el
 * medio de la pantalla. Acá se verifica que el skeleton reserve el alto.
 *
 * No necesita backend: demora / falla las respuestas con page.route.
 */

const PRODUCTS = [
  {
    id: 1,
    name: 'Método Regula',
    description: 'Acompañamiento de 12 semanas.',
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
  },
]

/** Deja el request colgado para poder mirar el estado de carga. */
async function hangCatalog(page, pattern = '**/api/products*') {
  await page.route(pattern, () => {})
}

async function failCatalog(page, pattern = '**/api/products*') {
  await page.route(pattern, (route) => route.abort('failed'))
}

/**
 * Dónde arranca el footer, como fracción del alto del viewport. El bug era que
 * el contenido no tenía alto y el footer subía al medio (~0.4); con el skeleton
 * tiene que quedar al fondo o abajo del fold. Se tolera que asome un poco.
 */
async function footerStart(page) {
  return page.evaluate(() => {
    const footer = document.querySelector('footer')
    if (!footer) return null
    return footer.getBoundingClientRect().top / window.innerHeight
  })
}

const FOOTER_MIN = 0.85

test.describe('Tienda — estado de carga', () => {
  test('muestra el skeleton, no una línea de texto', async ({ page }) => {
    await hangCatalog(page)
    await page.goto('/tienda')
    await expect(page.getByTestId('tienda-skeleton')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Elegí cómo empezar' })).toBeVisible()
  })

  // el pedido original: el footer no puede quedar flotando en el medio
  test('el footer no sube al medio de la pantalla', async ({ page }) => {
    await hangCatalog(page)
    await page.goto('/tienda')
    await expect(page.getByTestId('tienda-skeleton')).toBeVisible()
    const start = await footerStart(page)
    expect(start, 'no se encontró el footer').not.toBeNull()
    expect(start).toBeGreaterThanOrEqual(FOOTER_MIN)
  })

  test('los filtros quedan deshabilitados mientras carga', async ({ page }) => {
    await hangCatalog(page)
    await page.goto('/tienda')
    await expect(page.getByRole('button', { name: 'Kits', exact: true })).toBeDisabled()
  })

  test('el skeleton se va cuando llega el catálogo', async ({ page }) => {
    let release
    const gate = new Promise((r) => (release = r))
    await page.route('**/api/products*', async (route) => {
      await gate
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(PRODUCTS),
      })
    })
    await page.goto('/tienda')
    await expect(page.getByTestId('tienda-skeleton')).toBeVisible()
    release()
    await expect(page.getByTestId('tienda-skeleton')).toHaveCount(0)
    await expect(page.getByTestId('tienda-featured')).toBeVisible()
  })
})

test.describe('Tienda — estado de error', () => {
  test('muestra el error con botón de reintento y se recupera', async ({ page }) => {
    let shouldFail = true
    await page.route('**/api/products*', (route) => {
      if (shouldFail) return route.abort('failed')
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(PRODUCTS),
      })
    })
    await page.goto('/tienda')

    const alert = page.getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText('Contactarse al')

    // Regresión: `failed` no se limpiaba, así que el reintento nunca salía
    // del mensaje de error aunque la API respondiera bien
    shouldFail = false
    await page.getByRole('button', { name: 'Reintentar' }).click()
    await expect(page.getByTestId('tienda-featured')).toBeVisible()
    await expect(page.getByRole('alert')).toHaveCount(0)
  })
})

test.describe('Producto — estados', () => {
  test('muestra el skeleton mientras carga', async ({ page }) => {
    await hangCatalog(page, '**/api/products/*')
    await page.goto('/producto/1')
    await expect(page.getByTestId('producto-skeleton')).toBeVisible()
    expect(await footerStart(page)).toBeGreaterThanOrEqual(FOOTER_MIN)
  })

  // Regresión: un 404 dejaba "Cargando producto ..." infinito
  test('un producto inexistente muestra error, no carga infinita', async ({ page }) => {
    await page.route('**/api/products/*', (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: '{}' })
    )
    await page.goto('/producto/99999')
    await expect(page.getByRole('alert')).toContainText('No encontramos este producto')
    await expect(page.getByTestId('producto-skeleton')).toHaveCount(0)
    await page.getByRole('link', { name: 'Volver a la tienda' }).click()
    await expect(page).toHaveURL(/\/tienda$/)
  })

  test('un fallo de red también corta la carga', async ({ page }) => {
    await failCatalog(page, '**/api/products/*')
    await page.goto('/producto/1')
    await expect(page.getByRole('alert')).toContainText('No encontramos este producto')
  })
})
