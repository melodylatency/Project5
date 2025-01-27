import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [], // Load from localStorage
  language: "en",
  seed: Math.floor(Math.random() * 1000000),
  page: 2,
  reviews: 3,
  likes: 4.7,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    appendBooks: (state, action) => {
      state.books = [...state.books, ...action.payload];
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setSeed: (state, action) => {
      state.seed = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setLikes: (state, action) => {
      state.likes = action.payload;
    },
  },
});

export const {
  setBooks,
  appendBooks,
  setLanguage,
  setSeed,
  setPage,
  setReviews,
  setLikes,
} = booksSlice.actions;

export default booksSlice.reducer;
