import React from 'react';
import { NavLink } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';

import { addToCart, getTotals } from '../../features/cart/cartSlice';
import { ToastContainer, toast } from 'react-toastify';

import { ReactComponent as InstagramBrand } from '../../assets/images/header/instagram-brands.svg';
import { ReactComponent as MailBrand } from '../../assets/images/header/mail.svg';
import { ReactComponent as WhatsappBrand } from '../../assets/images/header/whatsapp-brands.svg';

export default function ProductView({ product }) {
  const dispatch = useDispatch();
  const handleAddToCartView = () => {
    dispatch(addToCart(product));
    toast('Producto agregado al Carrito!');
    //navigate('/cart');
  };

  return (
    <>
      <div className='view-container'>
        <div className='view-product'>
          <div className='view-img-container'>
            <img className='view-img-source' src={product.displayThumbnail} alt='' />
          </div>
        </div>
        <div className='view-detail-container'>
          <h4 className='view-detail-title'>{product.name}</h4>
          <div className='view-category'>{product.category}</div>
          <div className='view-detail-price'>
            {product.promo ? (
              <h4 className='price-off card-product-price__tachado '>
                {product.currency} {product.price}
              </h4>
            ) : (
              ''
            )}
            <h4 className='price'>
              {product.currency} {product.promo ? product.promoPrice : product.price}
            </h4>
          </div>
          <div className=' view-detail-raiting'> </div>
          <div className='view-detail-important'>
            IMPORTANTE: Este producto tiene una vigencia de <b>50</b> días desde el día de su compra. La consulta es <b>online</b> .
          </div>
          <div className='view-detail-description'> {product.description} </div>

          <div className='view-detail-button' onClick={handleAddToCartView}>
            <PrimaryButton href='/tienda' actionText='Añadir al carrito' />
          </div>
        </div>
      </div>
    </>
  );
}
