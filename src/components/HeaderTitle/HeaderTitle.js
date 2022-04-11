import React from 'react';
import { useLocation } from 'react-router-dom';

function HeaderTitle() {
  const location = useLocation();
  let str = location.pathname;
  var re = /[-/]+/g;
  let c = str.replace(re, ' ');
  return (
    <>
      <div className='encabezado'>
        <div className='col-12'>
          <div className='titulo'>
            <h1 className=''>{c}</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderTitle;
