import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductView from '../../components/ProductView/ProductView';
import { getProducts, getProduct } from '../../features/products/productSlice';

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  dispatch(getProducts(id));
  const product = useSelector(getProduct);
  console.log(product.name + ' aaaaa');
  return (
    <>
      <ProductView product={product} />
    </>
  );
}
