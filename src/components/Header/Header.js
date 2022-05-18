import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Logo, PrimaryButton } from '..';
import { ReactComponent as ShoppingBag } from '../../assets/images/header/shopping-bag.svg';
import { ReactComponent as InstagramBrand } from '../../assets/images/header/instagram-brands.svg';
import { ReactComponent as MailBrand } from '../../assets/images/header/mail.svg';
import { ReactComponent as WhatsappBrand } from '../../assets/images/header/whatsapp-brands.svg';
import { ReactComponent as NavOpen } from '../../assets/images/header/nav-open.svg';
import navOpen from '../../assets/images/header/nav-open.svg';

import { ReactComponent as NavClose } from '../../assets/images/header/nav-close.svg';
import navClose from '../../assets/images/header/nav-close.svg';
import { ReactComponent as PaolaLogo } from '../../assets/images/header/logo.svg';
import LogoWebp from '../../assets/images/header/paola_logo.webp';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();

  const { cartTotalQuantity } = useSelector((state) => state.cart);

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const closeSidebar = () => setSidebar(!sidebar);

  const handleMoveToCart = () => {
    if (sidebar) {
      closeSidebar();
    }
    navigate('/carrito');
  };
  const [size, setSize] = useState(false);

  useEffect(() => {
    const changeNavbarSize = () => {
      if (window.scrollY >= 60) {
        setSize(true);
      }
    };
    // clean up code
    window.removeEventListener('scroll', changeNavbarSize);
    window.addEventListener('scroll', changeNavbarSize);
    return () => window.removeEventListener('scroll', changeNavbarSize);
  }, []);

  useEffect(() => {
    const changeNavbarSizeF = () => {
      if (window.scrollY < 59) {
        setSize(false);
      }
    };
    window.addEventListener('scroll', changeNavbarSizeF);
    return () => window.removeEventListener('scroll', changeNavbarSizeF);
  }, []);

  const wrapperRef = useRef(null);
  const wrapperRefIcon = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, [wrapperRef]);
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      if (wrapperRefIcon.current.className == 'navBar__icon__svg navBar__icon__svg--none fixed' && !wrapperRefIcon.current.contains(event.target)) {
        //setIsVisible(false);
        setSidebar(false);
      } else {
        setSidebar(true);
      }
    }
  };

  return (
    <>
      <div className={size ? 'navBar header--resize' : 'navBar'}>
        <div ref={wrapperRefIcon} className='navBar__icon__svg navBar__icon__svg--none fixed' onClick={showSidebar}>
          <img className='img-icono-close-open' src={navOpen} />
        </div>
        <div className='menu__logo'>
          <NavLink to='home'>
            <img src={LogoWebp} className='menu__logo__svg' alt='logo' />
          </NavLink>
        </div>

        <div ref={wrapperRef} className={sidebar ? 'navBar__menu navBar__menu--active' : 'navBar__menu'}>
          <div className='menu__left'>
            <div className='pepe' onClick={closeSidebar}>
              <div className='container__icon__close'>
                <img className='img-icono-close-open' src={navClose} />
              </div>
            </div>
            <NavLink className='menu__item menu__link' to='/sobre-mi' onClick={closeSidebar}>
              <p className='underlined'>Sobre Mi</p>
            </NavLink>
            <NavLink className='menu__item menu__link ' to='/cambios-reales' onClick={closeSidebar}>
              <p className=' underlined'>Cambios Realess</p>
            </NavLink>
            <NavLink className='menu__item menu__link' to='/faq' onClick={closeSidebar}>
              <p className=' underlined'>FAQ</p>
            </NavLink>
            <NavLink className='menu__item menu__link' to='/contacto' onClick={closeSidebar}>
              <p className=' underlined '>Contacto</p>
            </NavLink>
          </div>

          <div className='menu__right'>
            <div className='menu__item menu__link' onClick={closeSidebar}>
              <PrimaryButton actionText='Tienda Online' href='tienda' />
            </div>
            <div className='menu__item menu__link left-redes'>
              <div className='menu__redes '>
                <Link to='#' className='menu__redes__link'>
                  <InstagramBrand className='menu__redes__icono' />
                </Link>
                <Link to='#' className='menu__redes__link'>
                  <MailBrand className='menu__redes__icono' />
                </Link>
                <Link to='#' className='menu__redes__link'>
                  <WhatsappBrand className='menu__redes__icono' />
                </Link>
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
  );
}
