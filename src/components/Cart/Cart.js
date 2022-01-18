import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getAllProducts } from '../../features/products/productSlice';

import Product from '../Product/Product';
import { addToCart, decreaseCart, getAllProductsCart, getTotals, removeFromCart } from '../../features/cart/cartSlice';

function Cart() {
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

  let renderProducts = '';
  renderProducts =
    products.length > 0 ? (
      products.map((product) => (
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

            <div class='content-precio-botton'>
              <div class='input-group inline-group quantity-selector'>
                <button onClick={() => handleDecreaseCart(product)} class='btn-quantity btn-minus'>
                  <FontAwesomeIcon icon={faMinus} />
                </button>

                <input className='quantity' min='0' name='quantity' value={product.cartQuantity} type='number' />

                <button onClick={() => handleIncreaseCart(product)} class='btn-quantity btn-plus'>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <div className='content-precio'>
                <p class=''>
                  {product.promo ? (
                    <span className=' card-product-price__tachado '>
                      {product.currency} {product.price}
                    </span>
                  ) : (
                    ''
                  )}{' '}
                  {product.currency} {product.promoPrice}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div>Error</div>
    );
  return (
    <div className='carrito-container1'>
      {cart.cartItems.length === 0 ? (
        <h4>Tu carrito está vacío</h4>
      ) : (
        <div className='carrito-container'>
          <div className='carrito-cards'>{renderProducts}</div>

          <div className='carrito-total'>
            <h5 class='carrito-total-titulo'>Total del carrito</h5>

            <table class='cuenta'>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr>
                    <td>{product.name}</td>
                    <td class='black text-right'>
                      {product.promo ? (
                        <span className=' card-product-price__tachado '>
                          {product.currency} {product.price}
                        </span>
                      ) : (
                        ''
                      )}
                      {product.currency}
                      {product.promoPrice}
                    </td>
                  </tr>
                ))
              ) : (
                <p>no hay nada</p>
              )}
              <tr>
                <td>Recetario 1</td>
                <td class='black text-right'>$2050</td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr class='td-total'>
                <td class='black'>Total</td>
                <td class='black text-right'>{cart.cartTotalAmount}</td>
              </tr>
            </table>

            <div class='next text-center'>
              <Link to='checkout' className='btn btn-primary btn-md carrito-finalizar '>
                Finalizar compra
              </Link>
              <div class='wizard-footer' style={{ display: 'none' }}>
                <button type='button' class=' wizard-prev btn btn-primary-outlined btn-irv-default'>
                  Atrás
                </button>
                <button type='button' class=' wizard-next btn btn-primary'>
                  Siguiente
                </button>
                <Link to='/confirm' className='btn btn-primary btn-md wizard-subm'>
                  Pagar y finalizar
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
