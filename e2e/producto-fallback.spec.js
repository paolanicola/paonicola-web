// @ts-check
const { test, expect } = require('@playwright/test')

/**
 * Regresión de la página de producto (bug 2026-07-19): la API nunca manda
 * `landing: null` — para los productos sin página propia manda el molde vacío
 * `{ kicker: '', headline: '', sticky: false }`, que es truthy. Producto.js
 * entraba igual a la rama de landing y los dos descargables gratuitos quedaban
 * con un <h1> vacío, sin precio y sin botón de compra en producción.
 *
 * No necesita backend: stubea /api/products/:id.
 */

const BASE = {
  id: 147,
  name: 'Guía de Compras Saludables e Inteligentes',
  description: 'Guía para elegir mejor en el supermercado.',
  important_note: null,
  price: 12000,
  active: true,
  active_promo: false,
  promo_price: null,
  stock: 999,
  category: 'Descargable gratuito',
  requires_appointment: false,
  thumbnail: 'https://img.test/compras.png',
  download_url: '/descargables/compras-saludables.pdf',
}

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z4AAT' +
    'BhsRvJhAAAA//8DTgEF0iCB6wAAAABJRU5ErkJggg==',
  'base64'
)

async function stubProduct(page, product) {
  await page.route('**/api/products/*', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(product) })
  )
  await page.route('https://img.test/**', (route) =>
    route.fulfill({ contentType: 'image/png', body: PNG })
  )
}

test.describe('Producto — landing vacía del admin', () => {
  test('el molde vacío cae al detalle genérico, con precio y botón', async ({ page }) => {
    await stubProduct(page, { ...BASE, landing: { kicker: '', headline: '', sticky: false } })
    await page.goto('/producto/147')

    await expect(page.getByRole('heading', { name: BASE.name })).toBeVisible()
    await expect(page.getByText(/12\.000/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Comprar' })).toBeVisible()
    // el <h1> nunca puede quedar vacío
    await expect(page.locator('h1')).not.toHaveText('')
  })

  test('un producto sin landing sigue cayendo al detalle genérico', async ({ page }) => {
    await stubProduct(page, { ...BASE, landing: null })
    await page.goto('/producto/147')
    await expect(page.getByRole('heading', { name: BASE.name })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Comprar' })).toBeVisible()
  })

  test('una landing de verdad sigue renderizando su hero', async ({ page }) => {
    await stubProduct(page, {
      ...BASE,
      landing: {
        kicker: 'Empezá gratis',
        headline: 'Comprar mejor empieza antes de llegar a la góndola',
        heroCta: 'Descargar la guía',
        sticky: false,
      },
    })
    await page.goto('/producto/147')
    await expect(
      page.getByRole('heading', { name: /antes de llegar a la góndola/ })
    ).toBeVisible()
    await expect(page.getByTestId('hero-buy')).toHaveText('Descargar la guía')
  })
})
