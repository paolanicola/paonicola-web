import reducer, { getAllProducts, hasProductFailed } from './index'

// Los action creators internos no se exportan; el slice se llama 'products',
// así que los types son 'products/<nombre del reducer>'.
const requested = { type: 'products/requested' }
const received = (payload) => ({ type: 'products/received', payload })
const requestFailed = { type: 'products/requestFailed' }
const productRequested = { type: 'products/productRequested' }
const productReceived = (payload) => ({ type: 'products/productReceived', payload })
const productRequestFailed = { type: 'products/productRequestFailed' }

const PRODUCT = { id: 1, name: 'Kit Regula', category: 'Kits' }

const init = () => reducer(undefined, { type: '@@INIT' })

describe('products slice — catálogo', () => {
  it('marca failed cuando el fetch falla', () => {
    const state = reducer(reducer(init(), requested), requestFailed)
    expect(state.failed).toBe(true)
    expect(state.loading).toBe(false)
  })

  // Regresión: `failed` sólo se limpiaba en initialState, así que un timeout
  // dejaba la tienda en el mensaje de error aunque el reintento funcionara.
  it('limpia failed al reintentar', () => {
    const afterError = reducer(reducer(init(), requested), requestFailed)
    expect(afterError.failed).toBe(true)

    const retrying = reducer(afterError, requested)
    expect(retrying.failed).toBe(false)
    expect(retrying.loading).toBe(true)
  })

  it('limpia failed cuando llegan los productos', () => {
    const afterError = reducer(reducer(init(), requested), requestFailed)
    const recovered = reducer(afterError, received([PRODUCT]))
    expect(recovered.failed).toBe(false)
    expect(recovered.allProducts).toHaveLength(1)
    expect(recovered.loading).toBe(false)
  })
})

describe('products slice — producto individual', () => {
  it('marca productFailed en un 404 o timeout', () => {
    const state = reducer(reducer(init(), productRequested), productRequestFailed)
    expect(state.productFailed).toBe(true)
    expect(state.loadingProduct).toBe(false)
    expect(state.currentProduct).toBeNull()
  })

  it('limpia productFailed al pedir otro producto', () => {
    const afterError = reducer(
      reducer(init(), productRequested),
      productRequestFailed
    )
    const retrying = reducer(afterError, productRequested)
    expect(retrying.productFailed).toBe(false)
    expect(retrying.loadingProduct).toBe(true)
  })

  it('limpia productFailed cuando llega el producto', () => {
    const afterError = reducer(
      reducer(init(), productRequested),
      productRequestFailed
    )
    const recovered = reducer(afterError, productReceived(PRODUCT))
    expect(recovered.productFailed).toBe(false)
    expect(recovered.currentProduct).toEqual(PRODUCT)
  })

  it('expone los selectores de estado', () => {
    const state = { products: init() }
    expect(hasProductFailed(state)).toBe(false)
    expect(getAllProducts(state).failed).toBe(false)
  })
})
