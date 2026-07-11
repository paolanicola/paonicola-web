// @ts-check
const { test, expect } = require('@playwright/test')

// One patient per project so parallel desktop/mobile runs don't invalidate
// each other's tokens (login regenerates the auth token server-side).
// Seeded by db/seeds/dev_portal.rb: bought Kit Rendimiento → Deporte partially
// unlocked (4 + 2 locked), everything else locked.
test.describe.configure({ mode: 'serial' })

test.describe('Portal del paciente', () => {
  /** @param {import('@playwright/test').TestInfo} testInfo */
  const emailFor = (testInfo) =>
    testInfo.project.name.includes('mobile')
      ? 'agustina@test.com'
      : 'agustin@test.com'

  async function login(page, testInfo) {
    await page.goto('/ingresar')
    await page.getByLabel('Email').fill(emailFor(testInfo))
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page).toHaveURL(/\/portal$/)
  }

  test('guard: /portal sin sesión redirige a /ingresar', async ({ page }) => {
    await page.goto('/portal')
    await expect(page).toHaveURL(/\/ingresar$/)
  })

  test('login con credenciales inválidas muestra el error', async ({ page }) => {
    await page.goto('/ingresar')
    await page.getByLabel('Email').fill('agustin@test.com')
    await page.getByLabel('Contraseña').fill('incorrecta-123')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page.getByRole('alert')).toContainText(/incorrectos/)
  })

  test('login OK: portal con progreso, candados y upsell (18a)', async ({ page }, testInfo) => {
    await login(page, testInfo)

    await expect(page.getByRole('heading', { name: /Hola, Agust/ })).toBeVisible()
    await expect(page.getByText(/% del material recomendado/)).toBeVisible()

    const categories = page.getByTestId('portal-category')
    await expect(categories.filter({ hasText: 'Deporte' })).toContainText('Desbloqueada')
    await expect(categories.filter({ hasText: 'Ansiedad' })).toContainText('🔒')
    await expect(page.getByText('¿Querés acceso a toda la biblioteca?')).toBeVisible()
  })

  test('categoría Deporte: material del kit + bloqueados con upsell (19a)', async ({ page }, testInfo) => {
    await login(page, testInfo)
    await page.getByTestId('portal-category').filter({ hasText: 'Deporte' }).click()

    await expect(page.getByRole('heading', { name: 'Deporte' })).toBeVisible()
    await expect(page.getByTestId('portal-resource')).toHaveCount(4)
    await expect(page.getByTestId('portal-resource-locked')).toHaveCount(2)
    await expect(page.getByText('✓ Visto').first()).toBeVisible()
    await expect(
      page.getByText('Desbloqueá todo el contenido de Deporte')
    ).toBeVisible()
  })

  test('abrir un recurso lo marca como visto', async ({ page, context }, testInfo) => {
    await login(page, testInfo)
    await page.getByTestId('portal-category').filter({ hasText: 'Deporte' }).click()

    const pending = page
      .getByTestId('portal-resource')
      .filter({ hasText: 'Sin ver' })
      .first()
    const title = await pending
      .locator('.portal-resource__title')
      .textContent()

    const popupPromise = context.waitForEvent('page')
    await pending.click()
    await (await popupPromise).close()

    await expect(
      page
        .getByTestId('portal-resource')
        .filter({ hasText: title || '' })
        .getByText('✓ Visto')
    ).toBeVisible()
  })

  test('logout vuelve al inicio y el header ofrece iniciar sesión', async ({ page }, testInfo) => {
    await login(page, testInfo)
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await expect(page).toHaveURL(/\/$/)
    await page.goto('/portal')
    await expect(page).toHaveURL(/\/ingresar$/)
  })
})
