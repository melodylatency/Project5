import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage or fallback to an empty array
const initialState = localStorage.getItem("books")
  ? JSON.parse(localStorage.getItem("books"))
  : { books: [] };

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    // Action to set the books array (after fetching from backend)
    setBooks: (state, action) => {
      state.books = action.payload;
      localStorage.setItem("books", JSON.stringify(state)); // Persist to localStorage
    },
    // Action to add multiple books to the books array
    addBooks: (state, action) => {
      state.books = [...state.books, ...action.payload]; // Append new books to the existing array
      localStorage.setItem("books", JSON.stringify(state)); // Persist to localStorage
    },
    // Action to remove a book by ISBN
    removeBook: (state, action) => {
      state.books = state.books.filter((book) => book.isbn !== action.payload);
      localStorage.setItem("books", JSON.stringify(state)); // Persist to localStorage
    },
    // Action to clear all books from the state and localStorage
    clearBooks: (state) => {
      state.books = [];
      localStorage.removeItem("books"); // Remove from localStorage
    },
  },
});

// Correctly export action creators without the `use` prefix
export const { setBooks, addBooks, removeBook, clearBooks } =
  booksSlice.actions;

export default booksSlice.reducer;
