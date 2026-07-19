// @ts-check
const { test, expect } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

// Fase D: crear acceso post-compra, membresía vencida y buscador.
test.describe.configure({ mode: 'serial' })

// Los tokens los escribe db/seeds/dev_portal.rb en el tmp/ del backend.
// Por defecto se asume el repo `paolanicola` al lado de este; con el backend
// en otro lado, exportar E2E_TOKEN_DIR.
const TOKEN_DIR =
  process.env.E2E_TOKEN_DIR || path.resolve(__dirname, '../../paolanicola/tmp')

test.describe('Acceso al portal (Fase D)', () => {
  /** @param {import('@playwright/test').TestInfo} testInfo */
  const tokenFor = (testInfo) =>
    fs
      .readFileSync(
        `${TOKEN_DIR}/e2e_access_token_${testInfo.project.name.includes('mobile') ? 'mobile' : 'desktop'}.txt`,
        'utf8'
      )
      .trim()

  test('sin token muestra el aviso de link inválido', async ({ page }) => {
    await page.goto('/crear-acceso')
    await expect(page.getByRole('alert')).toContainText('no es válido')
  })

  test('token trucho: el server rechaza y se ve el error', async ({ page }) => {
    await page.goto('/crear-acceso?token=trucho-123')
    await page.getByLabel('Contraseña nueva').fill('clave-segura-1')
    await page.getByLabel('Repetila').fill('clave-segura-1')
    await page.getByRole('button', { name: /crear acceso/i }).click()
    await expect(page.getByRole('alert')).toContainText(/venció|no es válido/)
  })

  test('valida localmente largo y coincidencia', async ({ page }, testInfo) => {
    await page.goto(`/crear-acceso?token=${tokenFor(testInfo)}`)
    await page.getByLabel('Contraseña nueva').fill('corta')
    await page.getByLabel('Repetila').fill('corta')
    await page.getByRole('button', { name: /crear acceso/i }).click()
    await expect(page.getByRole('alert')).toContainText('al menos 8')

    await page.getByLabel('Contraseña nueva').fill('clave-segura-1')
    await page.getByLabel('Repetila').fill('otra-distinta-2')
    await page.getByRole('button', { name: /crear acceso/i }).click()
    await expect(page.getByRole('alert')).toContainText('no coinciden')
  })

  test('con el token del email crea la contraseña y entra directo', async ({ page }, testInfo) => {
    await page.goto(`/crear-acceso?token=${tokenFor(testInfo)}`)
    await page.getByLabel('Contraseña nueva').fill('clave-segura-1')
    await page.getByLabel('Repetila').fill('clave-segura-1')
    await page.getByRole('button', { name: /crear acceso/i }).click()

    await expect(page).toHaveURL(/\/portal$/)
    await expect(page.getByRole('heading', { name: /Hola, Nuevo/ })).toBeVisible()
    // recién comprado un kit no: sin compras → todo bloqueado + upsell
    await expect(page.getByText('¿Querés acceso a toda la biblioteca?')).toBeVisible()
  })

  test('membresía vencida: todo con candado (regla de Pao)', async ({ page, isMobile }) => {
    test.skip(Boolean(isMobile), 'marta es compartida; un viewport alcanza')

    await page.goto('/ingresar')
    await page.getByLabel('Email').fill('marta@test.com')
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page).toHaveURL(/\/portal$/)

    // ninguna categoría desbloqueada (conteo robusto frente a categorías temporales de otros specs)
    await expect(page.locator('.portal-category:not(.portal-category--locked)')).toHaveCount(0)
    await expect(page.locator('.portal-category--locked').first()).toBeVisible()
    await expect(page.getByText('¿Querés acceso a toda la biblioteca?')).toBeVisible()
  })

  test('recuperar acceso responde neutro', async ({ page }) => {
    await page.goto('/ingresar')
    await page.getByLabel('Email').fill('no-existe@test.com')
    await page.getByRole('button', { name: 'Recuperar acceso' }).click()
    await expect(page.getByRole('status')).toContainText('Revisá tu correo')
  })
})
