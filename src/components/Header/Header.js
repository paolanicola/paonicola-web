/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from 'react'
import { PrimaryButton } from '..'
import { ReactComponent as InstagramBrand } from '../../assets/images/header/instagram-brands.svg'
import { ReactComponent as MailBrand } from '../../assets/images/header/mail.svg'
import { ReactComponent as ShoppingBag } from '../../assets/images/header/shopping-bag.svg'
import { ReactComponent as WhatsappBrand } from '../../assets/images/header/whatsapp-brands.svg'

import navClose from '../../assets/images/header/nav-close.svg'
import navOpen from '../../assets/images/header/nav-open.svg'
import LogoWebp from '../../assets/images/header/paola_logo.webp'

import { useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  const { cartTotalQuantity } = useSelector((state) => state.cart)

  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => setSidebar(!sidebar)

  const closeSidebar = () => setSidebar(!sidebar)

  const handleMoveToCart = () => {
    if (sidebar) {
      closeSidebar()
    }
    navigate('/carrito')
  }
  const [size, setSize] = useState(false)

  useEffect(() => {
    const changeNavbarSize = () => {
      if (window.scrollY >= 60) {
        setSize(true)
      }
    }
    // clean up code
    window.removeEventListener('scroll', changeNavbarSize)
    window.addEventListener('scroll', changeNavbarSize)
    return () => window.removeEventListener('scroll', changeNavbarSize)
  }, [])

  useEffect(() => {
    const changeNavbarSizeF = () => {
      if (window.scrollY < 59) {
        setSize(false)
      }
    }
    window.addEventListener('scroll', changeNavbarSizeF)
    return () => window.removeEventListener('scroll', changeNavbarSizeF)
  }, [])

  const wrapperRef = useRef(null)
  const wrapperRefIcon = useRef(null)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [wrapperRef])
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      if (
        wrapperRefIcon.current.className ==
          'navBar__icon__svg navBar__icon__svg--none fixed' &&
        !wrapperRefIcon.current.contains(event.target)
      ) {
        //setIsVisible(false);
        setSidebar(false)
      } else {
        setSidebar(true)
      }
    }
  }

  return (
    <>
      <div className={size ? 'navBar header--resize' : 'navBar'}>
        <div
          ref={wrapperRefIcon}
          className='navBar__icon__svg navBar__icon__svg--none fixed'
          onClick={showSidebar}
        >
          <img className='img-icono-close-open' src={navOpen} alt='' />
        </div>

        <div className='menu__logo'>
          <Link to='/home'>
            <img src={LogoWebp} className='menu__logo__svg' alt='logo' />
          </Link>
        </div>

        <div
          ref={wrapperRef}
          className={
            sidebar ? 'navBar__menu navBar__menu--active' : 'navBar__menu'
          }
        >
          <div className='menu__left'>
            <div className='pepe' onClick={closeSidebar}>
              <div className='container__icon__close'>
                <img className='img-icono-close-open' src={navClose} alt='' />
              </div>
            </div>
            <NavLink
              className='menu__item menu__link'
              to='/sobre-mi'
              onClick={closeSidebar}
            >
              <p className='underlined'>Sobre Mi</p>
            </NavLink>
            <NavLink
              className='menu__item menu__link '
              to='/cambios-reales'
              onClick={closeSidebar}
            >
              <p className=' underlined'>Cambios Reales</p>
            </NavLink>
            <NavLink
              className='menu__item menu__link'
              to='/faq'
              onClick={closeSidebar}
            >
              <p className=' underlined'>FAQ</p>
            </NavLink>
            <NavLink
              className='menu__item menu__link'
              to='/contacto'
              onClick={closeSidebar}
            >
              <p className=' underlined '>Contacto</p>
            </NavLink>
          </div>

          <div className='menu__right'>
            <div className='menu__item menu__link' onClick={closeSidebar}>
              <PrimaryButton actionText='Tienda Online' href='/tienda' />
            </div>
            <div className='menu__item menu__link left-redes'>
              <div className='menu__redes '>
                <a
                  className='menu__redes__link'
                  href='https://www.instagram.com/nutricion.paonicola/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <InstagramBrand className='menu__redes__icono' />
                </a>
                <a
                  className='menu__redes__link'
                  href='mailto:nutricionista.nicola@gmail.com'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <MailBrand className='menu__redes__icono' />
                </a>
                <a
                  className='menu__redes__link'
                  href='https://api.whatsapp.com/send?phone=5492216248895&text=Hola%21%20Estoy%20buscando%20reservar%20un%20turno.&source=&data=&app_absent='
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <WhatsappBrand className='menu__redes__icono' />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div onClick={() => handleMoveToCart()} className='navBar__icon__svg'>
          <div className='nro-carrito'>{cartTotalQuantity}</div>
          <ShoppingBag className='' />
        </div>
      </div>
    </>
  )
}
