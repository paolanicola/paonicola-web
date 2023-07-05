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
  localStorage.removeItem('dateSelected')
  localStorage.removeItem('stepCurrent')
  localStorage.removeItem('cartItems')
  localStorage.removeItem('verified')
  localStorage.removeItem('form')
  localStorage.removeItem('selectedId')
  localStorage.removeItem('lastProductAddedTimestamp')
}
