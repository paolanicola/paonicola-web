// @ts-check
const { test, expect } = require('@playwright/test')

// Runs against the seeded dev catalog (db/seeds/dev_store_catalog.rb in the
// Rails repo): Método Regula, Membresía, 2 Kits, 2 descargables gratuitos.
test.describe('Tienda redesign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tienda')
    await expect(
      page.getByRole('heading', { name: 'Elegí cómo empezar' })
    ).toBeVisible()
  })

  test('renders every category section from the API', async ({ page }) => {
    await expect(page.getByTestId('tienda-featured')).toBeVisible()
    await expect(page.getByTestId('tienda-membership')).toBeVisible()
    await expect(page.getByTestId('tienda-row')).toHaveCount(4) // 2 kits + 2 descargables
  })

  test('featured program shows price and badge (pago único, sin cuotas)', async ({ page }) => {
    const featured = page.getByTestId('tienda-featured')
    await expect(featured.getByText(/499\.000/)).toBeVisible()
    await expect(featured.getByText('Más elegido')).toBeVisible()
    // Pao 2026-07-12: low ticket, sin cuotas
    await expect(featured.getByText(/cuotas/)).toHaveCount(0)
  })

  test('kit shows promo strikethrough pricing', async ({ page }) => {
    await expect(page.getByText('$ 48.000')).toBeVisible()
    await expect(page.getByText(/39\.990/).first()).toBeVisible()
  })

  test('free downloadable has a direct download link', async ({ page }) => {
    const links = page.getByRole('link', { name: 'Descargar' })
    await expect(links).toHaveCount(2)
    await expect(links.first()).toHaveAttribute(
      'href',
      /\/descargables\/.+\.(pdf|png)/
    )
    // el archivo existe de verdad (servido por el frontend)
    const href = await links.first().getAttribute('href')
    const res = await page.request.get(href || '')
    expect(res.status()).toBe(200)
  })

  test('category chips filter the sections', async ({ page }) => {
    await page.getByRole('button', { name: 'Kits', exact: true }).click()
    await expect(page.getByTestId('tienda-featured')).toHaveCount(0)
    await expect(page.getByTestId('tienda-row')).toHaveCount(2)
    await page.getByRole('button', { name: 'Todo', exact: true }).click()
    await expect(page.getByTestId('tienda-featured')).toBeVisible()
  })

  test('adding the program shows the confirmation toast', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar al carrito' }).click()
    await expect(page.locator('.Toastify')).toContainText(/agregado/i)
  })

  test('flujo completo: agregar suma al contador del header y al carrito', async ({ page }) => {
    const badge = page.locator('.nro-carrito')
    await expect(badge).toHaveText('0')

    // 1° producto: Kit Regula ($29.990)
    await page
      .getByTestId('tienda-row')
      .filter({ hasText: 'Kit Regula' })
      .getByRole('button', { name: 'Agregar' })
      .click()
    await expect(page.locator('.Toastify')).toContainText(/agregado/i)
    await expect(badge).toHaveText('1')

    // 2° producto: Método Regula ($499.000)
    await page.getByRole('button', { name: 'Agregar al carrito' }).click()
    await expect(badge).toHaveText('2')

    // mismo producto de nuevo → suma cantidad, no fila
    await page
      .getByTestId('tienda-row')
      .filter({ hasText: 'Kit Regula' })
      .getByRole('button', { name: 'Agregar' })
      .click()
    await expect(badge).toHaveText('3')

    // el carrito refleja todo: 2 filas, cantidades y total correcto
    await page.goto('/carrito')
    await expect(page.getByTestId('carrito-item')).toHaveCount(2)
    await expect(
      page.getByTestId('carrito-item').filter({ hasText: 'Kit Regula' })
        .locator('.carrito-item__qty-value')
    ).toHaveText('2')
    // total = 2 × 29.990 + 499.000 = 558.980
    await expect(page.locator('.carrito__total-amount')).toHaveText(/558\.980/)
    // el contador del header sigue en 3 dentro del carrito
    await expect(badge).toHaveText('3')
  })
})
