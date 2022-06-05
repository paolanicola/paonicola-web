import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllProductsCart } from '../../features/cart/cartSlice';
import { nextStep, backStep } from '../../features/stepsCheckout/stepsSlice';
import { getHora, getVerificado, updateformulario, updateVerificado } from '../../features/cartState/cartStateSlice';
import axios from 'axios';

function CartTotal() {
  const cart = useSelector((state) => state.cart);
  const products = useSelector(getAllProductsCart);
  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.step);

  const handleNextStep = () => {
    dispatch(nextStep());
  };

  const handleBackStep = () => {
    if (step === 2) {
      console.log('volviendo del pago');
      dispatch(updateVerificado(false));
    }
    if (step === 1) {
      dispatch(updateformulario(null));
    }
    dispatch(backStep());
  };

  const a = useSelector(getHora);
  const verificado = useSelector(getVerificado);
  let render = '';
  console.log(verificado);
  if (verificado || step === 0) {
    render = (
      <button onClick={() => handleNextStep()} type='submit' className={step === 2 ? 'carrito-finalizar__oculto' : 'carrito-finalizar  '}>
        Siguiente
      </button>
    );
  } else {
    render = (
      <button form='formularioTurno' type='submit' className='carrito-finalizar'>
        Siguente
      </button>
    );
  }
  useEffect(() => {
    console.log('useEffect');
  }, [a]);

  const [mobile, setMobile] = useState(window.screen.width <= 677);
  const [end, setEnd] = useState(false);
  const [isPending, setIsPending] = useState(false);

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
      if (window.screen.width > 677) {
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
        //console.log('no es el final');
        setEnd(false);
      }
    };

    window.addEventListener('scroll', changeNavbarSizeFssss);
    return () => window.removeEventListener('scroll', changeNavbarSizeFssss);
  }, []);
  //Post bakend cart
  const axios = require('axios').default;
  const [mercado, setMercado] = useState('');
  const [linkPago, setLinkPago] = useState('');

  let r = '';
  useEffect(() => {
    console.log(linkPago);
    setMercado(<a href={linkPago}>Pagar con Mercado Pago</a>);

    return () => {};
  }, [linkPago]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('enviar formulario');
    const headers = {
      'Content-Type': 'application/json',
    };
    const method = { 'method ': 'get' };
    const body = {
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone',
      },
    };
    const url = 'http://localhost:5000/payment';
    try {
      //const respuesta = await axios.get(url, { headers });
      const respuesta = await axios.post(
        url,
        {
          firstName: 'Fred',
          lastName: 'Flintstone',
          cart: cart,
        },
        { headers }
      );

      console.log(respuesta);
      console.log(respuesta.data.id);
      console.log(respuesta.data.init_point);

      const preferenceId = respuesta.data.id;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.mercadopago.cl/integrations/v1/web-payment-checkout.js';
      script.setAttribute('data-preference-id', preferenceId);
      const form = document.getElementById('mp');
      setLinkPago(respuesta.data.init_point);
      form.appendChild(script);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };
  return (
    <div className='carrito-total-container'>
      <h5 class='carrito-total-titulo'>Total del carrito</h5>

      <table class='carrito-total-items' cellpadding='0' cellspacing='0'>
        {products.length > 0 ? (
          products.map((product) => (
            <tr className='carrito-total-item'>
              <td className='carrito-total-item-name'>
                {product.name} x {product.cartQuantity}
              </td>
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

      <div class={mobile && end ? 'carrito-total-buttons back mobile' : 'carrito-total-buttons back'}>
        <button
          onClick={() => handleBackStep()}
          type='button'
          className={step === 0 ? 'carrito-finalizar__oculto' : 'carrito-finalizar carrito-finalizar-next'}
        >
          Atrás
        </button>
        {a !== null ? (
          render
        ) : (
          <button onClick={() => handleNextStep()} type='button' className={step === 2 ? 'carrito-finalizar__oculto' : 'disabled carrito-finalizar  '} disabled>
            Siguiente
          </button>
        )}

        <form onSubmit={handleSubmit}>
          <button>pagar</button>
        </form>
        <a href='https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1133741060-6a001319-3c8c-420e-8eb3-d945776dd962'> pagar mp local</a>
        {mercado == '' ? '' : mercado}

        <form id='mp'></form>
        {!isPending && (
          <Link to='/checkout/confirm' className={step !== 2 ? 'carrito-finalizar__oculto' : 'carrito-finalizar carrito-finalizar-next'}>
            Pagar y finalizar
          </Link>
        )}
        {isPending && (
          <Link to='#' className={step !== 2 ? 'carrito-finalizar__oculto' : 'carrito-finalizar carrito-finalizar-next disabled'}>
            Cargando...
          </Link>
        )}
      </div>
    </div>
  );
}

export default CartTotal;
