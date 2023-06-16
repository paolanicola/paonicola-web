import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Filters from '../Filters/Filters'
import Product from '../Product/Product'

import { loadCategories } from '../../features/categories'
import { getAllProducts, loadProducts } from '../../features/producto'

const Products = () => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState([])

  const {
    loading: isLoading,
    products,
    success,
  } = useSelector(getAllProducts)

  useEffect(() => {
    if (success) {
      setSearchResult(products)
    }
  }, [success, products])

  useEffect(() => {
    dispatch(loadCategories())
    dispatch(loadProducts())
  }, [])

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm)
    if (searchTerm !== '') {
      const newProductsList = products.filter(({ name }) => {
        return name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      })
      setSearchResult(newProductsList)
    } else {
      setSearchResult(products)
    }
  }
  
  if(isLoading){
    return(
      <div className='product-notFound'>Cargando productos ...</div>
    )
  }

  const renderProducts =
    searchResult.length > 0 ? (
      searchResult.map((product) => (
        <Product key={product.id} product={product} />
      ))
    ) : (
      <div className='product-notFound'>No hay coincidencias</div>
    )

  return (
    <div className='container-products'>
      <div className='container-page-products'>
        <Filters term={searchTerm} searchKeyWord={searchHandler} />
        <div className='container-list-products'>{renderProducts}</div>
      </div>
    </div>
  )
}

export default Products
