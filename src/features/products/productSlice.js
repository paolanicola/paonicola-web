import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [{}],
  product: 0,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProducts(state, action) {
      state.products.reduce((p) => {
        const itemIndex = state.products.filter(
          (item) => item.id === parseInt(action.payload)
        )
        //console.log(itemIndex[0].id + ' dentro del reducer');
        state.product = itemIndex[0]
        return itemIndex[0]
      })

      //return product;
    },
  },
})

export const { getProducts } = productSlice.actions
export const getAllProducts = (state) => state.products.products
export const getProduct = (state) => state.products.product
export default productSlice.reducer
