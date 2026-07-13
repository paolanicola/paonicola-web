import reducer, {
  addToCart,
  removeFromCart,
  deleteCartItems,
  decreaseCart,
  getTotals,
} from './cartSlice'

const PRODUCT = {
  id: 1,
  name: 'Kit Regula',
  price: 28990,
  active_promo: false,
  promo_price: null,
  stock: 5,
  category: 'Kits',
}

const PROMO = {
  id: 2,
  name: 'Kit Rendimiento',
  price: 48000,
  active_promo: true,
  promo_price: 39990,
  stock: 5,
  category: 'Kits',
}

const empty = { cartItems: [], cartTotalQuantity: 0, cartTotalAmount: 0 }

describe('cartSlice', () => {
  it('adds a product and increases quantity on repeat', () => {
    let state = reducer(empty, addToCart(PRODUCT))
    expect(state.cartItems).toHaveLength(1)
    expect(state.cartItems[0].cartQuantity).toBe(1)

    state = reducer(state, addToCart(PRODUCT))
    expect(state.cartItems).toHaveLength(1)
    expect(state.cartItems[0].cartQuantity).toBe(2)
  })

  // Regresión: el contador del header quedaba en 0 porque addToCart no
  // actualizaba los totales hasta que algún componente despachara getTotals.
  it('keeps totals in sync on every mutation, without dispatching getTotals', () => {
    let state = reducer(empty, addToCart(PRODUCT))
    expect(state.cartTotalQuantity).toBe(1)
    expect(state.cartTotalAmount).toBe(28990)

    state = reducer(state, addToCart(PROMO))
    expect(state.cartTotalQuantity).toBe(2)
    expect(state.cartTotalAmount).toBe(28990 + 39990)

    state = reducer(state, decreaseCart(PROMO))
    expect(state.cartTotalQuantity).toBe(1)
    expect(state.cartTotalAmount).toBe(28990)

    state = reducer(state, removeFromCart(PRODUCT))
    expect(state.cartTotalQuantity).toBe(0)
    expect(state.cartTotalAmount).toBe(0)
  })

  it('decreases quantity and removes items', () => {
    let state = reducer(empty, addToCart(PRODUCT))
    state = reducer(state, addToCart(PRODUCT))
    state = reducer(state, decreaseCart(PRODUCT))
    expect(state.cartItems[0].cartQuantity).toBe(1)

    state = reducer(state, removeFromCart(PRODUCT))
    expect(state.cartItems).toHaveLength(0)
  })

  it('deleteCartItems empties everything', () => {
    let state = reducer(empty, addToCart(PRODUCT))
    state = reducer(state, getTotals())
    state = reducer(state, deleteCartItems())
    expect(state.cartItems).toHaveLength(0)
    expect(state.cartTotalAmount).toBe(0)
    expect(state.cartTotalQuantity).toBe(0)
  })

  describe('getTotals', () => {
    it('sums plain prices by quantity', () => {
      let state = reducer(empty, addToCart(PRODUCT))
      state = reducer(state, addToCart(PRODUCT))
      state = reducer(state, getTotals())
      expect(state.cartTotalAmount).toBe(28990 * 2)
      expect(state.cartTotalQuantity).toBe(2)
    })

    // Regresión: getTotals leía promo/promoPrice (nombres viejos) y cobraba
    // precio lleno en productos con promo activa.
    it('uses promo_price for active promos (regression)', () => {
      let state = reducer(empty, addToCart(PROMO))
      state = reducer(state, getTotals())
      expect(state.cartTotalAmount).toBe(39990)
    })

    it('mixes promo and non-promo items correctly', () => {
      let state = reducer(empty, addToCart(PRODUCT))
      state = reducer(state, addToCart(PROMO))
      state = reducer(state, getTotals())
      expect(state.cartTotalAmount).toBe(28990 + 39990)
    })

    it('ignores promo_price when the flag is off', () => {
      const offPromo = { ...PROMO, id: 3, active_promo: false }
      let state = reducer(empty, addToCart(offPromo))
      state = reducer(state, getTotals())
      expect(state.cartTotalAmount).toBe(48000)
    })
  })
})
