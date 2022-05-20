import React from 'react';
import { ReactComponent as PaolaSvg } from '../../assets/images/footer/paola-nicola.svg';
import { ReactComponent as MailSvg } from '../../assets/images/footer/mail-footer.svg';
import { ReactComponent as WhatsappSvg } from '../../assets/images/footer/whatsapp-footer.svg';
import { ReactComponent as InstagramSvg } from '../../assets/images/footer/instagram-footer.svg';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <div className='footer'>
        <div className='footer-container-top'>
          <div>
            <div className='footer-logo-container'>
              <PaolaSvg />
              <p>Nutrición</p>
            </div>
          </div>
          <div className='footer-container-menu'>
            <ul className='footer-container-menu-ul'>
              <li>
                <Link to='/home' className='footer__link'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/cambios-reales' className='footer__link'>
                  Cambios reales
                </Link>
              </li>
              <li>
                <Link to='/faq' className='footer__link'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to='/contacto' className='footer__link'>
                  Contacto
                </Link>
              </li>
              <li>
                <Link to='/tienda' className='footer__link'>
                  Solicitar turno
                </Link>
              </li>
              <li>
                <ul class='footer-menu-redes'>
                  <li>
                    <a className='footer__link' href='https://www.instagram.com/nutricion.paonicola/' target='_blank' rel='noopener noreferrer'>
                      <InstagramSvg />
                    </a>
                  </li>
                  <li>
                    <a className='footer__link' href='mailto:nutricionista.nicola@gmail.com' target='_blank' rel='noopener noreferrer'>
                      <MailSvg />
                    </a>
                  </li>
                  <li>
                    <a
                      className='footer__link'
                      href='https://api.whatsapp.com/send?phone=5492216248895&text=Hola%21%20Estoy%20buscando%20reservar%20un%20turno.&source=&data=&app_absent='
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <WhatsappSvg />
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className='footer-container-botton'>
          <div className='footer-container-botton-left'>
            <p className='rayo'>Diseño: </p>
            <a className='a' href='https://rayoestudio.com/' target='_blank' rel='noopener noreferrer'>
              Rayo
            </a>
          </div>
          <h3>|</h3>
          <div className='footer-container-botton-right'>
            <p className='felipe'>Desarrollo y maquetado: </p>

            <a className='a' href='https://www.linkedin.com/in/felipe-arana-37782071/' target='_blank' rel='noopener noreferrer'>
              Paola Nicola Team
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
