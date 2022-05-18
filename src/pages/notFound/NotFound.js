import React, { useState, useEffect, useRef } from 'react';
import LogoWebp from '../../assets/images/header/paola_logo.webp';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ConsultasOnline from '../../assets/images/services-img/04consultas-online.svg';

function NotFound() {
  const [size, setSize] = useState(false);

  return (
    <>
      <div className={size ? 'navBarNf header--resizeNf' : 'navBarNf'}>
        <div className='menu__logo'>
          <NavLink to='home'>
            <img src={LogoWebp} className='menu__logo__svg' alt='logo' />
          </NavLink>
        </div>

        <div className={'navBar__menuNf'}> </div>
      </div>
      <div className='notfound-container'>
        <div className=' '>
          <img className='item-img-nf' src={ConsultasOnline} alt='not found' title='Error' />
          <h3>Parece que esta página no existe</h3>
        </div>
        <div className='notfound-link'>
          <Link to='/home'> Ir a la página principal</Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;
