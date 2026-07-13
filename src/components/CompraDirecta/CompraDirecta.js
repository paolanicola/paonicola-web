import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  MONTH_LABELS,
  WEEKDAY_LABELS,
  groupByDate,
  isoDate,
  monthCells,
  firstAvailableMonth,
  slotLabel,
} from './calendar'

const API = process.env.REACT_APP_API_BASE_URL

// mismos criterios que el checkout clásico (acentos incluidos)
const NAME_RE = /^[a-záéíóúüñ ,.'-]+$/i
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

const EMPTY_FORM = { name: '', lastname: '', email: '', phone: '' }

/**
 * Modal de compra directa (Tienda Rediseño): sin carrito.
 * Paso 1 (solo productos con primer turno): calendario + horario.
 * Paso 2: resumen + datos del comprador + Pagar con Mercado Pago.
 */
export default function CompraDirecta({ product, onClose }) {
  const navigate = useNavigate()
  const needsCalendar =
    Boolean(product?.requires_appointment) || product?.category === 'Consultas Online'

  const [schedules, setSchedules] = useState([])
  const [step, setStep] = useState(needsCalendar ? 1 : 2)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null) // { id, hour }
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [month, setMonth] = useState(null) // [year, monthIdx]

  const grouped = useMemo(() => groupByDate(schedules), [schedules])

  useEffect(() => {
    if (!needsCalendar) return undefined
    let alive = true
    axios
      .get(`${API}/schedules`)
      .then(({ data }) => {
        if (!alive) return
        setSchedules(data)
        setMonth(firstAvailableMonth(groupByDate(data)))
      })
      .catch(() => toast.error('No pudimos cargar los horarios. Probá de nuevo.'))
    return () => {
      alive = false
    }
  }, [needsCalendar])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null

  const price = product.active_promo && product.promo_price != null
    ? product.promo_price
    : product.price
  const priceLabel = `$ ${Number(price).toLocaleString('es-AR')}`

  const setField = (field) => (e) => {
    // capturar antes del updater: React 17 recicla el SyntheticEvent
    const { value } = e.target
    setForm((f) => ({ ...f, [field]: value }))
  }

  const formValid =
    NAME_RE.test(form.name.trim()) &&
    NAME_RE.test(form.lastname.trim()) &&
    EMAIL_RE.test(form.email.trim()) &&
    form.phone.trim().length >= 6

  const handlePay = async () => {
    if (!formValid || submitting) return
    setSubmitting(true)
    try {
      const { data } = await axios.post(`${API}/orders`, {
        order: {
          payment_type: 'mercadopago',
          appointment_id: needsCalendar ? selectedSlot.id : null,
          product_ids_and_quantities: [[product.id, 1]],
          patient_info: {
            email: form.email.trim(),
            name: form.name.trim(),
            lastname: form.lastname.trim(),
            phone: form.phone.trim(),
          },
        },
      })
      if (Number(price) === 0) {
        navigate(`/checkout/confirm/${data.order_id}`)
      } else if (data.mercadopago_init_point) {
        window.location.href = data.mercadopago_init_point
      } else {
        throw new Error('No se recibió el link de pago de Mercado Pago')
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || 'No pudimos crear la orden'
      )
      setSubmitting(false)
    }
  }

  const renderCalendar = () => {
    if (!month) return <p className='cd__hint'>Cargando horarios…</p>
    const [year, monthIdx] = month
    const cells = monthCells(year, monthIdx)
    const daySlots = selectedDate ? grouped[selectedDate] || [] : []

    return (
      <>
        <p className='cd__hint'>
          Elegí fecha y hora de tu primer encuentro. Los siguientes se coordinan
          con Paola durante el programa.
        </p>
        <div className='cd__calendar'>
          <div className='cd__month'>
            <div className='cd__month-head'>
              <button
                type='button'
                aria-label='Mes anterior'
                onClick={() => setMonth([monthIdx === 0 ? year - 1 : year, (monthIdx + 11) % 12])}
              >
                ‹
              </button>
              <span>{MONTH_LABELS[monthIdx]} {year}</span>
              <button
                type='button'
                aria-label='Mes siguiente'
                onClick={() => setMonth([monthIdx === 11 ? year + 1 : year, (monthIdx + 1) % 12])}
              >
                ›
              </button>
            </div>
            <div className='cd__weekdays' aria-hidden='true'>
              {WEEKDAY_LABELS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className='cd__days'>
              {cells.map((day, i) => {
                if (day === null) return <span key={`b${i}`} />
                const date = isoDate(year, monthIdx, day)
                const available = Boolean(grouped[date]?.length)
                const selected = selectedDate === date
                return (
                  <button
                    key={date}
                    type='button'
                    disabled={!available}
                    data-testid={available ? 'cd-day' : undefined}
                    className={`cd__day${available ? ' cd__day--free' : ''}${selected ? ' cd__day--selected' : ''}`}
                    onClick={() => {
                      setSelectedDate(date)
                      setSelectedSlot(null)
                    }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
          <div className='cd__times'>
            <span className='cd__times-title'>Horario</span>
            {daySlots.map((slot) => (
              <button
                key={slot.id}
                type='button'
                data-testid='cd-time'
                className={`cd__time${selectedSlot?.id === slot.id ? ' cd__time--selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot.hour}
              </button>
            ))}
            {!selectedDate && <span className='cd__hint'>Elegí un día disponible</span>}
          </div>
        </div>
        <button
          type='button'
          data-testid='cd-continue'
          className='cd__next'
          disabled={!selectedSlot}
          onClick={() => setStep(2)}
        >
          {selectedSlot ? 'Continuar al pago' : 'Elegí fecha y horario'}
        </button>
      </>
    )
  }

  const renderResumen = () => (
    <>
      <div className='cd__summary'>
        <div className='cd__summary-row'>
          <span>{product.name}</span>
          <strong>{priceLabel}</strong>
        </div>
        {needsCalendar && selectedSlot && (
          <div className='cd__summary-row'>
            <span>
              Primer encuentro:{' '}
              <strong>{slotLabel(selectedDate, selectedSlot.hour)}</strong>
            </span>
            <button type='button' className='cd__change' onClick={() => setStep(1)}>
              Cambiar
            </button>
          </div>
        )}
        <span className='cd__hint'>
          {needsCalendar
            ? 'Si necesitás reprogramar, se coordina por WhatsApp sin costo.'
            : 'El acceso se habilita apenas se acredita el pago.'}
        </span>
      </div>

      <div className='cd__form'>
        <div className='cd__form-grid'>
          <input
            data-testid='cd-name'
            placeholder='Nombre'
            aria-label='Nombre'
            value={form.name}
            onChange={setField('name')}
          />
          <input
            data-testid='cd-lastname'
            placeholder='Apellido'
            aria-label='Apellido'
            value={form.lastname}
            onChange={setField('lastname')}
          />
        </div>
        <input
          data-testid='cd-email'
          type='email'
          placeholder='Email'
          aria-label='Email'
          value={form.email}
          onChange={setField('email')}
        />
        <input
          data-testid='cd-phone'
          type='tel'
          placeholder='WhatsApp (ej: 11 5555 5555)'
          aria-label='WhatsApp'
          value={form.phone}
          onChange={setField('phone')}
        />
      </div>

      <button
        type='button'
        data-testid='cd-pay'
        className='cd__pay'
        disabled={!formValid || submitting}
        onClick={handlePay}
      >
        {submitting ? 'Creando tu orden…' : 'Pagar con Mercado Pago'}
      </button>
    </>
  )

  return (
    <div className='cd' data-testid='compra-directa' onClick={onClose}>
      <div
        className='cd__card'
        role='dialog'
        aria-modal='true'
        aria-label={`Comprar ${product.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='cd__head'>
          <span className='cd__step-label'>
            {step === 1 ? 'Elegí tu primer turno' : 'Compra directa · sin carrito'}
          </span>
          {needsCalendar && <span className='cd__step-count'>Paso {step} de 2</span>}
        </div>
        <h3 className='cd__title'>{product.name}</h3>
        {step === 1 ? renderCalendar() : renderResumen()}
        <button type='button' className='cd__cancel' onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  )
}
