// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Navegación global', () => {
  test('mobile: el menú hamburguesa abre y navega', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'hamburguesa solo visible en mobile')

    await page.goto('/')
    await page.locator('.pn-header__menu-btn').click()
    const menu = page.locator('.pn-header__drawer--open')
    await expect(menu).toBeVisible()

    await menu.getByRole('link', { name: 'Contacto' }).click()
    await expect(page).toHaveURL(/\/contacto$/)
  })

  test('desktop: los links del nav están visibles y navegan', async ({ page, isMobile }) => {
    test.skip(Boolean(isMobile), 'nav expandido solo en desktop')

    await page.goto('/')
    await page.locator('.pn-header__nav').getByRole('link', { name: 'Contacto' }).click()
    await expect(page).toHaveURL(/\/contacto$/)
  })

  test('el link de sesión del header lleva a /ingresar', async ({ page, isMobile }) => {
    test.skip(Boolean(isMobile), 'link dentro del menú en mobile')

    await page.goto('/')
    await page.getByRole('link', { name: 'Iniciar sesión' }).click()
    await expect(page).toHaveURL(/\/ingresar$/)
  })

  test('una ruta inexistente muestra el 404 con vuelta al inicio', async ({ page }) => {
    await page.goto('/esta-ruta-no-existe')
    await expect(page.getByText('Parece que esta página no existe')).toBeVisible()
    await page.getByRole('link', { name: /Ir a la página principal/ }).click()
    await expect(page).toHaveURL(/\/home$/)
  })

  test('las anclas del nav llevan a las secciones del inicio', async ({ page, isMobile }) => {
    test.skip(Boolean(isMobile), 'nav expandido solo en desktop')

    await page.goto('/contacto')
    await page.locator('.pn-header__nav').getByRole('link', { name: 'Testimonios' }).click()
    await expect(page).toHaveURL(/\/#testimonios$/)
    await expect(page.locator('#testimonios')).toBeInViewport()
    // el item clickeado queda subrayado (activo) y "Inicio" no compite
    await expect(
      page.locator('.pn-header__nav').getByRole('link', { name: 'Testimonios' })
    ).toHaveClass(/--active/)
    await expect(
      page.locator('.pn-header__nav').getByRole('link', { name: 'Inicio' })
    ).not.toHaveClass(/--active/)

    await page.locator('.pn-header__nav').getByRole('link', { name: 'Por qué acompaño así' }).click()
    await expect(page.locator('#por-que-acompano')).toBeInViewport()
    await expect(
      page.locator('.pn-header__nav').getByRole('link', { name: 'Por qué acompaño así' })
    ).toHaveClass(/--active/)
  })

  test('el wordmark del header lleva al inicio (design 6a)', async ({ page }) => {
    await page.goto('/faq')
    await page.locator('.pn-header__brand').click()
    await expect(page).toHaveURL(/\/$/)
  })
})
