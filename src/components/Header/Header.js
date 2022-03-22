import React, { useState, useEffect } from 'react';
import { NavBar, Logo } from '..';
import { ReactComponent as ShoppingBag } from '../../assets/images/header/shopping-bag.svg';

import { Link } from 'react-router-dom';

export default function Header() {
  const [size, setSize] = useState(false);
  const changeNavbarSize = () => {
    if (window.scrollY >= 60) {
      setSize(true);
    } else {
      setSize(false);
    }
  };
  window.addEventListener('scroll', changeNavbarSize);

  return (
    <div className='header'>
      <div className='header__left'>
        <NavBar />
      </div>
      <div className='header__logo'>
        <Link to='/' className='header__logo'>
          <Logo className='header__logo__img' />
        </Link>
      </div>
      <div className='header__right'>
        <ShoppingBag className='header__icon' />
      </div>
    </div>
  );
}
