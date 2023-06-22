/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { ReactComponent as Close } from '../../assets/images/header/nav-close.svg'
import ProductView from '../ProductView/ProductView'

export default function Modal(props) {
  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose()
    }
  }
  
  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDown)
    return function cleanup() {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  }, [closeOnEscapeKeyDown])

 

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
  )
}
