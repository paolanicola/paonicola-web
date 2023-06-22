import React from 'react';

import { Link } from 'react-router-dom';
import ConsultasOnline from '../../assets/images/services-img/04consultas-online.svg';
import { Header } from '../../components';

const NotFound = () =>  
  <>
    <Header />
    <div className='notfound-container'>
      <div className=' '>
        <img className='item-img-nf' src={ConsultasOnline} alt='not found' title='Error' />
        <h3>Parece que esta página no existe</h3>
      </div>
      <div className='notfound-link'>
        <Link to='/home'> Ir a la página principal</Link>
      </div>
    </div>
  </>

export default NotFound;
