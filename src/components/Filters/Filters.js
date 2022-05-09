import React, { createRef, useRef } from 'react';
import Select, { components, DropdownIndicator, DropdownIndicatorProps } from 'react-select';
import { ReactComponent as Chevron } from '../../assets/images/tienda/chevron.svg';
import { ReactComponent as OrderIcon } from '../../assets/images/tienda/order-icon.svg';

function Filters({ term, searchKeyWord }) {
  const optionsOrder = [
    { value: 'menor', label: 'Menor precio' },
    { value: 'mayor', label: 'Mayor precio' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' },
  ];
  const optionsCat = [
    { value: 'todas', label: 'Todas las categorías' },
    { value: 'consultas', label: 'Consultas online' },
    { value: 'guias', label: 'Guías' },
    { value: 'mosaicos', label: 'Mosaicos' },
    { value: 'pack', label: 'Pack Ahorro' },
    { value: 'recetarios', label: 'Recetarios' },
  ];

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <OrderIcon />
      </components.DropdownIndicator>
    );
  };
  const customStyles = {
    control: () => ({
      // none of react-select's styles are passed to <Control />
      //width: 200,
    }),
  };

  const [searchTermq, setSearchTermq] = React.useState('');
  const handleChange = (event) => {
    setSearchTermq(event.target.value);
  };
  const inputEl = createRef();
  const getSearchTerm = () => {
    //console.log(inputEl.current.value);
    searchKeyWord(inputEl.current.value);
  };

  return (
    <div className='container-filters fsirst-section'>
      <div className='column'>
        <div className='row'>
          <div className='container-search'>
            <input ref={inputEl} className='search' type='text' name='search' placeholder='Buscar...' value={term} onChange={getSearchTerm} />
          </div>

          <div className=' container-categories activeg'>
            <Select
              components={{ DropdownIndicator }}
              styles={customStyles}
              className='react-select-container'
              classNamePrefix='react-select'
              options={optionsCat}
            />
          </div>
        </div>
        <div className=' container-order'>
          <Select
            components={{ DropdownIndicator }}
            styles={customStyles}
            className='react-select-container'
            classNamePrefix='react-select'
            options={optionsOrder}
          />
        </div>
      </div>
    </div>
  );
}

export default Filters;
