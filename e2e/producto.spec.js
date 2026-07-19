// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Producto landing pages (Tienda Rediseño)', () => {
  test('Método Regula: landing completa con FAQ, testimonios, cierre y sticky', async ({ page }) => {
    await page.goto('/tienda')
    await page
      .getByRole('link', { name: /Método Regula — programa 1 a 1/ })
      .first()
      .click()

    await expect(
      page.getByRole('heading', { name: /esfuerzo constante por comer mejor/ })
    ).toBeVisible()
    // hero con precio + CTA de compra directa
    await expect(page.getByTestId('hero-buy')).toHaveText('Empezar Método Regula')
    // navy storytelling band
    await expect(page.getByText('Por eso creé Método Regula.')).toBeVisible()
    // Qué incluye en tarjetas con detalle
    await expect(page.getByText('Plan de alimentación personalizado')).toBeVisible()
    await expect(page.getByText(/Armado sobre tu vida real/)).toBeVisible()
    // testimonios reales de Cambios Reales
    await expect(
      page.getByText('Lo que cuentan las que ya pasaron por el proceso')
    ).toBeVisible()
    // FAQ acordeón: abre y cierra
    await page.getByRole('button', { name: /¿Cómo son los encuentros\?/ }).click()
    await expect(page.getByText(/Videollamadas individuales/)).toBeVisible()
    await page.getByRole('button', { name: /¿Cómo son los encuentros\?/ }).click()
    await expect(page.getByText(/Videollamadas individuales/)).toHaveCount(0)
    // cierre navy + sticky bar
    await expect(
      page.getByText('12 semanas para dejar de empezar de nuevo cada lunes.')
    ).toBeVisible()
    await expect(page.getByTestId('producto-sticky')).toBeVisible()
  })

  test('Programa Grupal Regula: landing con checklist y link cruzado al 1:1', async ({ page }) => {
    await page.goto('/tienda')
    // la banda tiene dos links al mismo producto (la foto y el título)
    await page.getByRole('link', { name: 'Programa Grupal Regula' }).first().click()

    await expect(
      page.getByRole('heading', { name: /piloto automático/ })
    ).toBeVisible()
    await expect(page.getByText('Este programa es para vos si…')).toBeVisible()
    await expect(page.getByText('4 encuentros grupales en vivo')).toBeVisible()
    await expect(page.getByText('Conocé el Método Regula 1:1 →')).toBeVisible()
    await expect(
      page.getByText('Es todo lo que pasa alrededor de la comida.')
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
    // purchase block con compra directa
    await expect(
      page.getByTestId('purchase-block').getByRole('button', { name: 'Comprar' })
    ).toBeVisible()
  })

  test('un producto sin landing cae al detalle genérico', async ({ page }) => {
    // la Membresía no tiene landing propia → layout genérico con precio y CTA
    const res = await page.request.get('http://localhost:3001/api/products')
    const membresia = (await res.json()).find((p) =>
      p.name.startsWith('Acceso a la biblioteca')
    )
    await page.goto(`/producto/${membresia.id}`)

    await expect(
      page.getByRole('heading', { name: 'Acceso a la biblioteca de material' })
    ).toBeVisible()
    await expect(page.getByTestId('purchase-block')).toBeVisible()
    await expect(
      page.getByTestId('purchase-block').getByText(/49\.999/)
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Comprar' })).toBeVisible()
  })

  test('el hero del Método abre el modal con calendario', async ({ page }) => {
    const res = await page.request.get('http://localhost:3001/api/products')
    const metodo = (await res.json()).find((p) => p.requires_appointment)
    await page.goto(`/producto/${metodo.id}`)

    await page.getByTestId('hero-buy').click()
    const modal = page.getByTestId('compra-directa')
    await expect(modal.getByText('Elegí tu primer turno')).toBeVisible()
    await expect(modal.getByTestId('cd-day').first()).toBeVisible()
    // ESC cierra
    await page.keyboard.press('Escape')
    await expect(modal).toHaveCount(0)
  })
})
