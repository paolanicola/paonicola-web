import React, { useEffect } from 'react';
import ProductView from '../ProductView/ProductView';

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
          <div className='modal-header'>
            <p>soy el modal</p>
          </div>
          <div className='modal-body'>
            <label className='body-close' onClick={props.onClose}>
              X
            </label>
            <ProductView product={props.product} />
          </div>
          <div className='modal-footer'>
            <button onClick={props.onClose}>close</button>
          </div>
        </div>
      </div>
    </>
  );
}
