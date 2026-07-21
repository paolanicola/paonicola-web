import React, { useState } from 'react'
import Kicker from '../../components/ui/Kicker'
import PillButton from '../../components/ui/PillButton'
import { accordionData } from '../../utils/contentFAQ'
import { whatsAppLink } from '../../utils/utils'

const CONSULTA_WA = whatsAppLink(
  '¡Hola Pao! Tengo una duda que no está en las preguntas frecuentes.'
)

function FaqItem({ id, title, content }) {
  const [open, setOpen] = useState(false)
  const panelId = `faq-panel-${id}`
  const buttonId = `faq-button-${id}`
  return (
    <div className={`pn-faq__item${open ? ' pn-faq__item--open' : ''}`}>
      <h3 className='pn-faq__q'>
        <button
          type='button'
          id={buttonId}
          className='pn-faq__trigger'
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className='pn-faq__q-text'>{title}</span>
          <span className='pn-faq__icon' aria-hidden='true' />
        </button>
      </h3>
      {open && (
        <div
          id={panelId}
          role='region'
          aria-labelledby={buttonId}
          className='pn-faq__a'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  )
}

/** Preguntas frecuentes (Tienda Rediseño): acordeón accesible + CTA de cierre. */
export default function Faq() {
  return (
    <main className='pn-faq'>
      <header className='pn-faq__header'>
        <Kicker>Preguntas frecuentes</Kicker>
        <h1 className='pn-faq__title'>Antes de empezar, resolvamos tus dudas</h1>
        <p className='pn-faq__subtitle'>
          Lo que más me consultan sobre cómo trabajo y qué incluye el
          acompañamiento.
        </p>
      </header>

      <div className='pn-faq__list'>
        {accordionData.map(({ id, title, content }) => (
          <FaqItem key={id} id={id} title={title} content={content} />
        ))}
      </div>

      <section className='pn-faq__cta'>
        <span className='pn-faq__cta-title'>¿Te quedó una duda?</span>
        <p className='pn-faq__cta-text'>
          Escribime y lo vemos juntas, o mirá los servicios en la tienda.
        </p>
        <div className='pn-faq__cta-actions'>
          <PillButton href={CONSULTA_WA} variant='light'>
            Escribime por WhatsApp
          </PillButton>
          <PillButton to='/tienda' variant='outline'>
            Ver la tienda
          </PillButton>
        </div>
      </section>
    </main>
  )
}
