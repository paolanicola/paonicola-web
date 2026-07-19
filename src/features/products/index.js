/* eslint-disable default-case */
import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../apiCalls'

// ACTIONS
const productsRequested = 'requested'
const productsRequestFailed = 'requestFailed'
const productsReceived = 'received'
// Product individual actions
const productRequested = 'productRequested'
const productRequestFailed = 'productRequestFailed'
const productReceived = 'productReceived'
// Category action
const filterByCategory = 'filterByCategory'
const orderProducts = 'orderProducts'

const ALL_CATEGORIES = 'Todas las categorías'

const initialState = {
  allProducts: [],
  productsAvailable: [],
  currentProduct: null,
  filterCategory: '',
  orderProducts: '',
  loading: false,
  loadingProduct: false,
  loadSuccess: false,
  success: false,
  failed: false,
  productFailed: false,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    [productsRequested]: (state) => {
      state.loading = true
      state.success = false
      state.loadSuccess = false
      // sin esto un fetch fallido dejaba la tienda en el mensaje de error para
      // siempre: el reintento traía los productos pero `failed` seguía en true
      state.failed = false
    },
    [productsReceived]: (state, action) => {
      state.loading = false
      state.loadSuccess = true
      state.success = true
      state.failed = false
      state.allProducts = [...action.payload]
      state.productsAvailable = [...action.payload]
    },
    [productsRequestFailed]: (state, action) => {
      state.loading = false
      state.success = false
      state.loadSuccess = false
      state.failed = true
    },
    [productRequested]: (state) => {
      state.loadingProduct = true
      state.currentProduct = null // ← Limpia el producto anterior
      state.productFailed = false
    },
    [productReceived]: (state, action) => {
      state.loadingProduct = false
      state.currentProduct = action.payload
      state.productFailed = false
    },
    [productRequestFailed]: (state, action) => {
      state.loadingProduct = false
      state.currentProduct = null
      // sin esto la página quedaba en "Cargando producto ..." para siempre
      // ante un 404 o un timeout
      state.productFailed = true
    },
    [filterByCategory]: (state, action) => {
      state.filterCategory = action.payload
      const showAll =
        !state.filterCategory || state.filterCategory === ALL_CATEGORIES
      state.productsAvailable = showAll
        ? [...state.allProducts]
        : state.allProducts.filter(
            ({ category }) => category === state.filterCategory
          )
      return state
    },
    [orderProducts]: (state, action) => {
      state.orderProducts = action.payload
      const prodsAvailable = [...state.productsAvailable]
      switch (state.orderProducts) {
        case 'mayor':
          state.productsAvailable = prodsAvailable.sort(
            (a, b) =>
              (b.active_promo ? b.promo_price : b.price) -
              (a.active_promo ? a.promo_price : a.price)
          )
          break
        case 'menor':
          state.productsAvailable = prodsAvailable.sort(
            (a, b) =>
              (a.active_promo ? a.promo_price : a.price) -
              (b.active_promo ? b.promo_price : b.price)
          )
          break
        case 'a-z':
          state.productsAvailable = prodsAvailable.sort((a, b) =>
            a.name.localeCompare(b.name)
          )
          break
        case 'z-a':
          state.productsAvailable = prodsAvailable.sort((a, b) =>
            b.name.localeCompare(a.name)
          )
      }
    },
  },
})

// Actions
const productsRequestedAction = productSlice.actions[productsRequested]
const productsRequestFailedAction = productSlice.actions[productsRequestFailed]
const productsReceivedAction = productSlice.actions[productsReceived]

const productRequestedAction = productSlice.actions[productRequested]
const productRequestFailedAction = productSlice.actions[productRequestFailed]
const productReceivedAction = productSlice.actions[productReceived]

export const loadProducts = () => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: `${process.env.REACT_APP_API_BASE_URL}/products`,
      onStart: productsRequestedAction.type,
      onSuccess: productsReceivedAction.type,
      onError: productsRequestFailedAction.type,
    })
  )
}

export const loadProduct = (productId) => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`,
      onStart: productRequestedAction.type,
      onSuccess: productReceivedAction.type,
      onError: productRequestFailedAction.type,
    })
  )
}

// Selectors
export const getAllProducts = (state) => state.products

export const getProductsAvailables = (state) => {
  return state.products.productsAvailable
}

export const getCurrentProduct = (state) => state.products.currentProduct

export const isLoadingProduct = (state) => state.products.loadingProduct

export const hasProductFailed = (state) => state.products.productFailed

export const getCategories = (state) =>
  Object.values(
    state.products.allProducts.reduce(
      (categories, product) => {
        categories[product.category] = product.category
        return categories
      },
      { [ALL_CATEGORIES]: ALL_CATEGORIES }
    )
  )

export const {
  filterByCategory: setCategoryFilter,
  orderProducts: setOrderProducts,
} = productSlice.actions

export default productSlice.reducer