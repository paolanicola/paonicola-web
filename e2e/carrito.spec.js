// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Carrito redesign', () => {
  test.beforeEach(async ({ page }) => {
    // Seed the cart through the real tienda flow
    await page.goto('/tienda')
    await page.getByRole('button', { name: 'Agregar', exact: true }).first().click()
    await page.goto('/carrito')
    await expect(page.getByRole('heading', { name: 'Tu carrito' })).toBeVisible()
  })

  test('shows the item with promo-aware total', async ({ page }) => {
    await expect(page.getByTestId('carrito-item')).toHaveCount(1)
    // Kit Rendimiento promo: original tachado + promo total (row + summary)
    await expect(page.getByText('$ 48.000')).toBeVisible()
    await expect(page.getByText(/39\.990/).first()).toBeVisible()
  })

  test('quantity stepper updates the summary total', async ({ page }) => {
    await page.getByRole('button', { name: 'Sumar uno' }).click()
    await expect(page.getByText(/79\.980/).first()).toBeVisible() // 2 × 39.990
  })

  test('restar uno baja el total y con cantidad 1 queda deshabilitado', async ({ page }) => {
    await page.getByRole('button', { name: 'Sumar uno' }).click()
    await expect(page.getByText(/79\.980/).first()).toBeVisible()

    await page.getByRole('button', { name: 'Restar uno' }).click()
    await expect(page.locator('.carrito__total-amount')).toHaveText(/39\.990/)
    await expect(page.locator('.carrito-item__qty-value')).toHaveText('1')
    await expect(page.getByRole('button', { name: 'Restar uno' })).toBeDisabled()
  })

  test('vaciar empties the cart and redirects to the tienda', async ({ page }) => {
    await page.getByRole('button', { name: 'vaciar' }).click()
    await expect(page).toHaveURL(/\/tienda$/)
  })

  test('finalizar compra reaches the checkout', async ({ page }) => {
    await page.getByRole('link', { name: /finalizar compra/i }).click()
    await expect(page).toHaveURL(/\/checkout$/)
  })

  test('eliminar saca la fila y vacía el carrito', async ({ page }) => {
    await page.getByRole('button', { name: 'Eliminar' }).click()
    // sin items, el carrito redirige a la tienda
    await expect(page).toHaveURL(/\/tienda$/)
  })
})
