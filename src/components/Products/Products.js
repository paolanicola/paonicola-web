import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../../features/products/productSlice'
import Filters from '../Filters/Filters'
import Product from '../Product/Product'

import { loadCategories } from '../../features/categories'
import axios from 'axios'
import { loadProducts } from '../../features/producto'
import { productsWithOff } from '../../features/producto/selector'

export default function Products() {
  const dispatch = useDispatch()
  const products = useSelector(getAllProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState(products)

  //inico
  const [productos, setProductos] = useState()
  const [accesoAPI, setAccesoAPI] = useState({
    tipo: 'GET',
    url: 'http://localhost:3002/api/products'
  })
  useEffect(() => {
    const oP = async () => {
      const url = 'http://localhost:3002/api/products'

      const result = await axios({ method: accesoAPI.tipo, url: accesoAPI.url })
      //setSearchResult(result.data)
    }

    oP()
  }, [])
  //fin
  const { loading: isLoading, data: info, success } = useSelector((state) => state.productos)

  useEffect(() => {
    if (success) {
      console.log(info)
      setSearchResult(info)
    }
  }, [success, info])

  useEffect(() => {
    dispatch(loadCategories())
    dispatch(loadProducts())
  }, [])

  const searchHandler = (searchTerm) => {
    //console.log(searchTerm);
    setSearchTerm(searchTerm)
    if (searchTerm !== '') {
      const newProductsList = Object.values(products).filter((product) => {
        return Object.values(product).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      })
      console.log(newProductsList)
      setSearchResult(newProductsList)
    } else {
      setSearchResult(products)
    }
  }

  let renderProducts = ''

  //renderProducts = products.length > 0 ? products.map((product) => <Product product={product} />) : <div>No hay concidencias</div>;
  renderProducts =
    searchResult.length > 0 ? (
      searchResult.map((product) => <Product product={product} />)
    ) : (
      <div className='product-notFound'>No hay concidencias</div>
    )

  return (
    <>
      <div className='container-products'>
        <div className='container-page-products'>
          <Filters term={searchTerm} searchKeyWord={searchHandler} />
          <div className='container-list-products'>{renderProducts}</div>
        </div>
      </div>
    </>
  )
}
