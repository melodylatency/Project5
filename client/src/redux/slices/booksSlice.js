import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: JSON.parse(localStorage.getItem("books")) || [], // Load from localStorage
  language: localStorage.getItem("language") || "en",
  seed:
    JSON.parse(localStorage.getItem("seed")) ||
    Math.floor(Math.random() * 1000000),
  page: 2,
  reviews: JSON.parse(localStorage.getItem("reviews")) || 3,
  likes: JSON.parse(localStorage.getItem("likes")) || 4.7,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
      localStorage.setItem("books", JSON.stringify(state.books));
    },
    appendBooks: (state, action) => {
      state.books = [...state.books, ...action.payload];
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", state.language);
    },
    setSeed: (state, action) => {
      state.seed = action.payload;
      localStorage.setItem("seed", JSON.stringify(state.seed));
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    },
    setLikes: (state, action) => {
      state.likes = action.payload;
      localStorage.setItem("likes", JSON.stringify(state.likes));
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
