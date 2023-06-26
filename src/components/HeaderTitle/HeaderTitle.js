/* eslint-disable eqeqeq */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getTotals } from '../../features/cart/cartSlice';

function HeaderTitle() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTotals());
  }, [dispatch]);

  const location = useLocation();
  let str = location.pathname;
  var re = /[-/]+/g;
  let c = str.replace(re, ' ');
  function renderSwitch(param) {
    switch (param) {
      case ' home':
        return false;
      case ' ':
        return false;
      default:
        return true;
    }
  }

  return (
    <>
      {c[1] !== 'p' ? (
        renderSwitch(c) ? (
          <div className='encabezado__container'>
            <div className='encabezado__container-title'>
              <div className='title__container'>
                <h1 className='title__container-h1'>{c == ' checkout confirm' ? 'Compra Finalizada' : c}</h1>
              </div>
            </div>
          </div>
        ) : (
          <div className=''></div>
        )
      ) : (
        <div className='margintop'></div>
      )}
    </>
  );
}

export default HeaderTitle;
