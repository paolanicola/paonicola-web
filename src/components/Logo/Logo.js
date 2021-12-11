import React from 'react';
import logo from '../../assets/images/header/paola_logo.png';

export default function Logo() {
  return (
    <div classnName='logo'>
      <img className='logo__img' src={logo} alt='logotipo' />
    </div>
  );
}
