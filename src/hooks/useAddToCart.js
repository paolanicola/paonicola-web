import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart, isCartWithCalendar } from '../features/cart/cartSlice'
import { backStep } from '../features/stepsCheckout/stepsSlice'
import { countProductInCart } from '../utils/utils'
import { messages } from '../utils/messages'

/**
 * Shared add-to-cart behavior (stock limit, single-calendar rule,
 * checkout-step reset) extracted from the legacy Product card so the
 * Tienda and Producto pages stay presentational.
 */
export default function useAddToCart() {
  const cart = useSelector((state) => state.cart)
  const step = useSelector((state) => state.step.step)
  const cartAlreadyHasCalendarProduct = useSelector(isCartWithCalendar)
  const dispatch = useDispatch()

  return function handleAddToCart(product) {
    if (
      product.category === 'Consultas Online' &&
      cartAlreadyHasCalendarProduct
    ) {
      toast.info(messages.cartAlreadyHasCalendarProduct)
    } else if (countProductInCart(product.id, cart) >= product.stock) {
      toast.error(messages.stockLimitReached)
    } else {
      dispatch(addToCart(product))
      toast.success(messages.productAddedToCart)
    }
    if (step === 2 && cart.cartTotalQuantity > 1) {
      dispatch(backStep())
    }
  }
}
