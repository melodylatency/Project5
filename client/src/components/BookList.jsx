import React, { useState, useEffect } from "react";
import { useGetBooksQuery } from "../redux/slices/booksApiSlice"; // assuming you have the API slice
import BookRow from "./BookRow"; // A component for rendering a single book
import InfiniteScroll from "react-infinite-scroll-component";
import Papa from "papaparse";

const BookList = () => {
  // Default values
  const defaultLanguage = "English (USA)";
  const defaultSeed = Math.floor(Math.random() * 1000000); // Random seed if not provided
  const defaultPage = 1;
  const defaultReviews = 5; // Default average reviews per book

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
    setPage((prev) => prev + 1); // Increment page number for infinite scroll
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
    <div>
      <div className="flex space-x-4 mb-4">
        {/* Language Selection */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border p-2"
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
          className="border p-2"
          placeholder="Enter seed"
        />

        {/* Reviews Input */}
        <input
          type="number"
          step="0.1"
          value={reviews}
          onChange={handleReviewsChange}
          className="border p-2"
          placeholder="Average reviews per book"
        />
      </div>

      <button onClick={handleExportCSV} className="mb-4 p-2 border">
        Export to CSV
      </button>

      <InfiniteScroll
        dataLength={books.length}
        next={fetchNextPage}
        hasMore={books.length === 10} // Ensure more books are loaded if there are exactly 10 books on the current page
        loader={<h4>Loading...</h4>}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th>Index</th>
              <th>ISBN</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <BookRow key={book.isbn} book={book} />
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default BookList;
