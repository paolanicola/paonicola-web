import { React, useState } from 'react';
import logo from '../../assets/images/header/paola_logo.webp';

export default function Logo() {
  const [sizeChange, setSizeChange] = useState();
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setSizeChange(true);
    } else {
      setSizeChange(false);
    }
  };
  window.addEventListener('scroll', changeNavbarColor);
  return (
    <div classnName='logo'>
      <img className={sizeChange ? 'logo__img sizeChange' : 'logo__img'} src={logo} alt='logotipo' />
    </div>
  );
}
