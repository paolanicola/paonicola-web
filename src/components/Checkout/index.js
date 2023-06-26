
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Checkout from './Checkout';
import { isCartEmpty } from '../../features/cart/cartSlice'

const Index = () => {
  const isCheckoutNotAllowed = useSelector(isCartEmpty)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/checkout' && isCheckoutNotAllowed) {
      navigate('/carrito'); 
    }
  }, [location.pathname, navigate, isCheckoutNotAllowed]);

  return (
    <Checkout />
  )
}

export default Index
