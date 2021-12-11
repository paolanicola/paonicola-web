import React from 'react';
import { NavBar, Logo } from '..';
import { ReactComponent as ShoppinBag } from '../../assets/images/header/shopping-bag.svg';

import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className='header'>
      <div classNAme='header__left'>
        <NavBar />
      </div>
      <div className='header__logo'>
        <Link to='#' className='header__logo'>
          <Logo className='header__logo__img' />
        </Link>
      </div>
      <div className='header__right'>
        <ShoppinBag className='header__icon' />
      </div>
    </div>
  );
}
