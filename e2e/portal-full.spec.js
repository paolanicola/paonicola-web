// @ts-check
const { test, expect } = require('@playwright/test')

// Paciente con Método Regula (full_library_access) → portal 8a: todo
// desbloqueado, sin candados ni upsell. Un paciente por proyecto para que
// el login (que regenera token) no pise la otra sesión.
test.describe.configure({ mode: 'serial' })

test.describe('Portal con acceso total (8a)', () => {
  /** @param {import('@playwright/test').TestInfo} testInfo */
  const emailFor = (testInfo) =>
    testInfo.project.name.includes('mobile')
      ? 'camila@test.com'
      : 'julieta@test.com'

  test('todas las categorías desbloqueadas y sin upsell', async ({ page }, testInfo) => {
    await page.goto('/ingresar')
    await page.getByLabel('Email').fill(emailFor(testInfo))
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page).toHaveURL(/\/portal$/)

    const categories = page.getByTestId('portal-category')
    await expect(categories.first()).toBeVisible()
    await expect(page.locator('.portal-category--locked')).toHaveCount(0)
    await expect(
      page.getByText('¿Querés acceso a toda la biblioteca?')
    ).toHaveCount(0)
  })

  test('una categoría con material no muestra sección bloqueada', async ({ page }, testInfo) => {
    await page.goto('/ingresar')
    await page.getByLabel('Email').fill(emailFor(testInfo))
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await page.getByTestId('portal-category').filter({ hasText: 'Ansiedad' }).click()

    await expect(page.getByRole('heading', { name: 'Ansiedad' })).toBeVisible()
    await expect(page.getByTestId('portal-resource')).toHaveCount(5)
    await expect(page.getByTestId('portal-resource-locked')).toHaveCount(0)
  })

  test('los filtros por tipo acotan el material de la categoría', async ({ page }, testInfo) => {
    await page.goto('/ingresar')
    await page.getByLabel('Email').fill(emailFor(testInfo))
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await page.getByTestId('portal-category').filter({ hasText: 'Ansiedad' }).click()
    await expect(page.getByTestId('portal-resource')).toHaveCount(5)

    await page.getByRole('button', { name: 'Videos' }).click()
    await expect(page.getByTestId('portal-resource')).toHaveCount(2) // 2 videos en Ansiedad

    await page.getByRole('button', { name: 'Todos' }).click()
    await expect(page.getByTestId('portal-resource')).toHaveCount(5)
  })
})
