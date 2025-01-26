import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage or fallback to an empty array
const initialState = {
  books: JSON.parse(localStorage.getItem("books")) || [], // Try loading from localStorage
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
    // Action to add multiple books to the books array
    addBooks: (state, action) => {
      state.books = [...state.books, ...action.payload]; // Append new books
      localStorage.setItem("books", JSON.stringify(state.books)); // Persist to localStorage
    },
    // Action to remove a book by ISBN
    removeBook: (state, action) => {
      state.books = state.books.filter((book) => book.isbn !== action.payload);
      localStorage.setItem("books", JSON.stringify(state.books)); // Persist to localStorage
    },
    // Action to clear all books from the state and localStorage
    clearBooks: (state) => {
      state.books = [];
      localStorage.removeItem("books"); // Remove from localStorage
    },
  },
});

// Export action creators
export const { setBooks, addBooks, removeBook, clearBooks } =
  booksSlice.actions;

export default booksSlice.reducer;
