import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PrimaryButton } from '..';

import { ReactComponent as InstagramBrand } from '../../assets/images/header/instagram-brands.svg';
import { ReactComponent as MailBrand } from '../../assets/images/header/mail.svg';
import { ReactComponent as NavClose } from '../../assets/images/header/nav-close.svg';
import { ReactComponent as WhatsappBrand } from '../../assets/images/header/whatsapp-brands.svg';


export default function NavBar() {
  const [sidebar, setSidebar] = useState(false);

  const closeSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className={sidebar ? 'navBar__menu navBar__menu--active' : 'navBar__menu'}>
        <div className='menu__left'>
          <div className='pepe '>
            <div className='container__icon__close' onClick={closeSidebar}>
              <NavClose className='icon__svg__close' />
            </div>
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
            <PrimaryButton actionText='/' hreff='hola' />
          </div>
        </div>
      </div>
    </>
  );
}
