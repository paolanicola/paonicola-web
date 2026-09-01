import React from 'react'
import Kicker from '../../../components/ui/Kicker'
import ProductPrice from '../../Tienda/ui/ProductPrice'
import { formatNumber } from '../../../utils/utils'

// Dos opciones de pago (cuotas vs. pago único) cuando el producto tiene
// cuotas cargadas en el admin. Con promo activa no aplica: la promo ya es
// el precio destacado y las dos tarjetas contarían otra historia.
const getPaymentPlans = (product) => {
  const { installments_count: count, installment_price: per, price: total } = product
  const hasPromo = product.active_promo && product.promo_price != null
  if (!count || count < 2 || per == null || total == null || hasPromo) return null
  return { count, per, total, savings: count * per - total }
}

/** Tarjetas de pago lado a lado (desktop) / apiladas (mobile). Ambas abren
 *  el mismo flujo de compra directa; la de pago único va destacada. */
function PaymentPlans({ plans, cta, onBuy }) {
  return (
    <div className='producto__plans'>
      <div className='producto__plan'>
        <span className='producto__plan-label'>{plans.count} pagos de</span>
        <span className='producto__plan-amount'>${formatNumber(plans.per)}</span>
        <span className='producto__plan-note'>Precios en pesos argentinos (ARS)</span>
        <button
          type='button'
          className='producto__plan-cta producto__plan-cta--outline'
          data-testid='hero-buy-installments'
          onClick={onBuy}
        >
          {cta}
        </button>
      </div>
      <div className='producto__plan producto__plan--featured'>
        <span className='producto__plan-tag'>Recomendada</span>
        <span className='producto__plan-label'>Pago único de</span>
        <span className='producto__plan-amount'>${formatNumber(plans.total)}</span>
        {plans.savings > 0 && (
          <span className='producto__plan-savings'>
            Ahorrás ${formatNumber(plans.savings)}
          </span>
        )}
        <button
          type='button'
          className='producto__plan-cta'
          data-testid='hero-buy'
          onClick={onBuy}
        >
          {cta}
        </button>
      </div>
    </div>
  )
}

/**
 * Hero: kicker + headline (+ sub) + precio/badge + CTA de compra directa +
 * imagen (Tienda Rediseño; antes designs 12a/17a/21a).
 */
export function LandingHero({ landing, product, onBuy }) {
  const plans = getPaymentPlans(product)
  return (
    <section className='producto__hero'>
      <div className='producto__hero-copy'>
        <Kicker>{landing.kicker}</Kicker>
        <h1 className='producto__headline'>{landing.headline}</h1>
        {landing.tagline && <p className='producto__tagline'>{landing.tagline}</p>}
        {landing.subheadline && (
          <p className='producto__subheadline'>{landing.subheadline}</p>
        )}
        {landing.heroCta && (
          <>
            <div className='producto__hero-price'>
              {!plans && <ProductPrice product={product} size='lg' />}
              {product.important_note &&
                product.important_note.toLowerCase() !==
                  landing.heroBadge?.toLowerCase() && (
                  <span>{product.important_note}</span>
                )}
              {landing.heroBadge && (
                <span className='producto__hero-badge'>{landing.heroBadge}</span>
              )}
            </div>
            {plans ? (
              <>
                <PaymentPlans plans={plans} cta={landing.heroCta} onBuy={onBuy} />
                {landing.heroNote && (
                  <span className='producto__hero-note'>{landing.heroNote}</span>
                )}
              </>
            ) : (
              <div className='producto__hero-ctas'>
                <button
                  type='button'
                  className='producto__hero-cta'
                  data-testid='hero-buy'
                  onClick={onBuy}
                >
                  {landing.heroCta}
                </button>
                {landing.heroNote && (
                  <span className='producto__hero-note'>{landing.heroNote}</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <img
        className='producto__hero-img'
        src={product.thumbnail}
        alt={product.name}
      />
    </section>
  )
}

/** Intro/dolor paragraphs and the "—" signal rows. */
export function SignalsBlock({ landing }) {
  if (!landing.intro && !landing.signals) return null
  return (
    <section className='producto__signals'>
      {landing.intro?.map((p, i) => (
        <p key={i} className={`producto__p${p.strong ? ' producto__p--strong' : ''}`}>
          {p.text}
        </p>
      ))}
      {landing.signalsIntro && (
        <p className='producto__p producto__p--strong'>{landing.signalsIntro}</p>
      )}
      {landing.signals?.map((text, i) => (
        <div key={i} className='producto__signal'>
          <span className='producto__signal-mark' aria-hidden='true'>—</span>
          <span>{text}</span>
        </div>
      ))}
    </section>
  )
}

/** Navy full-width storytelling band. */
export function PhilosophyBand({ paragraphs }) {
  if (!paragraphs?.length) return null
  return (
    <section className='producto__philosophy'>
      <div className='producto__philosophy-inner'>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`producto__navy-p${p.lead ? ' producto__navy-p--lead' : ''}${p.accent ? ' producto__navy-p--accent' : ''}`}
          >
            {p.text}
          </p>
        ))}
      </div>
    </section>
  )
}

/** Paragraphs after the navy band (12a "objetivo"). */
export function AfterPhilosophy({ paragraphs }) {
  if (!paragraphs?.length) return null
  return (
    <section className='producto__signals'>
      {paragraphs.map((p, i) => (
        <p key={i} className={`producto__p${p.strong ? ' producto__p--strong' : ''}`}>
          {p.text}
        </p>
      ))}
    </section>
  )
}

/** ✓ checklist grid — cream cards, or white-on-navy when `navy`. */
export function ChecklistGrid({ checklist }) {
  if (!checklist) return null
  return (
    <section
      className={`producto__checklist${checklist.navy ? ' producto__checklist--navy' : ''}`}
    >
      <h2 className='producto__checklist-title'>{checklist.title}</h2>
      <div className='producto__checklist-grid'>
        {checklist.items.map((text, i) => (
          <div key={i} className='producto__check'>
            <span className='producto__check-mark' aria-hidden='true'>✓</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
      {checklist.footer && (
        <p className='producto__checklist-footer'>{checklist.footer}</p>
      )}
    </section>
  )
}

/** Emoji + text "incluye" rows. */
export function IncludesList({ includes }) {
  if (!includes) return null
  return (
    <section className='producto__includes'>
      <h2 className='producto__includes-title'>{includes.title}</h2>
      <div className='producto__includes-list'>
        {includes.items.map((item, i) => (
          <div key={i} className='producto__include'>
            <span aria-hidden='true'>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      {includes.footer && <p className='producto__p'>{includes.footer}</p>}
    </section>
  )
}
