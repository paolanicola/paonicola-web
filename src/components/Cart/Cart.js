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
        <div className='carrito-container carrito-container-empty'>
          <h4 className='title-empty'>Tu carrito esta vacio, agrega algún producto!</h4>
          <div className='container-empty-link'>
            <Link to='/tienda' className='link-empty'>
              Continúa Comprando
            </Link>
          </div>
        </div>
      ) : (
        <div className='carrito-container'>
          <div className='carrito-cards'>{renderProducts}</div>

          <div className='carrito-total'>
            <h5 class='carrito-total-titulo'>Carrito de compras</h5>

            <table class='carrito-total-cuenta' cellpadding='0' cellspacing='0'>
              <tr>
                <td className='carrito-total-td '>Producto</td> <td className=' carrito-total-td text-right'>SubTotal</td>
              </tr>
              <hr />
              {products.length > 0 ? (
                products.map((product) => (
                  <tr>
                    <td className='carrito-total-td'>
                      {product.name} x {product.cartQuantity}
                    </td>
                    <td className='carrito-total-td text-right '>
                      {product.currency}
                      {product.promo ? product.promoPrice : product.price}
                    </td>
                  </tr>
                ))
              ) : (
                <p>no hay nada</p>
              )}

              <tr>
                <td className='carrito-total-td'></td>
              </tr>
              <tr className='carrito-total-price-title'>
                <td className='carrito-total-price'>Total</td>
                <td className='carrito-total-price text-right'> ${cart.cartTotalAmount}</td>
              </tr>
            </table>

            <div class='next1'>
              <Link to='/checkout' className='  carrito-finalizar '>
                Finalizar compra
              </Link>
              <div className='carrito-container-continue'>
                <Link to='/tienda' className='carrito-continueBuy'>
                  Continuar Comprando
                </Link>
              </div>
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
