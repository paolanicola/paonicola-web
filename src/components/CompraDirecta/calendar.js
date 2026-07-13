// Helpers puros del calendario de compra directa (Tienda Rediseño).
// Trabajan sobre la respuesta de GET /schedules:
//   [{ id, date: 'YYYY-MM-DD', available_hours: 'HH:MM' }, ...]

export const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

/** { 'YYYY-MM-DD': [{ id, hour }] } con horarios ordenados. */
export function groupByDate(schedules) {
  const grouped = schedules.reduce((acc, s) => {
    ;(acc[s.date] = acc[s.date] || []).push({ id: s.id, hour: s.available_hours })
    return acc
  }, {})
  Object.values(grouped).forEach((slots) =>
    slots.sort((a, b) => a.hour.localeCompare(b.hour))
  )
  return grouped
}

export const isoDate = (year, monthIdx, day) =>
  `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

/**
 * Celdas del mes: nulls de relleno (la semana arranca lunes) + números de día.
 */
export function monthCells(year, monthIdx) {
  const blanks = (new Date(year, monthIdx, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate()
  return [
    ...Array(blanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
}

/** [year, monthIdx] del primer día con turnos libres, o del mes actual. */
export function firstAvailableMonth(grouped, today = new Date()) {
  const dates = Object.keys(grouped).sort()
  if (!dates.length) return [today.getFullYear(), today.getMonth()]
  const [year, month] = dates[0].split('-').map(Number)
  return [year, month - 1]
}

/** 'Martes 14/07 · 15:00 hs' para el resumen del paso 2. */
export function slotLabel(dateStr, hour) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const weekday = new Date(year, month - 1, day).toLocaleDateString('es-AR', {
    weekday: 'long',
  })
  const capitalized = weekday[0].toUpperCase() + weekday.slice(1)
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  return `${capitalized} ${dd}/${mm} · ${hour} hs`
}
