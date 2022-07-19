import React, { useEffect, useRef, useState } from 'react'

function DropDown() {
  const selectReft = useRef()
  const [language, setLanguage] = useState('i18n.language')
  const [isActive, setIsActive] = useState(false)
  const [selected, setSelected] = useState('Selecciona')

  const options = [
    { value: 'relevante', label: 'Mas relevante' },
    { value: 'menor', label: 'Menor precio' },
    { value: 'mayor', label: 'Mayor precio' },
    { value: 'mayorDescuento', label: 'Mayor descuento' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' }
  ]

  const handlerShowOptions = () => {
    setIsActive(!isActive)
  }

  function handleKeyDown(e) {
    if (e.keyCode === 13) {
      handlerShowOptions()
    }
  }

  function handleOption(option) {
    setSelected(option.label)
    setIsActive(false)
  }

  const handleClickOutside = (event) => {
    if (!selectReft.current.contains(event.target)) {
      setIsActive(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [selectReft])

  return (
    <div ref={selectReft} className='dropdown'>
      <span className='dropdown-world' onClick={handlerShowOptions} />
      <div
        className={isActive ? 'dropdown-btn dropdown-btn--active' : 'dropdown-btn'}
        onClick={handlerShowOptions}
        role='button'
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {selected}
        <div className='separator' />
      </div>
      <span className='dropdown-vector' onClick={handlerShowOptions} />
      {isActive && (
        <div className='dropdown-content'>
          {options.map((option) =>
            option.value !== language ? (
              <div
                onClick={() => handleOption(option)}
                className='dropdown-item'
                role='button'
                tabIndex={0}
                onKeyDown={handleKeyDown}
              >
                {option.label}
              </div>
            ) : (
              ''
            )
          )}
        </div>
      )}
    </div>
  )
}

export default DropDown
