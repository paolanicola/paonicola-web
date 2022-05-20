import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getAllProducts } from '../../features/products/productSlice';

import Product from '../Product/Product';
import { addToCart, decreaseCart, getAllProductsCart, getTotals, removeFromCart } from '../../features/cart/cartSlice';
import ProductCart from '../ProductCart/ProductCart';
import { resetStep } from '../../features/stepsCheckout/stepsSlice';
import { updateFecha, updateHora, resetCartState } from '../../features/cartState/cartStateSlice';

function Cart() {
  const cart = useSelector((state) => state.cart);
  const products = useSelector(getAllProductsCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(window.screen.width <= 767);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  useEffect(() => {
    const changeNavbarSizeFs = () => {
      if (window.screen.width <= 767) {
        setMobile(true);
      }
    };
    window.addEventListener('resize', changeNavbarSizeFs);
    return () => window.removeEventListener('resize', changeNavbarSizeFs);
  }, []);
  useEffect(() => {
    const changeNavbarSizeFss = () => {
      if (window.screen.width > 767) {
        setMobile(false);
      }
    };
    window.addEventListener('resize', changeNavbarSizeFss);
    return () => window.removeEventListener('resize', changeNavbarSizeFss);
  }, []);

  useEffect(() => {
    const changeNavbarSizeFsss = () => {
      if (document.body.scrollHeight === window.scrollY + window.innerHeight) {
        console.log('llegue al final');
        setEnd(true);
      }
    };

    window.addEventListener('scroll', changeNavbarSizeFsss);
    return () => window.removeEventListener('scroll', changeNavbarSizeFsss);
  }, []);
  useEffect(() => {
    const changeNavbarSizeFssss = () => {
      if (document.body.scrollHeight > window.scrollY + window.innerHeight) {
        console.log('no es el final');
        setEnd(false);
      }
    };

    window.addEventListener('scroll', changeNavbarSizeFssss);
    return () => window.removeEventListener('scroll', changeNavbarSizeFssss);
  }, []);

  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product));
  };
  const handleIncreaseCart = (product) => {
    dispatch(addToCart(product));
  };
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };
  const handleContinueBuy = (event) => {
    event.preventDefault();
    dispatch(resetStep());
    dispatch(resetCartState());
    navigate('/tienda');
  };

  let renderProducts = '';
  renderProducts = products.length > 0 ? products.map((product) => <ProductCart product={product} />) : <div>Error</div>;
  return (
    <div className='carrito-container1'>
      {cart.cartItems.length === 0 ? (
        <div className='carrito-container carrito-container-empty'>
          <h4 className='title-empty'>Tu carrito esta vacio, agrega algún producto!</h4>
          <div className='container-empty-link'>
            <Link onClick={handleContinueBuy} to='#' className='link-empty'>
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

            <div class={mobile && end ? 'next1 mobile' : 'next1'}>
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
