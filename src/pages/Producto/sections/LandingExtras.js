import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Kicker from '../../../components/ui/Kicker'
import ProductPrice from '../../Tienda/ui/ProductPrice'

/** "Qué incluye" como grilla de tarjetas título + detalle (Tienda Rediseño). */
export function IncludesCards({ includesCards }) {
  if (!includesCards) return null
  return (
    <section className='producto__inc-cards'>
      <h2 className='producto__section-title'>{includesCards.title}</h2>
      <div className='producto__inc-grid'>
        {includesCards.items.map((item, i) => (
          <div key={i} className='producto__inc-card'>
            <div className='producto__inc-card-head'>
              <span className='producto__check-mark' aria-hidden='true'>✓</span>
              <span className='producto__inc-card-title'>{item.title}</span>
            </div>
            <span className='producto__inc-card-detail'>{item.detail}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Tira de testimonios (los reales de Cambios Reales). */
export function TestimonialsStrip({ testimonials }) {
  if (!testimonials) return null
  return (
    <section className='producto__testimonials'>
      <Kicker>{testimonials.kicker}</Kicker>
      <h2 className='producto__section-title'>{testimonials.title}</h2>
      <div className='producto__testimonials-grid'>
        {testimonials.items.map((t, i) => (
          <figure key={i} className='producto__testimonial'>
            <span className='producto__testimonial-quote' aria-hidden='true'>“</span>
            <blockquote>{t.quote}</blockquote>
            <figcaption>{t.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/** FAQ con acordeón accesible. */
export function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState(-1)
  if (!faqs?.length) return null
  return (
    <section className='producto__faqs'>
      <h2 className='producto__section-title'>Preguntas frecuentes</h2>
      <div className='producto__faqs-list'>
        {faqs.map((faq, i) => (
          <div key={i} className='producto__faq'>
            <button
              type='button'
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <span>{faq.q}</span>
              <span className='producto__faq-mark' aria-hidden='true'>
                {open === i ? '−' : '+'}
              </span>
            </button>
            {open === i && <p>{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

/** Cierre navy de compra: badge + frase + precio + CTA. */
export function ClosingBand({ closing, product, onBuy }) {
  if (!closing) return null
  return (
    <section className='producto__closing'>
      {closing.badge && (
        <span className='producto__closing-badge'>{closing.badge}</span>
      )}
      <p className='producto__closing-title'>{closing.title}</p>
      <div className='producto__closing-price'>
        <ProductPrice product={product} size='lg' />
        {product.important_note &&
          product.important_note.toLowerCase() !==
            closing.badge?.toLowerCase() && (
            <span>{product.important_note}</span>
          )}
      </div>
      <button type='button' className='producto__closing-cta' onClick={onBuy}>
        {closing.cta}
      </button>
      {closing.note && <span className='producto__closing-note'>{closing.note}</span>}
    </section>
  )
}

/** Barra sticky inferior con nombre + precio + CTA (diseño, prop sticky). */
export function StickyBar({ product, cta, onBuy, hidden }) {
  if (hidden) return null
  return (
    <div className='producto__sticky' data-testid='producto-sticky'>
      <div className='producto__sticky-info'>
        <span className='producto__sticky-name'>{product.name}</span>
        <ProductPrice product={product} size='sm' />
        {product.important_note && (
          <span className='producto__sticky-note'>{product.important_note}</span>
        )}
      </div>
      <button type='button' className='producto__sticky-cta' onClick={onBuy}>
        {cta}
      </button>
    </div>
  )
}

/** Link cruzado del grupal al 1:1. */
export function CrossLink({ crossLink }) {
  if (!crossLink) return null
  return (
    <p className='producto__crosslink'>
      {crossLink.text}{' '}
      <Link to='/tienda'>{crossLink.cta}</Link>
    </p>
  )
}
