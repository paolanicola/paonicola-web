// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Producto landing pages', () => {
  test('Método Regula renders its full landing from the tienda', async ({ page }) => {
    await page.goto('/tienda')
    await page
      .getByRole('link', { name: /Método Regula — programa 1 a 1/ })
      .first()
      .click()

    await expect(
      page.getByRole('heading', { name: /esfuerzo constante por comer mejor/ })
    ).toBeVisible()
    // navy storytelling band
    await expect(page.getByText('Por eso creé Método Regula.')).toBeVisible()
    // checklist + purchase block with live API price
    await expect(page.getByText('Plan de alimentación personalizado')).toBeVisible()
    await expect(page.getByText('Cupos limitados')).toBeVisible()
    const purchase = page.getByTestId('purchase-block')
    await expect(purchase.getByText(/499\.000/)).toBeVisible()
    await expect(
      purchase.getByRole('button', { name: 'Empezar Método Regula' })
    ).toBeVisible()
  })

  test('Kit Regula renders the navy 7-días checklist', async ({ page }) => {
    await page.goto('/tienda')
    await page.getByRole('link', { name: /Kit Regula — protocolo/ }).first().click()

    await expect(
      page.getByRole('heading', { name: /7 días para regular tu sistema nervioso/ })
    ).toBeVisible()
    await expect(
      page.getByText('Frenar el impulso antes de que aparezca')
    ).toBeVisible()
    await expect(
      page.getByText('No buscamos perfección. Buscamos regulación real.')
    ).toBeVisible()
  })

  test('adding from the purchase block updates the cart flow', async ({ page }) => {
    await page.goto('/tienda')
    await page.getByRole('link', { name: /Kit Rendimiento/ }).first().click()
    await expect(
      page.getByRole('heading', { name: /rendimiento tiene un techo/ })
    ).toBeVisible()

    await page
      .getByTestId('purchase-block')
      .getByRole('button', { name: 'Agregar al carrito' })
      .click()
    await page.goto('/carrito')
    await expect(page.getByTestId('carrito-item')).toHaveCount(1)
    await expect(
      page.getByTestId('carrito-item').getByText('Kit Rendimiento Inteligente')
    ).toBeVisible()
  })
})
