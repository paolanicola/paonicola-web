import React, { createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select, { components } from 'react-select'
import { ReactComponent as FilterIcon } from '../../assets/images/tienda/filter.svg'
import { ReactComponent as OrderIcon } from '../../assets/images/tienda/order-icon.svg'
import {
  getCategories,
  setCategoryFilter,
  setOrderProducts,
} from '../../features/products'

function Filters({ term, searchKeyWord }) {
  const dispatch = useDispatch()
  const categories = useSelector(getCategories)

  const optionsOrder = [
    { value: 'mayor', label: 'Mayor precio' },
    { value: 'menor', label: 'Menor precio' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' },
  ]

  const optionsCat = categories.map((category) => ({
    value: category,
    label: category,
  }))

  const FilterIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <FilterIcon />
    </components.DropdownIndicator>
  )

  const OrderIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <OrderIcon />
    </components.DropdownIndicator>
  )

  const customStyles = {
    control: () => ({
      // none of react-select's styles are passed to <Control />
    }),
  }

  const inputEl = createRef()
  const getSearchTerm = () => {
    searchKeyWord(inputEl.current.value)
  }

  const handleFilterCategory = (e) => {
    dispatch(setCategoryFilter(e.value))
  }

  const handleOrderProducts = (e) => {
    dispatch(setOrderProducts(e.value))
  }

  return (
    <div className='container-filters fsirst-section'>
      <div className='column'>
        <div className='row'>
          <div className='container-search'>
            <input
              ref={inputEl}
              className='search'
              type='text'
              name='search'
              placeholder='Buscar...'
              value={term}
              onChange={getSearchTerm}
            />
          </div>

          <div className=' container-categories activeg'>
            <Select
              components={{
                DropdownIndicator: (props) => <FilterIndicator {...props} />,
              }}
              styles={customStyles}
              className='react-select-container'
              classNamePrefix='react-select'
              options={optionsCat}
              onChange={handleFilterCategory}
              placeholder={'Seleccionar Categoría'}
            />
          </div>
        </div>
        <div className=' container-order'>
          <Select
            components={{
              DropdownIndicator: (props) => <OrderIndicator {...props} />,
            }}
            styles={customStyles}
            className='react-select-container'
            classNamePrefix='react-select'
            options={optionsOrder}
            placeholder={'Seleccionar Ordenamiento'}
            onChange={handleOrderProducts}
          />
        </div>
      </div>
    </div>
  )
}

export default Filters
