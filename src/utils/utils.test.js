import {
  formatNumber,
  countProductInCart,
  cartItemsExpired,
} from './utils'

describe('formatNumber', () => {
  it('formats thousands with es-ES separators', () => {
    expect(formatNumber(499000)).toBe('499.000')
    expect(formatNumber(39990)).toBe('39.990')
    expect(formatNumber(0)).toBe('0')
  })
})

describe('countProductInCart', () => {
  const cart = { cartItems: [{ id: 1, cartQuantity: 3 }] }

  it('returns the quantity for products in the cart', () => {
    expect(countProductInCart(1, cart)).toBe(3)
  })

  it('returns 0 for products not in the cart', () => {
    expect(countProductInCart(99, cart)).toBe(0)
  })
})

describe('cartItemsExpired', () => {
  afterEach(() => localStorage.clear())

  it('is falsy when nothing was stored', () => {
    expect(cartItemsExpired()).toBeFalsy()
  })

  it('is false for a fresh timestamp', () => {
    localStorage.setItem('lastProductAddedTimestamp', new Date().toISOString())
    expect(cartItemsExpired()).toBe(false)
  })

  it('is true after the one-hour window', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    localStorage.setItem('lastProductAddedTimestamp', twoHoursAgo.toISOString())
    expect(cartItemsExpired()).toBe(true)
  })
})
