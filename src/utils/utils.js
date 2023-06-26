export const formatNumber = (number) => number.toLocaleString('es-ES')

export const countProductInCart = (productId, cart) => {
  const product = cart.cartItems.find((item) => item.id === productId)
  return product ? product.cartQuantity : 0
}
