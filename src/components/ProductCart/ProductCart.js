import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getAllProducts } from '../../features/products/productSlice';

import Product from '../Product/Product';
import { addToCart, decreaseCart, getAllProductsCart, getTotals, removeFromCart } from '../../features/cart/cartSlice';

function ProductCart({ product }) {
  const cart = useSelector((state) => state.cart);
  const products = useSelector(getAllProductsCart);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product));
  };
  const handleIncreaseCart = (product) => {
    dispatch(addToCart(product));
  };
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  return (
    <div className='carrito-card'>
      <div className='carrito-img'>
        <img className='img-source' src={product.displayThumbnail} alt='' />
      </div>
      <div className='carrito-content'>
        <div className='content-title'>
          <Link className='' to='/'>
            <p className='content-title__h6'>{product.name}</p>
          </Link>
          <button onClick={() => handleRemoveFromCart(product)} className='content-delete'>
            <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
          </button>
        </div>
        <div className='content-description'>
          <p className='content-descripcion-corta-carrito'>{product.description}</p>
        </div>

        <div class='content-botton-precio'>
          <div class='content-quantity-selector'>
            <button onClick={() => handleDecreaseCart(product)} class='btn-quantity '>
              <FontAwesomeIcon icon={faMinus} />
            </button>

            <input className='quantity' min='0' name='quantity' value={product.cartQuantity} type='number' />

            <button onClick={() => handleIncreaseCart(product)} className='btn-quantity '>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className='content-precio'>
            {product.promo ? (
              <p class='content-precio-text'>
                <span className=' card-product-price__tachado '>
                  {product.currency} {product.price}
                </span>
              </p>
            ) : (
              ''
            )}
            <p class=''>
              {product.currency} {product.promoPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCart;
