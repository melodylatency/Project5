import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action) => {
      const item = action.payload; // Singular object, which means that the find method is ideal, as we only have one object to check for

      const cartDuplicateItem = state.cartItems.find(
        (object) => object._id === item._id
      ); // An actul array object, not boolean

      if (cartDuplicateItem) {
        state.cartItems = state.cartItems.map((object) =>
          object._id === cartDuplicateItem._id ? item : object
        );
      } else {
        state.cartItems = [...state.cartItems, item]; // ADD COPY_OF_LIST AND ITEM TOGETHER
      }

      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      return updateCart(state);
    },
  },
});

export const { addBook, removeFromCart } = booksSlice.actions;

export default booksSlice.reducer;
