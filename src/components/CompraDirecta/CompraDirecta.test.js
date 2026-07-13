import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import CompraDirecta from './CompraDirecta'
import { groupByDate, monthCells, firstAvailableMonth, slotLabel } from './calendar'

jest.mock('axios')

const SCHEDULES = [
  { id: 71, date: '2026-08-04', available_hours: '15:00' },
  { id: 70, date: '2026-08-04', available_hours: '10:00' },
  { id: 72, date: '2026-08-06', available_hours: '18:00' },
]

const METODO = {
  id: 1,
  name: 'Método Regula',
  price: 499000,
  active_promo: false,
  promo_price: null,
  category: 'Programa online',
  requires_appointment: true,
}

const KIT = {
  id: 9,
  name: 'Kit Regula — protocolo de 7 días',
  price: 27990,
  active_promo: false,
  promo_price: null,
  category: 'Kits',
  requires_appointment: false,
}

function renderModal(product, onClose = jest.fn()) {
  render(
    <MemoryRouter>
      <CompraDirecta product={product} onClose={onClose} />
    </MemoryRouter>
  )
  return onClose
}

const fillForm = () => {
  fireEvent.change(screen.getByTestId('cd-name'), { target: { value: 'Agustín' } })
  fireEvent.change(screen.getByTestId('cd-lastname'), { target: { value: 'Míguez' } })
  fireEvent.change(screen.getByTestId('cd-email'), {
    target: { value: 'agus@test.com' },
  })
  fireEvent.change(screen.getByTestId('cd-phone'), {
    target: { value: '11 5555 5555' },
  })
}

describe('calendar helpers', () => {
  it('groups schedules by date with sorted hours', () => {
    const grouped = groupByDate(SCHEDULES)
    expect(grouped['2026-08-04'].map((s) => s.hour)).toEqual(['10:00', '15:00'])
    expect(grouped['2026-08-06']).toHaveLength(1)
  })

  it('builds month cells starting on Monday', () => {
    // Agosto 2026 arranca sábado → 5 celdas vacías + 31 días
    const cells = monthCells(2026, 7)
    expect(cells.slice(0, 5)).toEqual([null, null, null, null, null])
    expect(cells).toHaveLength(36)
  })

  it('finds the first month with availability', () => {
    expect(firstAvailableMonth(groupByDate(SCHEDULES))).toEqual([2026, 7])
  })

  it('labels the selected slot in Spanish', () => {
    expect(slotLabel('2026-08-04', '15:00')).toBe('Martes 04/08 · 15:00 hs')
  })
})

describe('CompraDirecta', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: SCHEDULES })
    axios.post.mockResolvedValue({
      data: { order_id: 'ORD-1', mercadopago_init_point: 'https://mp.test/init' },
    })
  })

  it('kit: va directo al paso de pago y postea la orden sin turno', async () => {
    renderModal(KIT)
    expect(screen.getByText('Compra directa · sin carrito')).toBeInTheDocument()
    expect(screen.queryByText(/Paso \d de 2/)).not.toBeInTheDocument()

    fillForm()
    fireEvent.click(screen.getByTestId('cd-pay'))

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1))
    const payload = axios.post.mock.calls[0][1]
    expect(payload.order.product_ids_and_quantities).toEqual([[9, 1]])
    expect(payload.order.appointment_id).toBeNull()
    expect(payload.order.payment_type).toBe('mercadopago')
    expect(payload.order.patient_info.email).toBe('agus@test.com')
  })

  it('método 1:1: calendario → horario → resumen → pago con turno elegido', async () => {
    renderModal(METODO)
    expect(screen.getByText('Elegí tu primer turno')).toBeInTheDocument()

    // días disponibles del mock
    const days = await screen.findAllByTestId('cd-day')
    expect(days).toHaveLength(2)
    fireEvent.click(days[0]) // 04/08

    const times = screen.getAllByTestId('cd-time')
    expect(times.map((t) => t.textContent)).toEqual(['10:00', '15:00'])
    fireEvent.click(times[1]) // 15:00 → schedule 71

    fireEvent.click(screen.getByTestId('cd-continue'))
    expect(screen.getByText(/Martes 04\/08 · 15:00 hs/)).toBeInTheDocument()

    fillForm()
    fireEvent.click(screen.getByTestId('cd-pay'))

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1))
    expect(axios.post.mock.calls[0][1].order.appointment_id).toBe(71)
  })

  it('deshabilita el pago hasta completar datos válidos', () => {
    renderModal(KIT)
    expect(screen.getByTestId('cd-pay')).toBeDisabled()
    fillForm()
    fireEvent.change(screen.getByTestId('cd-email'), { target: { value: 'no-email' } })
    expect(screen.getByTestId('cd-pay')).toBeDisabled()
  })

  it('cierra con el botón Cancelar', () => {
    const onClose = renderModal(KIT)
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onClose).toHaveBeenCalled()
  })
})
