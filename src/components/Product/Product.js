import React, { useEffect } from 'react';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { ReactComponent as AddToCart } from '../../assets/images/tienda/add-to-cart.svg';
import { ReactComponent as View } from '../../assets/images/tienda/view.svg';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { addToCart, getTotals } from '../../features/cart/cartSlice';

function Product({ product }) {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    //navigate('/cart');
  };

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  return (
    <>
      <div className='card-product-container'>
        <div className='card-product-img'>
          <div className='img-container'>
            <img className='img-source' src={product.displayThumbnail} alt='' />
          </div>
          <div className='sale-text bold'>-20%</div>
          <div className='label-text black'>{product.category}</div>
          <div className='card-product-overlay'>
            <div className='botonn1'>
              <PrimaryButton size='md' href='/' actionText='Vista rapida' />
            </div>
            <div onClick={() => handleAddToCart(product)} className='botonn'>
              <PrimaryButton href='/tienda' actionText='Añadir al carrito' />
            </div>
          </div>
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
        </div>
        <div className='botones-mobile'>
          <Link to='' className='botones-mobile-view' title='Vista rápida'>
            {/* <View /> */}
            Ver
          </Link>
          <button onClick={() => handleAddToCart(product)} className='botones-mobile-addToCart' title='Añadir al carrito'>
            {/* <AddToCart /> */}
            Añadir al Carrito
          </button>
        </div>
      </div>
    </>
  );
}

export default Product;
