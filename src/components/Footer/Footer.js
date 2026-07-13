import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as InstagramSvg } from '../../assets/images/footer/instagram-footer.svg'
import { ReactComponent as MailSvg } from '../../assets/images/footer/mail-footer.svg'
import { ReactComponent as PaolaSvg } from '../../assets/images/footer/paola-nicola.svg'
import { ReactComponent as WhatsappSvg } from '../../assets/images/footer/whatsapp-footer.svg'
import { whatsAppUrl } from '../../utils/utils'

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
                <Link to='/' className='footer__link'>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to='/#por-que-acompano' className='footer__link'>
                  Por qué acompaño así
                </Link>
              </li>
              <li>
                <Link to='/#testimonios' className='footer__link'>
                  Testimonios
                </Link>
              </li>
              <li>
                <Link to='/tienda' className='footer__link'>
                  Tienda online
                </Link>
              </li>
              <li>
                <Link to='/ingresar' className='footer__link'>
                  Portal de pacientes
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
                <ul className='footer-menu-redes'>
                  <li>
                    <a
                      className='footer__link'
                      href='https://www.instagram.com/nutricion.paonicola/'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <InstagramSvg />
                    </a>
                  </li>
                  <li>
                    <a
                      className='footer__link'
                      href='mailto:nutricionista.nicola@gmail.com'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <MailSvg />
                    </a>
                  </li>
                  <li>
                    <a
                      className='footer__link'
                      href={whatsAppUrl}
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

      </div>
    </>
  )
}
