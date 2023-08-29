import React from 'react'
import { ReactComponent as DiasSvg } from '../../assets/images/faq/01dias.svg'
import { ReactComponent as PagoSvg } from '../../assets/images/faq/02pago.svg'
import { ReactComponent as RProgramacionesSvg } from '../../assets/images/faq/03reprogramaciones.svg'
function SectionFooter() {
  return (
    <>
      <div className='section-container'>
        <div className='flex-column'>
          <div className='flex-row'>
            <DiasSvg className='section__image' />
            <div className='section__texts'>
              <h5>Días y horarios de atención</h5>
              <p>
                <strong>Solo con turno previo.</strong> Lunes a viernes.
              </p>
            </div>
          </div>
          <div className='flex-row'>
            <PagoSvg className='section__image' />
            <div className='section__texts'>
              <h5>Formas de pago</h5>
              <p>Servicios online: Mercado Pago / Transferencia Bancaria.</p>
            </div>
          </div>
          <div className='flex-row'>
            <RProgramacionesSvg className='section__image' />
            <div className='section__texts'>
              <h5>Cancelaciones y reprogramaciones</h5>
              <p>
                En caso de no poder asistir, te pido que canceles o reprogrames
                el turno con la mayor anticipación posible (más de 24 hs. de
                anticipación)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SectionFooter
