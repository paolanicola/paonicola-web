import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../features/products/productSlice';
import Filters from '../Filters/Filters';
import Product from '../Product/Product';

export default function Products() {
  const dispatch = useDispatch();
  const products = useSelector(getAllProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(products);

  const searchHandler = (searchTerm) => {
    //console.log(searchTerm);
    setSearchTerm(searchTerm);
    if (searchTerm !== '') {
      const newProductsList = Object.values(products).filter((product) => {
        return Object.values(product).join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      });
      console.log(newProductsList);
      setSearchResult(newProductsList);
    } else {
      setSearchResult(products);
    }
  };

  let renderProducts = '';

  //renderProducts = products.length > 0 ? products.map((product) => <Product product={product} />) : <div>No hay concidencias</div>;
  renderProducts = searchResult.length > 0 ? searchResult.map((product) => <Product product={product} />) : <div>No hay concidencias</div>;

  return (
    <>
      <div className='container-products'>
        <div className='container-page-products'>
          <Filters term={searchTerm} searchKeyWord={searchHandler} />
          <div className='container-list-products'>{renderProducts}</div>
        </div>
      </div>
    </>
  );
}
