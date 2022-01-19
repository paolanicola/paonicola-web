import React, { useState, useEffect } from 'react';
import { NavBar, Logo, PrimaryButton } from '..';
import { ReactComponent as ShoppingBag } from '../../assets/images/header/shopping-bag.svg';
import { ReactComponent as InstagramBrand } from '../../assets/images/header/instagram-brands.svg';
import { ReactComponent as MailBrand } from '../../assets/images/header/mail.svg';
import { ReactComponent as WhatsappBrand } from '../../assets/images/header/whatsapp-brands.svg';
import { ReactComponent as NavOpen } from '../../assets/images/header/nav-open.svg';
import { ReactComponent as NavClose } from '../../assets/images/header/nav-close.svg';
import { ReactComponent as PaolaLogo } from '../../assets/images/header/logo.svg';
import LogoWebp from '../../assets/images/header/paola_logo.webp';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const [size, setSize] = useState(false);
  const navigate = useNavigate();

  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const changeNavbarSize = () => {
    if (window.scrollY >= 60) {
      setSize(true);
    } else {
      setSize(false);
    }
  };
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const closeSidebar = () => setSidebar(!sidebar);

  const handleMoveToCart = () => {
    navigate('/cart');
  };

  useEffect(() => {
    window.addEventListener('scroll', changeNavbarSize);
    return () => {
      window.removeEventListener('scroll', changeNavbarSize);
    };
  });

  return (
    <>
      <div className={size ? 'navBar header--resize' : 'navBar'}>
        <div className='navBar__icon__svg navBar__icon__svg--none fixed' onClick={showSidebar}>
          <NavOpen className='icon__svg__open' />
        </div>
        <div className='menu__logo'>
          <NavLink to='/'>
            <img src={LogoWebp} className='menu__logo__svg' alt='logo' />
          </NavLink>
        </div>

        <div className={sidebar ? 'navBar__menu navBar__menu--active' : 'navBar__menu'}>
          <div className='menu__left'>
            <div className='pepe ' onClick={closeSidebar}>
              <div className='container__icon__close'></div>
            </div>
            <NavLink className='menu__item menu__link' to='/about' onClick={closeSidebar}>
              <p>Sobre Mi</p>
            </NavLink>
            <NavLink className='menu__item menu__link' to='/changes' onClick={closeSidebar}>
              <p>Cambios Reales</p>
            </NavLink>
            <NavLink className='menu__item menu__link' to='/faq' onClick={closeSidebar}>
              <p>FAQ</p>
            </NavLink>
            <NavLink className='menu__item menu__link' to='/contact' onClick={closeSidebar}>
              <p>Contacto</p>
            </NavLink>
          </div>

          <div className='menu__right'>
            <div className='menu__item menu__link'>
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
            <div className='menu__item menu__link'>
              <PrimaryButton actionText='Tienda Online' href='/' />
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
