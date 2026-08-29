// @ts-check
const { test, expect } = require('@playwright/test')

// Flujo de compra directa (Tienda Rediseño, sin carrito). El POST /orders y el
// retorno de Mercado Pago se mockean a nivel de red: probamos todo el flujo
// nuestro (modal → datos → orden → página Gracias) sin depender de MP.
test.describe('Compra directa', () => {
  const fillBuyer = async (modal) => {
    await modal.getByTestId('cd-name').fill('Agustín')
    await modal.getByTestId('cd-lastname').fill('Míguez')
    await modal.getByTestId('cd-email').fill('agustin@test.com')
    await modal.getByTestId('cd-phone').fill('11 5555 5555')
  }

  const mockOrderApi = async (page, orderId, orderBody) => {
    await page.route('**/api/orders', (route) =>
      route.request().method() === 'POST'
        ? route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              order_id: orderId,
              status: 'pending',
              // "volvemos de MP" directo a la confirmación
              mercadopago_init_point: `/checkout/confirm/${orderId}`,
            }),
          })
        : route.fallback()
    )
    await page.route(`**/api/orders/${orderId}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(orderBody),
      })
    )
  }

  test('kit: modal → datos → orden → Gracias sin turno', async ({ page }) => {
    await mockOrderApi(page, 'E2E-CD-KIT', {
      order_id: 'E2E-CD-KIT',
      status: 'done',
      payment_type: 'mercadopago',
      total_price: 27990,
      created_at: '2026-07-13T12:00:00Z',
      appointment_date: null,
      patient: { email: 'agustin@test.com' },
    })

    await page.goto('/tienda')
    await page
      .getByTestId('tienda-card')
      .filter({ hasText: '7 días' })
      .getByRole('button', { name: 'Agregar' })
      .click()

    const modal = page.getByTestId('compra-directa')
    // sin calendario: directo al paso de pago
    await expect(modal.getByText('Compra directa · sin carrito')).toBeVisible()
    await fillBuyer(modal)
    await expect(modal.getByTestId('cd-pay')).toBeEnabled()

    const [request] = await Promise.all([
      page.waitForRequest(
        (req) => req.url().includes('/api/orders') && req.method() === 'POST'
      ),
      modal.getByTestId('cd-pay').click(),
    ])
    const payload = request.postDataJSON()
    expect(payload.order.product_ids_and_quantities).toHaveLength(1)
    expect(payload.order.appointment_id).toBeNull()
    expect(payload.order.patient_info.email).toBe('agustin@test.com')

    // página Gracias (donde vuelve MP)
    await expect(page.getByTestId('gracias')).toBeVisible()
    await expect(page.getByText('¡Listo! Ya es tuyo.')).toBeVisible()
    await expect(page.getByText(/E2E-CD-KIT/)).toBeVisible()
    await expect(page.getByText('Qué sigue')).toBeVisible()
    await expect(page.getByText(/acceso al material se habilita/)).toBeVisible()
    await expect(page.getByRole('link', { name: 'Volver a la tienda' })).toBeVisible()
  })

  test('método 1:1: calendario real → resumen → orden con turno → Gracias', async ({ page }) => {
    await mockOrderApi(page, 'E2E-CD-METODO', {
      order_id: 'E2E-CD-METODO',
      status: 'done',
      payment_type: 'mercadopago',
      total_price: 499000,
      created_at: '2026-07-13T12:00:00Z',
      appointment_date: '2026-07-15T10:00:00Z',
      patient: { email: 'agustin@test.com' },
    })

    await page.goto('/tienda')
    await page
      .getByTestId('tienda-card')
      .filter({ hasText: 'Método Regula' })
      .getByRole('button', { name: 'Agregar' })
      .click()

    const modal = page.getByTestId('compra-directa')
    // paso 1: elegir día y horario reales (seeds de horarios libres)
    await modal.getByTestId('cd-day').first().click()
    await modal.getByTestId('cd-time').first().click()
    await modal.getByTestId('cd-continue').click()

    // paso 2: resumen con el turno elegido y opción de cambiar
    await expect(modal.getByText(/Primer encuentro:/)).toBeVisible()
    await expect(modal.getByRole('button', { name: 'Cambiar' })).toBeVisible()
    await fillBuyer(modal)

    const [request] = await Promise.all([
      page.waitForRequest(
        (req) => req.url().includes('/api/orders') && req.method() === 'POST'
      ),
      modal.getByTestId('cd-pay').click(),
    ])
    expect(request.postDataJSON().order.appointment_id).not.toBeNull()

    // Gracias con el turno agendado
    await expect(page.getByText('¡Listo! Tu lugar está reservado.')).toBeVisible()
    await expect(page.getByText(/primer encuentro quedó agendado/)).toBeVisible()
    await expect(page.getByText(/biblioteca de material del portal/)).toBeVisible()
  })

  test('membresía: compra directa sin calendario desde su página', async ({ page }) => {
    const res = await page.request.get('http://localhost:3001/api/products')
    const membresia = (await res.json()).find((p) =>
      p.name.startsWith('Acceso a la biblioteca')
    )
    await page.goto(`/producto/${membresia.id}`)
    await page.getByRole('button', { name: 'Comprar' }).click()

    const modal = page.getByTestId('compra-directa')
    await expect(modal.getByText('Compra directa · sin carrito')).toBeVisible()
    await expect(modal.getByText(/49\.999/)).toBeVisible()
    await expect(modal.getByText(/Paso \d de 2/)).toHaveCount(0)
  })
})
