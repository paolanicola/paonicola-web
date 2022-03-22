import React from 'react';
import Select, { components, DropdownIndicator, DropdownIndicatorProps } from 'react-select';
import { ReactComponent as Chevron } from '../../assets/images/tienda/chevron.svg';
import { ReactComponent as OrderIcon } from '../../assets/images/tienda/order-icon.svg';

function Filters() {
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

  return (
    <div className='filtros first-section'>
      <div className='container2'>
        <div className='row'>
          <div className=' container-search'>
            <input className='search' type='search' name='name' placeholder='Buscar...' />
          </div>
          <div className=' container-categorias'>
            <Select components={{ DropdownIndicator }} className='react-select-container' classNamePrefix='react-select' options={optionsCat} />
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
    </div>
  );
}

export default Filters;
