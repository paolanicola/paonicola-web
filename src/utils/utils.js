export const formatNumber = (number) => number.toLocaleString('es-ES')

export const countProductInCart = (productId, cart) => {
  const product = cart.cartItems.find((item) => item.id === productId)
  return product ? product.cartQuantity : 0
}

export const cartItemsExpired = () => {
  const lastProductAddedTimestamp = localStorage.getItem(
    'lastProductAddedTimestamp'
  )
  let itemsExpired = false

  if (lastProductAddedTimestamp) {
    const currentTime = new Date()
    const oneHourInMillis = 60 * 60 * 1000
    const lastAddedTime = new Date(lastProductAddedTimestamp)
    itemsExpired = currentTime - lastAddedTime >= oneHourInMillis
  }
  return itemsExpired
}

export const cleanLocalStorage = () => {
  localStorage.removeItem('stepCurrent')
  localStorage.removeItem('cartItems')
  localStorage.removeItem('verified')
  localStorage.removeItem('selectedAppointmentId')
  localStorage.removeItem('form')
  localStorage.removeItem('lastProductAddedTimestamp')
}

const spanishMonths = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export const isoDateToSpanishString = (isoString) => {
  const date = new Date(isoString)
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0') // minutes smaller than 10 always have two digits and the first one is always zero

  return `${day} de ${spanishMonths[month]} de ${year} - ${hours}:${minutes}hs`
}

export const getDisplayPaymentMethod = (paymentType) => {
  if (paymentType === 'deposit') {
    return 'Transferencia bancaria'
  } else if (paymentType === 'mercadopago') {
    return 'Mercadopago'
  } else {
    // Handle other payment types or invalid values here
    return 'Desconocido'
  }
}
