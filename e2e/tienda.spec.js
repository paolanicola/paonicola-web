// @ts-check
const { test, expect } = require('@playwright/test')

// Corre contra el catálogo dev sembrado (db/seeds/dev_store_catalog.rb):
// Método Regula (1:1, con primer turno y precio por región), Programa Grupal,
// Membresía, 2 Kits y 2 descargables gratuitos.
// Handoff de la tienda: una sola grilla de tarjetas iguales. Compra directa,
// sin carrito.
const card = (page, name) => page.getByTestId('tienda-card').filter({ hasText: name })

test.describe('Tienda — grilla de tarjetas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tienda')
    await expect(
      page.getByRole('heading', { name: 'Elegí cómo empezar' })
    ).toBeVisible()
  })

  test('muestra todo el catálogo en tarjetas iguales', async ({ page }) => {
    await expect(page.getByTestId('tienda-card')).toHaveCount(7)
  })

  test('los precios y los botones quedan alineados a la misma altura', async ({ page }) => {
    // align-items:stretch + margin-top:auto en la fila de precio: es la clave
    // del diseño y lo que se rompe si alguien toca el layout de la tarjeta
    const buys = page.locator('.tienda-card__buy')
    await expect(buys.first()).toBeVisible()
    const tops = await buys.evaluateAll((rows) =>
      rows.map((r) => Math.round(r.getBoundingClientRect().top))
    )
    // las tarjetas de una misma fila de la grilla comparten el borde superior
    const firstRow = tops.slice(0, 3)
    expect(new Set(firstRow).size).toBe(1)
  })

  test('el Método muestra precio, badge y nota de turno', async ({ page }) => {
    const metodo = card(page, 'Método Regula')
    await expect(metodo.getByText(/499\.000/)).toBeVisible()
    await expect(metodo.getByText('Más elegido')).toBeVisible()
  })

  test('el selector de región cambia precio y cuotas', async ({ page }) => {
    const metodo = card(page, 'Método Regula')
    await expect(metodo.getByRole('button', { name: 'Argentina' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    await expect(metodo.getByText('o 3 cuotas de $ 185.000')).toBeVisible()

    await metodo.getByRole('button', { name: 'Exterior' }).click()
    await expect(metodo.getByText('USD 350')).toBeVisible()
    await expect(metodo.getByText('o 3 cuotas de USD 125')).toBeVisible()

    await metodo.getByRole('button', { name: 'Argentina' }).click()
    await expect(metodo.getByText(/499\.000/)).toBeVisible()
  })

  test('solo el Método ofrece el selector de región', async ({ page }) => {
    await expect(
      card(page, 'Kit Regula').getByRole('button', { name: 'Argentina' })
    ).toHaveCount(0)
  })

  test('la membresía muestra el bloque 🗝️ en vez de foto', async ({ page }) => {
    const membresia = card(page, 'Acceso a la biblioteca')
    await expect(membresia.locator('.tienda-card__icon')).toBeVisible()
    await expect(membresia.locator('img')).toHaveCount(0)
    await expect(membresia.getByText('/mes')).toBeVisible()
    await expect(membresia.getByRole('button', { name: 'Continuar' })).toBeVisible()
  })

  test('los kits muestran sus precios', async ({ page }) => {
    await expect(card(page, 'Rendimiento').getByText(/39\.990/)).toBeVisible()
    await expect(card(page, '7 días').getByText(/27\.990/)).toBeVisible()
  })

  test('los descargables gratis dicen Gratis y bajan el archivo directo', async ({ page }) => {
    const links = page.getByRole('link', { name: 'Descargar' })
    await expect(links).toHaveCount(2)
    await expect(page.getByText('Gratis').first()).toBeVisible()

    const href = await links.first().getAttribute('href')
    expect(href).toMatch(/\/descargables\/.+\.(pdf|png)/)
    // el archivo existe de verdad (servido por el frontend)
    const res = await page.request.get(href || '')
    expect(res.status()).toBe(200)
  })

  test('los chips salen de las categorías reales y filtran la grilla', async ({ page }) => {
    const chips = page.getByRole('group', { name: 'Filtrar por categoría' })
    await expect(chips.getByRole('button', { name: 'Todo', exact: true })).toBeVisible()

    await chips.getByRole('button', { name: 'Kits', exact: true }).click()
    await expect(page.getByTestId('tienda-card')).toHaveCount(2)
    await expect(card(page, 'Método Regula')).toHaveCount(0)

    await chips.getByRole('button', { name: 'Membresía', exact: true }).click()
    await expect(page.getByTestId('tienda-card')).toHaveCount(1)

    await chips.getByRole('button', { name: 'Todo', exact: true }).click()
    await expect(page.getByTestId('tienda-card')).toHaveCount(7)
  })

  test('Agregar un kit abre el modal directo en el paso de pago', async ({ page }) => {
    await card(page, '7 días').getByRole('button', { name: 'Agregar' }).click()
    const modal = page.getByTestId('compra-directa')
    await expect(modal).toBeVisible()
    await expect(modal.getByText('Compra directa · sin carrito')).toBeVisible()
    await expect(modal.getByText(/27\.990/)).toBeVisible()
    await expect(modal.getByTestId('cd-pay')).toBeDisabled()
    await modal.getByRole('button', { name: 'Cancelar' }).click()
    await expect(modal).toHaveCount(0)
  })

  test('Agregar el 1:1 abre el calendario con días disponibles reales', async ({ page }) => {
    await card(page, 'Método Regula').getByRole('button', { name: 'Agregar' }).click()
    const modal = page.getByTestId('compra-directa')
    await expect(modal.getByText('Elegí tu primer turno')).toBeVisible()
    await expect(modal.getByText('Paso 1 de 2')).toBeVisible()
    // los seeds dejan horarios libres la semana próxima
    await expect(modal.getByTestId('cd-day').first()).toBeVisible()
  })

  test('la tarjeta linkea al detalle del producto', async ({ page }) => {
    await card(page, 'Rendimiento').locator('.tienda-card__name').click()
    await expect(page).toHaveURL(/\/producto\/\d+$/)
  })

  test('el header ya no suma al carrito desde la tienda', async ({ page }) => {
    const badge = page.locator('.nro-carrito')
    await expect(badge).toHaveText('0')
    await card(page, 'Rendimiento').getByRole('button', { name: 'Agregar' }).click()
    await expect(page.getByTestId('compra-directa')).toBeVisible()
    await expect(badge).toHaveText('0')
  })
})
