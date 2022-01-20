import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getAllProducts } from '../../features/products/productSlice';

import Product from '../Product/Product';
import { addToCart, decreaseCart, getAllProductsCart, getTotals, removeFromCart } from '../../features/cart/cartSlice';
import ProductCart from '../ProductCart/ProductCart';

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
  renderProducts = products.length > 0 ? products.map((product) => <ProductCart product={product} />) : <div>Error</div>;
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
