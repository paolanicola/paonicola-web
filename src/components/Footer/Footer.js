import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as InstagramSvg } from '../../assets/images/footer/instagram-footer.svg'
import { ReactComponent as MailSvg } from '../../assets/images/footer/mail-footer.svg'
import { ReactComponent as PaolaSvg } from '../../assets/images/footer/paola-nicola.svg'
import { ReactComponent as WhatsappSvg } from '../../assets/images/footer/whatsapp-footer.svg'
import { whatsAppUrl, whatsAppLink } from '../../utils/utils'

const SITE_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Por qué acompaño así', to: '/#por-que-acompano' },
  { label: 'Testimonios', to: '/#testimonios' },
  { label: 'FAQ', to: '/faq' },
]

const FOR_YOU_LINKS = [
  { label: 'Tienda online', to: '/tienda' },
  { label: 'Portal de pacientes', to: '/ingresar' },
  { label: 'Contacto', to: '/contacto' },
]

// Footer del rediseño ("Footer Rediseño.dc.html"): marca + redes, dos
// columnas de links (Sitio / Para vos) y card CTA "¿Empezamos?".
export default function Footer() {
  return (
    <footer className='pn-footer'>
      <div className='pn-footer__grid'>
        <div className='pn-footer__brand'>
          <div className='pn-footer__logo'>
            <PaolaSvg />
            <span className='pn-footer__logo-sub'>Nutrición</span>
          </div>
          <p className='pn-footer__tagline'>
            Acompañamiento nutricional con foco en hábitos sostenibles, sin
            dietas extremas.
          </p>
          <div className='pn-footer__socials'>
            <a
              href='https://www.instagram.com/nutricion.paonicola/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <InstagramSvg />
            </a>
            <a href='mailto:nutricionista.nicola@gmail.com' aria-label='Escribir correo'>
              <MailSvg />
            </a>
            <a
              href={whatsAppUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='WhatsApp'
            >
              <WhatsappSvg />
            </a>
          </div>
        </div>

        <nav className='pn-footer__group' aria-label='Sitio'>
          <span className='pn-footer__group-title'>Sitio</span>
          {SITE_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className='pn-footer__link'>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className='pn-footer__group' aria-label='Para vos'>
          <span className='pn-footer__group-title'>Para vos</span>
          {FOR_YOU_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className='pn-footer__link'>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='pn-footer__cta'>
          <span className='pn-footer__cta-title'>¿Empezamos?</span>
          <p className='pn-footer__cta-text'>
            Reservá tu primera consulta o{' '}
            <a
              href={whatsAppLink(
                '¡Hola Pao! Quiero empezar una consulta, ¿me contás cómo arrancamos?'
              )}
              target='_blank'
              rel='noopener noreferrer'
            >
              escribime por WhatsApp
            </a>
          </p>
          <Link to='/tienda' className='pn-footer__cta-btn'>
            Reservar consulta
          </Link>
        </div>
      </div>

      <div className='pn-footer__bottom'>
        <span>© {new Date().getFullYear()} Paola Nicola · Nutrición</span>
      </div>
    </footer>
  )
}
