const OrderFailure = ({ errors }) => {
  // Displaying all error messages
  const errorMessages = Object.entries(errors).flatMap(
    ([key, messages]) => messages
  )
  const errorMessage =
    errorMessages.length > 0
      ? errorMessages.join(', ')
      : 'Error en la compra. Por favor, vuelva a intentar.'

  return <h2 className='order-error-message'>{errorMessage}</h2>
}

export default OrderFailure
