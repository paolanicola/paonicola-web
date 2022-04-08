import React from 'react';
import { useLocation } from 'react-router-dom';

function HeaderTitle() {
  const location = useLocation();
  console.log(location.pathname);
  let a = location.pathname;

  let b = a.split('/');

  return (
    <>
      <div className='encabezado'>
        <div className='col-12'>
          <div className='titulo'>
            <h1 className=''>{b}</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderTitle;
