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
    // Action to add a single book to the books array
    addBook: (state, action) => {
      state.books.push(action.payload);
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

export const { useSetBooks, useAddBook, useRemoveBook, useClearBooks } =
  booksSlice.actions;

export default booksSlice.reducer;
