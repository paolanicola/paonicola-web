// @ts-check
const { test, expect } = require('@playwright/test')

// E2E del panel de Paola (ActiveAdmin, en :3001) con round-trip al portal:
// lo que Paola carga en el admin lo ve el paciente al instante vía la API.
// Pacientes dedicados por proyecto (sofia/sol) para no pisar tokens de otros
// specs. Serial: los pasos comparten la categoría creada. Idempotente: el
// primer test limpia restos de corridas anteriores desde la propia UI.
test.describe.configure({ mode: 'serial' })

const ADMIN = 'http://localhost:3001'
const API = 'http://localhost:3001/api'

test.describe('Panel de administración', () => {
  /** @param {import('@playwright/test').TestInfo} testInfo */
  const patientFor = (testInfo) =>
    testInfo.project.name.includes('mobile') ? 'sol@test.com' : 'sofia@test.com'
  /** @param {import('@playwright/test').TestInfo} testInfo */
  const suffix = (testInfo) =>
    testInfo.project.name.includes('mobile') ? 'mobile' : 'desktop'
  const categoryName = (testInfo) => `Sueño E2E ${suffix(testInfo)}`
  const RESOURCE_TITLE = (testInfo) => `Higiene del sueño ${suffix(testInfo)}`

  async function adminLogin(page) {
    await page.goto(`${ADMIN}/admin/login`)
    await page.fill('#user_email', 'a@a.com')
    await page.fill('#user_password', 'admin1234')
    await page.click('input[type=submit]')
    await expect(page.locator('body.active_admin')).toBeVisible()
  }

  // Borra todas las filas del index `url` que contengan `rowText` (con confirm).
  async function deleteAllRows(page, url, rowText) {
    for (let i = 0; i < 5; i++) {
      await page.goto(url)
      const row = page.locator('tbody tr', { hasText: rowText }).first()
      if ((await row.count()) === 0) return
      page.once('dialog', (d) => d.accept())
      await row.getByRole('link', { name: /eliminar|delete/i }).click()
      await page.waitForLoadState('networkidle')
    }
  }

  test('login: rechaza credenciales inválidas y acepta las correctas', async ({ page }) => {
    await page.goto(`${ADMIN}/admin/login`)
    await page.fill('#user_email', 'a@a.com')
    await page.fill('#user_password', 'incorrecta')
    await page.click('input[type=submit]')
    await expect(page).toHaveURL(/\/admin\/login$/)

    await adminLogin(page)
    await expect(page).toHaveURL(/\/admin/)
  })

  test('crea una categoría de biblioteca y material adentro', async ({ page }, testInfo) => {
    await adminLogin(page)

    // idempotencia: limpiar restos de corridas anteriores
    await deleteAllRows(
      page,
      `${ADMIN}/admin/resources?q%5Btitle_cont%5D=${encodeURIComponent(RESOURCE_TITLE(testInfo))}`,
      RESOURCE_TITLE(testInfo)
    )
    await deleteAllRows(
      page,
      `${ADMIN}/admin/library_categories?q%5Bname_cont%5D=${encodeURIComponent(categoryName(testInfo))}`,
      categoryName(testInfo)
    )

    // categoría nueva
    await page.goto(`${ADMIN}/admin/library_categories/new`)
    await page.fill('#library_category_name', categoryName(testInfo))
    await page.fill('#library_category_icon', '😴')
    await page.fill('#library_category_position', '50')
    await page.getByRole('button', { name: /guardar/i }).click()
    await expect(page).toHaveURL(/\/admin\/library_categories\/\d+/)

    // material dentro de la categoría (sin accesos → solo acceso total lo ve)
    await page.goto(`${ADMIN}/admin/resources/new`)
    await page.fill('#resource_title', RESOURCE_TITLE(testInfo))
    await page.selectOption('#resource_library_category_id', {
      label: `😴 ${categoryName(testInfo)}`,
    })
    await page.selectOption('#resource_content_type', 'pdf')
    await page.fill('#resource_duration_label', 'PDF')
    await page.fill('#resource_file_url', '/descargables/compras-saludables.pdf')
    await page.getByRole('button', { name: /guardar/i }).click()
    await expect(page).toHaveURL(/\/admin\/resources\/\d+/)

    // aparece en el índice de Material con su categoría
    await page.goto(
      `${ADMIN}/admin/resources?q%5Btitle_cont%5D=${encodeURIComponent(RESOURCE_TITLE(testInfo))}`
    )
    const row = page.locator('tbody tr', { hasText: RESOURCE_TITLE(testInfo) })
    await expect(row).toHaveCount(1)
    await expect(row).toContainText(categoryName(testInfo))
  })

  test('el paciente con acceso total lo ve al instante en el portal', async ({ page }, testInfo) => {
    const login = await page.request.post(`${API}/portal/session`, {
      data: { email: patientFor(testInfo), password: 'password123' },
    })
    expect(login.ok()).toBe(true)
    const { token } = await login.json()
    const headers = { Authorization: `Bearer ${token}` }

    const library = await (
      await page.request.get(`${API}/portal/library`, { headers })
    ).json()
    const category = library.categories.find((c) => c.name === categoryName(testInfo))
    expect(category).toBeTruthy()
    expect(category.unlocked).toBe(true)
    expect(category.resource_count).toBe(1)

    const detail = await (
      await page.request.get(`${API}/portal/library/categories/${category.id}`, { headers })
    ).json()
    expect(detail.unlocked.map((r) => r.title)).toContain(RESOURCE_TITLE(testInfo))
    expect(detail.unlocked[0].type_label).toBe('Guía · PDF')
  })

  test('no deja borrar la categoría mientras tenga material', async ({ page }, testInfo) => {
    await adminLogin(page)
    await page.goto(
      `${ADMIN}/admin/library_categories?q%5Bname_cont%5D=${encodeURIComponent(categoryName(testInfo))}`
    )
    page.once('dialog', (d) => d.accept())
    await page
      .locator('tbody tr', { hasText: categoryName(testInfo) })
      .getByRole('link', { name: /eliminar|delete/i })
      .click()

    await expect(page.getByText('No se puede eliminar')).toBeVisible()
    // sigue existiendo
    await page.goto(
      `${ADMIN}/admin/library_categories?q%5Bname_cont%5D=${encodeURIComponent(categoryName(testInfo))}`
    )
    await expect(
      page.locator('tbody tr', { hasText: categoryName(testInfo) })
    ).toHaveCount(1)
  })

  test('borrar material y luego la categoría deja todo limpio', async ({ page }, testInfo) => {
    await adminLogin(page)

    await deleteAllRows(
      page,
      `${ADMIN}/admin/resources?q%5Btitle_cont%5D=${encodeURIComponent(RESOURCE_TITLE(testInfo))}`,
      RESOURCE_TITLE(testInfo)
    )
    await deleteAllRows(
      page,
      `${ADMIN}/admin/library_categories?q%5Bname_cont%5D=${encodeURIComponent(categoryName(testInfo))}`,
      categoryName(testInfo)
    )

    // y el paciente ya no la ve
    const login = await page.request.post(`${API}/portal/session`, {
      data: { email: patientFor(testInfo), password: 'password123' },
    })
    const { token } = await login.json()
    const library = await (
      await page.request.get(`${API}/portal/library`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json()
    expect(
      library.categories.find((c) => c.name === categoryName(testInfo))
    ).toBeUndefined()
  })
})
