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

  test('featured program shows price, installments and badge', async ({ page }) => {
    const featured = page.getByTestId('tienda-featured')
    await expect(featured.getByText(/499\.000/)).toBeVisible()
    await expect(featured.getByText('o 3 cuotas de $185.000')).toBeVisible()
    await expect(featured.getByText('Más elegido')).toBeVisible()
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
})
