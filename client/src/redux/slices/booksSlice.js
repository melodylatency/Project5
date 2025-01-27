import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: JSON.parse(localStorage.getItem("books")) || [], // Load from localStorage
  language: localStorage.getItem("language") || "en",
  seed:
    JSON.parse(localStorage.getItem("seed")) ||
    Math.floor(Math.random() * 1000000),
  page: 1,
  reviews: JSON.parse(localStorage.getItem("reviews")) || 3,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
      localStorage.setItem("books", JSON.stringify(state.books));
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
  },
});

export const { setBooks, setLanguage, setSeed, setPage, setReviews } =
  booksSlice.actions;

export default booksSlice.reducer;
