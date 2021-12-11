import React from 'react';
import { ReactComponent as DiasSvg } from '../../assets/images/faq/01dias.svg';
import { ReactComponent as PagoSvg } from '../../assets/images/faq/02pago.svg';
import { ReactComponent as RProgramacionesSvg } from '../../assets/images/faq/03reprogramaciones.svg';
function SectionFooter() {
  return (
    <>
      <div className='section-container'>
        <div className='flex-column'>
          <div className='flex-row'>
            <DiasSvg className='section__image' />
            <div class='section__texts'>
              <h5>Días y horarios de atención</h5>
              <p>
                <strong>Solo con turno previo.</strong> Lunes, martes, miércoles y viernes de 17 a 20 hs. Sábados de 10 a 14 hs.
              </p>
            </div>
          </div>
          <div className='flex-row'>
            <PagoSvg className='section__image' />
            <div class='section__texts'>
              <h5>Formas de pago</h5>
              <p>En consultorio: Eefectivo, Mercado Pago (código QR), o con tarjetas de crédito/débito. Servicios online: Mercado Pago.</p>
            </div>
          </div>
          <div className='flex-row'>
            <RProgramacionesSvg className='section__image' />
            <div class='section__texts'>
              <h5>Cancelaciones y reprogramaciones</h5>
              <p>En caso de no poder asistir, te pido que canceles o reprogrames el turno con la mayor anticipación posible (más de 24 hs. de anticipación)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SectionFooter;
