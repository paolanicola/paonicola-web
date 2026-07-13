// @ts-check
const { test, expect } = require('@playwright/test')

// These run under both the desktop-chrome and mobile-chrome projects,
// so passing them also proves the layout holds at both breakpoints.
test.describe('Home redesign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders every section of the redesign', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Si buscás una dieta más/ })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Testimonios' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /quieren un cambio real/ })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /Este programa nació/ })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Contacto' })
    ).toBeVisible()
  })

  test('hero shows both CTAs pointing to the right routes', async ({ page }) => {
    // scopeado al hero: el footer nuevo también tiene "Reservar consulta"
    const hero = page.locator('.home__hero')
    await expect(
      hero.getByRole('link', { name: 'Reservar consulta' })
    ).toHaveAttribute('href', '/tienda')
    await expect(
      hero.getByRole('link', { name: 'Hablar con Paola' })
    ).toHaveAttribute('href', '/contacto')
  })

  test('renders the hero image and the stats card (+12 / +1000)', async ({ page }) => {
    await expect(page.getByAltText(/Paola Nicola/)).toBeVisible()
    await expect(page.locator('.home-stats')).toBeVisible()
    await expect(page.locator('.home-stats')).toContainText('+12')
    await expect(page.locator('.home-stats')).toContainText('años de experiencia')
    await expect(page.locator('.home-stats')).toContainText('+1000')
    await expect(page.locator('.home-stats')).toContainText('pacientes')
  })

  test('renders exactly three testimonials', async ({ page }) => {
    await expect(page.locator('.home-testimonial')).toHaveCount(3)
  })

  test('lists the five "no es para vos" reasons', async ({ page }) => {
    await expect(page.locator('.home-disqualifier')).toHaveCount(5)
  })

  test('contact form routes to the full contact page on submit', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()
    await expect(page).toHaveURL(/\/contacto$/)
  })

  test('hero CTA navigates to the store', async ({ page }) => {
    await page
      .locator('.home__hero')
      .getByRole('link', { name: 'Reservar consulta' })
      .click()
    await expect(page).toHaveURL(/\/tienda$/)
  })
})
