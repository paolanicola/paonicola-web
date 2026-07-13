// @ts-check
const { test, expect } = require('@playwright/test')

// Corre contra el catálogo dev sembrado (db/seeds/dev_store_catalog.rb):
// Método Regula (1:1, con primer turno), Programa Grupal Regula, Membresía,
// 2 Kits y 2 descargables gratuitos. Tienda Rediseño: compra directa, sin carrito.
test.describe('Tienda rediseñada', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tienda')
    await expect(
      page.getByRole('heading', { name: 'Elegí cómo empezar' })
    ).toBeVisible()
  })

  test('renderiza las secciones del diseño', async ({ page }) => {
    await expect(page.getByTestId('tienda-featured')).toBeVisible()
    await expect(page.getByTestId('tienda-grupal')).toBeVisible()
    await expect(page.getByTestId('tienda-membership')).toBeVisible()
    await expect(page.getByTestId('tienda-kit')).toHaveCount(2)
    await expect(page.getByTestId('tienda-row')).toHaveCount(2) // descargables
  })

  test('el Método muestra precio, badge y nota de turno', async ({ page }) => {
    const featured = page.getByTestId('tienda-featured')
    await expect(featured.getByText(/499\.000/)).toBeVisible()
    await expect(featured.getByText('Más elegido')).toBeVisible()
    await expect(featured.getByText('pago único')).toBeVisible()
    await expect(featured.getByText(/elegís tu primer turno/i)).toBeVisible()
    // Pao 2026-07-12: low ticket, sin cuotas
    await expect(featured.getByText(/cuotas/)).toHaveCount(0)
  })

  test('la banda del grupal muestra cupos y precio', async ({ page }) => {
    const grupal = page.getByTestId('tienda-grupal')
    await expect(grupal.getByText(/99\.000/)).toBeVisible()
    await expect(grupal.getByText(/Quedan \d+ cupos/)).toBeVisible()
    await expect(grupal.getByRole('button', { name: 'Sumarme al grupal' })).toBeVisible()
  })

  test('los kits muestran precios nuevos sin promo tachada', async ({ page }) => {
    const kits = page.getByTestId('tienda-kit')
    await expect(kits.filter({ hasText: 'Rendimiento' }).getByText(/39\.990/)).toBeVisible()
    await expect(kits.filter({ hasText: '7 días' }).getByText(/27\.990/)).toBeVisible()
  })

  test('los descargables gratis tienen link directo (sin checkout)', async ({ page }) => {
    const links = page.getByRole('link', { name: 'Descargar gratis' })
    await expect(links).toHaveCount(2)
    const href = await links.first().getAttribute('href')
    expect(href).toMatch(/\/descargables\/.+\.(pdf|png)/)
    // el archivo existe de verdad (servido por el frontend)
    const res = await page.request.get(href || '')
    expect(res.status()).toBe(200)
    await expect(page.getByText('Descarga directa — sin checkout ni registro.')).toBeVisible()
  })

  test('los chips filtran por Programas / Kits / Gratis', async ({ page }) => {
    await page.getByRole('button', { name: 'Kits', exact: true }).click()
    await expect(page.getByTestId('tienda-featured')).toHaveCount(0)
    await expect(page.getByTestId('tienda-membership')).toHaveCount(0)
    await expect(page.getByTestId('tienda-kit')).toHaveCount(2)

    await page.getByRole('button', { name: 'Programas', exact: true }).click()
    await expect(page.getByTestId('tienda-featured')).toBeVisible()
    await expect(page.getByTestId('tienda-grupal')).toBeVisible()

    await page.getByRole('button', { name: 'Gratis', exact: true }).click()
    await expect(page.getByTestId('tienda-row')).toHaveCount(2)

    await page.getByRole('button', { name: 'Todo', exact: true }).click()
    await expect(page.getByTestId('tienda-membership')).toBeVisible()
  })

  test('Comprar un kit abre el modal directo en el paso de pago', async ({ page }) => {
    await page
      .getByTestId('tienda-kit')
      .filter({ hasText: '7 días' })
      .getByRole('button', { name: 'Comprar' })
      .click()
    const modal = page.getByTestId('compra-directa')
    await expect(modal).toBeVisible()
    await expect(modal.getByText('Compra directa · sin carrito')).toBeVisible()
    await expect(modal.getByText(/27\.990/)).toBeVisible()
    await expect(modal.getByTestId('cd-pay')).toBeDisabled()
    await modal.getByRole('button', { name: 'Cancelar' }).click()
    await expect(modal).toHaveCount(0)
  })

  test('Empezar ahora (1:1) abre el calendario con días disponibles reales', async ({ page }) => {
    await page.getByRole('button', { name: 'Empezar ahora' }).click()
    const modal = page.getByTestId('compra-directa')
    await expect(modal.getByText('Elegí tu primer turno')).toBeVisible()
    await expect(modal.getByText('Paso 1 de 2')).toBeVisible()
    // los seeds dejan horarios libres la semana próxima
    await expect(modal.getByTestId('cd-day').first()).toBeVisible()
  })

  test('el header ya no suma al carrito desde la tienda', async ({ page }) => {
    const badge = page.locator('.nro-carrito')
    await expect(badge).toHaveText('0')
    await page
      .getByTestId('tienda-kit')
      .first()
      .getByRole('button', { name: 'Comprar' })
      .click()
    await expect(page.getByTestId('compra-directa')).toBeVisible()
    await expect(badge).toHaveText('0')
  })
})
