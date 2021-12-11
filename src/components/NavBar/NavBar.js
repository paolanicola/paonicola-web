import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as GoIcons from 'react-icons/go';
import { PrimaryButton } from '..';
export default function NavBar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const closeSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className='nav-bar '>
        <div className='nav-bar__icon-open' onClick={showSidebar}>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu__items'>
          <li className='nav-menu__icon-close' onClick={closeSidebar}>
            <Link to='#' className='menu-bars'>
              <AiIcons.AiOutlineClose className='nav-menu__icon' />
            </Link>
          </li>
          <li className='menu__item'>
            <a href='#' className='menu__link'>
              Sobre mi
            </a>
          </li>
          <li className='menu__item'>
            <a href='#' className='menu__link'>
              Cambios Reales
            </a>
          </li>
          <li className='menu__item'>
            <a href='#' className='menu__link'>
              FAQ
            </a>
          </li>
          <li className='menu__item'>
            <a href='#' className='menu__link'>
              Contacto
            </a>
          </li>
          <li className='menu__item'>
            <div href='#' className='menu__link'>
              <div className='menu__redes'>
                <Link to='#' className='menu__redes__link'>
                  <FaIcons.FaInstagram className='menu__redes__icono ' />
                </Link>
                <Link to='#' className='menu__redes__link'>
                  <GoIcons.GoMail className='menu__redes__icono' />
                </Link>
                <Link to='#' className='menu__redes__link'>
                  <FaIcons.FaWhatsapp className='menu__redes__icono' />
                </Link>
              </div>
            </div>
          </li>
          <li className='menu__item'>
            <div href='#' className='menu__link'>
              <PrimaryButton actionText='Tienda Online' />
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
