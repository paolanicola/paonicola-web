import React from 'react';
import { NavLink } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

export default function ProductView({ product }) {
  return (
    <>
      <div className='view-container'>
        <div className='card-product-img'>
          <div className='img-container'>
            <img className='img-source' src={product.displayThumbnail} alt='' />
          </div>
          <div className='sale-text bold'>-20%</div>
          <div className='label-text black'>{product.category}</div>
        </div>
        <div className='card-product-text'>
          <NavLink to={`/producto/${product.id}`}>
            <h4 className='card-product-text__name'>{product.name}</h4>
          </NavLink>
          <div className='card-product-text__price'>
            {product.promo ? (
              <h4 className=' card-product-price__tachado '>
                {product.currency} {product.price}
              </h4>
            ) : (
              ''
            )}
            <h4>
              {product.currency} {product.promo ? product.promoPrice : product.price}
            </h4>
          </div>
          <div> rating </div>
          <div>
            {' '}
            IMPORTANTE: Este producto tiene una vigencia de <b>50</b> días desde el día de su compra. La consulta es <b>online</b> .
          </div>
          <div> {product.description} </div>
          <div>anadir</div>
        </div>
      </div>
    </>
  );
}
