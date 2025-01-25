import React, { useState, useEffect } from "react";
import { useGetBooksQuery } from "../redux/slices/booksApiSlice"; // assuming you have the API slice
import BookRow from "./BookRow"; // A component for rendering a single book
import InfiniteScroll from "react-infinite-scroll-component";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import { addBooks } from "../redux/slices/booksSlice"; // Correct import for the action creator

const BookList = () => {
  // Default values
  const defaultLanguage = "English (USA)";
  const defaultSeed = Math.floor(Math.random() * 1000000); // Random seed if not provided
  const defaultPage = 1;
  const defaultReviews = 5; // Default average reviews per book

  const dispatch = useDispatch();

  // States for query parameters
  const [language, setLanguage] = useState(defaultLanguage);
  const [seed, setSeed] = useState(defaultSeed);
  const [page, setPage] = useState(defaultPage);
  const [reviews, setReviews] = useState(defaultReviews);

  // Fetch books using the query hook
  const {
    data: books,
    isLoading,
    error,
  } = useGetBooksQuery({
    language,
    seed,
    page,
    reviewCount: reviews,
  });

  // Function to handle page scrolling and load more books
  const fetchNextPage = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
    if (books) {
      dispatch(addBooks(books)); // Append new books to the Redux store
    }
  };

  // Function to handle CSV export
  const handleExportCSV = () => {
    const csvData = books.map((book) => ({
      Index: book.index,
      ISBN: book.isbn,
      Title: book.title,
      Author: book.author,
      Publisher: book.publisher,
    }));
    Papa.unparse(csvData, {
      complete: (result) => {
        const blob = new Blob([result.csv], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "books.csv";
        link.click();
      },
    });
  };

  // Handle changes in the seed input
  const handleSeedChange = (event) => {
    setSeed(event.target.value);
    setPage(1); // Reset page to 1 when the seed is changed
  };

  // Handle changes in reviews input
  const handleReviewsChange = (event) => {
    setReviews(parseFloat(event.target.value));
  };

  // Handle changes in language selection
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    setPage(1); // Reset page to 1 when language is changed
  };

  useEffect(() => {
    // You can save the seed and other settings to localStorage for persistence
    localStorage.setItem("language", language);
    localStorage.setItem("seed", seed);
    localStorage.setItem("reviews", reviews);
  }, [language, seed, reviews]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading books.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controls Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Language Selection */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="English (USA)">English (USA)</option>
          <option value="German (Germany)">German (Germany)</option>
          <option value="French (France)">French (France)</option>
          {/* Add more language options here */}
        </select>

        {/* Seed Input */}
        <input
          type="number"
          value={seed}
          onChange={handleSeedChange}
          className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Enter seed"
        />

        {/* Reviews Input */}
        <input
          type="number"
          step="0.1"
          value={reviews}
          onChange={handleReviewsChange}
          className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Avg reviews per book"
        />

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Export to CSV
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <InfiniteScroll
          dataLength={books.length}
          next={fetchNextPage}
          hasMore={books.length === 10}
          loader={
            <div className="p-4 text-center">
              <h4 className="text-gray-600">Loading...</h4>
            </div>
          }
        >
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">Index</th>
                <th className="px-4 py-2">ISBN</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Publisher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book, index) => (
                <tr
                  key={book.isbn}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{book.isbn}</td>
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  <td className="px-4 py-2">{book.publisher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default BookList;
