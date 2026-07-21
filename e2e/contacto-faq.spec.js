// @ts-check
const { test, expect } = require('@playwright/test')

/**
 * Contacto y FAQ rediseñados (2026-07-19). Antes tenían el diseño viejo (banner
 * rosa con pincelada) embutido entre el header/footer nuevos, y el formulario
 * de contacto no enviaba nada. No necesita backend.
 */

test.describe('Contacto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contacto')
    await expect(page.getByRole('heading', { name: 'Hablemos' })).toBeVisible()
  })

  test('no muestra el banner viejo (encabezado con pincelada)', async ({ page }) => {
    await expect(page.locator('.encabezado__container')).toHaveCount(0)
  })

  test('el formulario abre WhatsApp con el mensaje precargado', async ({ page }) => {
    // interceptar la nueva pestaña de WhatsApp
    let waUrl = null
    await page.context().route('https://wa.me/**', (route) => {
      waUrl = route.request().url()
      return route.abort()
    })
    page.on('popup', () => {})

    await page.getByLabel('Nombre').fill('Ana Test')
    await page.getByLabel(/Mensaje/).fill('Quiero empezar el programa')

    const popupPromise = page.waitForEvent('popup').catch(() => null)
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()
    const popup = await popupPromise

    const url = waUrl || (popup && popup.url())
    expect(url, 'no se abrió WhatsApp').toBeTruthy()
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('wa.me/5492352404233')
    expect(decoded).toContain('Soy Ana Test')
    expect(decoded).toContain('Quiero empezar el programa')
  })

  test('no envía sin nombre ni mensaje', async ({ page }) => {
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()
    await expect(page.getByText('Contame tu nombre')).toBeVisible()
    await expect(page.getByText('Escribí tu consulta')).toBeVisible()
  })

  test('no scrollea en horizontal en mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'sólo mobile-chrome')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })
})

test.describe('FAQ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/faq')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('no muestra el banner viejo', async ({ page }) => {
    await expect(page.locator('.encabezado__container')).toHaveCount(0)
  })

  test('el acordeón abre y cierra la respuesta', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /consultas son online/i })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByText(/consultorio presencial/i)).toBeVisible()
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('el CTA de cierre lleva a la tienda', async ({ page }) => {
    await page.getByRole('link', { name: 'Ver la tienda' }).click()
    await expect(page).toHaveURL(/\/tienda$/)
  })

  test('los toggles son tocables en mobile (>= 44px)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'sólo mobile-chrome')
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('.pn-faq__trigger')]
        .filter((el) => el.getBoundingClientRect().height < 44)
        .map((el) => el.textContent.trim())
    )
    expect(small).toEqual([])
  })
})
