import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../features/products/productSlice';
import Filters from '../Filters/Filters';
import Product from '../Product/Product';

export default function Products() {
  const dispatch = useDispatch();
  const products = useSelector(getAllProducts);
  let renderProducts = '';
  renderProducts = products.length > 0 ? products.map((product) => <Product product={product} />) : <div>Error</div>;

  return (
    <>
      <div className='container-products'>
        <div className='container-page-products'>
          <Filters />
          <div className='container-list-products'>{renderProducts}</div>
        </div>
      </div>
    </>
  );
}
