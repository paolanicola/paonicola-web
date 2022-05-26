import React, { useEffect } from 'react';
import ProductView from '../ProductView/ProductView';
import { ReactComponent as Close } from '../../assets/images/header/nav-close.svg';

export default function Modal(props) {
  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
    };
  }, []);

  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  return (
    <>
      <div className={`modal-container ${props.show ? 'show' : ''}`} onClick={props.onClose}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <div className='modal-body'>
            <div className='body-container-close'>
              <label className='body-close' onClick={props.onClose}>
                <Close className='a' />
              </label>
            </div>
            <ProductView product={props.product} />
          </div>
        </div>
      </div>
    </>
  );
}
