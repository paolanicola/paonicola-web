// @ts-check
const { test, expect } = require('@playwright/test')

// Checkout wizard (design 14a reskin): carrito → datos del comprador →
// selección de método de pago. Se detiene antes del checkout externo de
// MercadoPago (no hay Transferencia habilitada en la UI actual).
test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tienda')
    // Kit Regula (sin promo, sin calendario) → wizard de 2 pasos
    await page
      .getByTestId('tienda-row')
      .filter({ hasText: 'Kit Regula' })
      .getByRole('button', { name: 'Agregar' })
      .click()
    await page.goto('/carrito')
    await page.getByRole('link', { name: /finalizar compra/i }).click()
    await expect(page).toHaveURL(/\/checkout$/)
  })

  test('paso 1: valida los datos del comprador', async ({ page }) => {
    await expect(
      page.getByText('Datos de la persona que realizará la compra')
    ).toBeVisible()

    // submit vacío → errores de validación de react-hook-form
    await page.locator('button[form="formularioTurno"]').click()
    await expect(page.locator('.span_error').first()).toBeVisible()
  })

  test('paso 2: con datos válidos llega a métodos de pago', async ({ page }) => {
    await page.locator('#formularioTurno input[name="name"]').fill('Agustín')
    await page.locator('#formularioTurno input[name="lastname"]').fill('Paz')
    await page.locator('#formularioTurno input[name="email"]').fill('agustin@test.com')
    await page.locator('#formularioTurno input[name="phone"]').fill('1122334455')
    await page.locator('button[form="formularioTurno"]').click()

    await expect(page.getByText('Seleccioná el método de pago')).toBeVisible()
    await expect(page.locator('.payment-block').first()).toBeVisible()

    // el resumen sigue mostrando el producto y su precio
    await expect(page.getByText(/Kit Regula/).first()).toBeVisible()
    await expect(page.getByText(/29\.990/).first()).toBeVisible()
  })

  test('permite volver del paso de pago a los datos', async ({ page }) => {
    await page.locator('#formularioTurno input[name="name"]').fill('Agustín')
    await page.locator('#formularioTurno input[name="lastname"]').fill('Paz')
    await page.locator('#formularioTurno input[name="email"]').fill('agustin@test.com')
    await page.locator('#formularioTurno input[name="phone"]').fill('1122334455')
    await page.locator('button[form="formularioTurno"]').click()
    await expect(page.getByText('Seleccioná el método de pago')).toBeVisible()

    await page.locator('.carrito-finalizar-next').click()
    await expect(
      page.getByText('Datos de la persona que realizará la compra')
    ).toBeVisible()
  })
})
