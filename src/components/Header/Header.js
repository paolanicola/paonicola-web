import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ReactComponent as InstagramBrand } from '../../assets/images/header/instagram-brands.svg'
import { ReactComponent as MailBrand } from '../../assets/images/header/mail.svg'
import { ReactComponent as ShoppingBag } from '../../assets/images/header/shopping-bag.svg'
import { ReactComponent as WhatsappBrand } from '../../assets/images/header/whatsapp-brands.svg'
import PillButton from '../ui/PillButton'
import { whatsAppUrl } from '../../utils/utils'
import { getPatient, isLoggedIn } from '../../features/portal/portalSlice'

// Nav del rediseño (pedido de Pao 2026-07-13): "Sobre Mí" → ancla a
// "Por qué acompaño así" del inicio; Testimonios → ancla del inicio;
// fuera FAQ y Cambios Reales (las páginas siguen accesibles por el footer).
const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Por qué acompaño así', to: '/#por-que-acompano', anchor: true },
  { label: 'Testimonios', to: '/#testimonios', anchor: true },
  { label: 'Contacto', to: '/contacto' },
]

// Header global (design 6a/11a): wordmark con matrícula, nav, sesión,
// Tienda Online en pill navy y carrito con contador. Mobile: hamburguesa + drawer.
export default function Header() {
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()
  const { cartTotalQuantity } = useSelector((state) => state.cart)
  const patientLogged = useSelector(isLoggedIn)
  const patient = useSelector(getPatient)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeDrawer = () => setDrawerOpen(false)

  const handleCart = () => {
    closeDrawer()
    navigate('/carrito')
  }

  // activo: anclas → en el inicio con ese hash; Inicio → inicio sin hash;
  // páginas → prefijo de ruta
  const isLinkActive = (link) => {
    if (link.anchor) return pathname === '/' && hash === link.to.slice(1)
    if (link.to === '/') return pathname === '/' && hash === ''
    return pathname.startsWith(link.to)
  }

  const sessionLink = (
    <Link
      className='pn-header__session'
      to={patientLogged ? '/portal' : '/ingresar'}
      onClick={closeDrawer}
    >
      {patientLogged ? `Hola, ${patient?.name}` : 'Iniciar sesión'}
    </Link>
  )

  const socials = (
    <div className='pn-header__socials'>
      <a href='https://www.instagram.com/nutricion.paonicola/' target='_blank' rel='noopener noreferrer' aria-label='Instagram'>
        <InstagramBrand />
      </a>
      <a href='mailto:nutricionista.nicola@gmail.com' aria-label='Escribir correo'>
        <MailBrand />
      </a>
      <a href={whatsAppUrl} target='_blank' rel='noopener noreferrer' aria-label='WhatsApp'>
        <WhatsappBrand />
      </a>
    </div>
  )

  return (
    <header className={`pn-header${scrolled ? ' pn-header--scrolled' : ''}`}>
      <button
        type='button'
        className='pn-header__menu-btn'
        aria-label={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <Link to='/' className='pn-header__brand' onClick={closeDrawer}>
        <span className='pn-header__kicker'>NUTRICIONISTA · MP 14.044</span>
        <span className='pn-header__name'>Paola Nicola</span>
      </Link>

      <nav className='pn-header__nav' aria-label='principal'>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`pn-header__link${isLinkActive(link) ? ' pn-header__link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className='pn-header__actions'>
        {sessionLink}
        <PillButton to='/tienda' variant='solid' small className='pn-header__store'>
          Tienda Online
        </PillButton>
        {socials}
        <button type='button' className='pn-header__cart' aria-label='Carrito' onClick={handleCart}>
          <span className='nro-carrito'>{cartTotalQuantity}</span>
          <ShoppingBag />
        </button>
      </div>

      {drawerOpen && (
        <div className='pn-header__overlay' onClick={closeDrawer} aria-hidden='true' />
      )}
      <div className={`pn-header__drawer${drawerOpen ? ' pn-header__drawer--open' : ''}`}>
        <nav className='pn-header__drawer-nav' aria-label='menú móvil'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className='pn-header__drawer-link'
              onClick={closeDrawer}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className='pn-header__drawer-foot'>
          {sessionLink}
          <PillButton to='/tienda' variant='solid' small onClick={closeDrawer}>
            Tienda Online
          </PillButton>
          {socials}
        </div>
      </div>
    </header>
  )
}
