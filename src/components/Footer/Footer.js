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
            <ul>
              <li>
                <Link to='/' className='footer__link' href=''>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/changes' className='footer__link' href='/cambios-reales'>
                  Cambios reales
                </Link>
              </li>
              <li>
                <Link to='/Faq' className='footer__link' href='/faq'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to='/contact' className='footer__link' href='/contacto'>
                  Contacto
                </Link>
              </li>
              <li>
                <a className='footer__link'>Solicitar turno</a>
              </li>
              <li>
                <ul class='footer-menu-redes'>
                  <li>
                    <a className='footer__link' href='https://www.instagram.com/nutricion.paonicola/' target='_blank' class='instagram'>
                      <InstagramSvg />
                    </a>
                  </li>
                  <li>
                    <a className='footer__link' href='mailto:nutricionista.nicola@gmail.com' target='_blank' class='mail'>
                      <MailSvg />
                    </a>
                  </li>
                  <li>
                    <a
                      className='footer__link'
                      href='https://api.whatsapp.com/send?phone=5492216248895&text=Hola%21%20Estoy%20buscando%20reservar%20un%20turno.&source=&data=&app_absent='
                      target='_blank'
                      class='whatsapp'
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
          <div>
            <p className='rayo'>
              Diseño y maquetado:
              <a href='https://rayoestudio.com/' target='_blank' rel='noopener'></a>
            </p>
          </div>
          <div>
            <p className='felipe'>
              Desarrollo:
              <a href='https://www.linkedin.com/in/felipe-arana-37782071/' target='_blank' rel='noopener'>
                Felipe Arana
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
