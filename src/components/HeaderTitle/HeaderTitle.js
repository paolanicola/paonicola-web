import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  return (
    <>
      {c[1] !== 'p' ? (
        <div className='encabezado'>
          <div className='col-12'>
            <div className='titulo'>
              <h1 className=''>{c}</h1>
            </div>
          </div>
        </div>
      ) : (
        <div className='margintop'></div>
      )}
    </>
  );
}

export default HeaderTitle;
