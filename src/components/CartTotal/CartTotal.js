import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllProductsCart } from '../../features/cart/cartSlice';
import { nextStep, backStep } from '../../features/stepsCheckout/stepsSlice';

function CartTotal() {
  const cart = useSelector((state) => state.cart);
  const products = useSelector(getAllProductsCart);
  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.step);

  const handleNextStep = () => {
    dispatch(nextStep());
  };

  const handleBackStep = () => {
    dispatch(backStep());
  };

  return (
    <div className='carrito-total-container'>
      <h5 class='carrito-total-titulo'>Total del carrito</h5>

      <table class='carrito-total-items' cellpadding='0' cellspacing='0'>
        {products.length > 0 ? (
          products.map((product) => (
            <tr className='carrito-total-item'>
              <td className='carrito-total-item-name'>{product.name}</td>
              <td className='carrito-total-item-price text-right'>
                {product.currency}
                {product.promoPrice}
              </td>
            </tr>
          ))
        ) : (
          <p>no hay nada</p>
        )}

        <tr>
          <td className='carrito-total-ch-td'></td>
        </tr>
        <tr className='carrito-resume'>
          <td className='carrito-resume-title'>Total</td>
          <td className='carrito-resume-price text-right'> ${cart.cartTotalAmount}</td>
        </tr>
      </table>

      <div class='carrito-total-buttons back'>
        <button
          onClick={() => handleBackStep()}
          type='button'
          className={step === 0 ? 'carrito-finalizar__oculto' : 'carrito-finalizar carrito-finalizar-next'}
        >
          Atrás
        </button>
        <button
          onClick={() => handleNextStep()}
          type='button'
          className={step === 2 ? 'carrito-finalizar__oculto' : 'carrito-finalizar carrito-finalizar-next'}
        >
          Siguiente
        </button>
        <Link to='/confirm' className={step !== 2 ? 'carrito-finalizar__oculto' : 'carrito-finalizar carrito-finalizar-next'}>
          Pagar y finalizar
        </Link>
      </div>
    </div>
  );
}

export default CartTotal;
