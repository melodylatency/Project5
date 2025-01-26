import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage or fallback to an empty array
const initialState = {
  books: JSON.parse(localStorage.getItem("books")) || [], // Try loading from localStorage
  language: localStorage.getItem("language") || "en",
  seed:
    JSON.parse(localStorage.getItem("seed")) ||
    Math.floor(Math.random() * 1000000),
  page: JSON.parse(localStorage.getItem("page")) || 1,
  reviews: JSON.parse(localStorage.getItem("reviews")) || 3,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    // Action to set the books array (e.g., after fetching from backend)
    setBooks: (state, action) => {
      state.books = action.payload;
      localStorage.setItem("books", JSON.stringify(state.books)); // Persist to localStorage
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", JSON.stringify(state.language)); // Persist to localStorage
    },
    setSeed: (state, action) => {
      state.seed = action.payload;
      localStorage.setItem("seed", JSON.stringify(state.seed)); // Persist to localStorage
    },
    setPage: (state, action) => {
      state.page = action.payload;
      localStorage.setItem("page", JSON.stringify(state.page)); // Persist to localStorage
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
      localStorage.setItem("reviews", JSON.stringify(state.reviews)); // Persist to localStorage
    },
  },
});

// Export action creators
export const { setBooks, setLanguage, setSeed, setPage, setReviews } =
  booksSlice.actions;

export default booksSlice.reducer;
