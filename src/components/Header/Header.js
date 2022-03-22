import React from 'react';
import { NavBar, Logo } from '..';
import { ReactComponent as ShoppingBag } from '../../assets/images/header/shopping-bag.svg';

import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className='header'>
      <div className='header__left'>
        <NavBar />
      </div>
      <div className='header__logo'>
        <Link to='#' className='header__logo'>
          <Logo className='header__logo__img' />
        </Link>
      </div>
      <div className='header__right'>
        <ShoppingBag className='header__icon' />
      </div>
    </div>
  );
}
