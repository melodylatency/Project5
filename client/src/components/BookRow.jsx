import React, { useState, useEffect } from "react";
import { useGetBooksQuery } from "../redux/slices/booksApiSlice"; // API slice
import InfiniteScroll from "react-infinite-scroll-component";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import { addBooks, removeBook } from "../redux/slices/booksSlice"; // Actions

const BookList = () => {
  // Default values
  const defaultLanguage = "English (USA)";
  const defaultSeed = Math.floor(Math.random() * 1000000); // Random seed
  const defaultPage = 1;
  const defaultReviews = 5;

  const dispatch = useDispatch();

  // States for query parameters
  const [language, setLanguage] = useState(defaultLanguage);
  const [seed, setSeed] = useState(defaultSeed);
  const [page, setPage] = useState(defaultPage);
  const [reviews, setReviews] = useState(defaultReviews);

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState({});

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
    setPage((prevPage) => prevPage + 1);
    if (books) {
      dispatch(addBooks(books));
    }
  };

  // Function to handle CSV export
  const handleExportCSV = () => {
    const csvData = books.map((book, index) => ({
      Index: index + 1,
      ISBN: book.isbn,
      Title: book.title,
      Author: book.author,
      Publisher: book.publisher,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "books.csv";
    link.click();
  };

  // Toggle the expanded state for a row
  const toggleExpand = (isbn) => {
    setExpandedRows((prev) => ({
      ...prev,
      [isbn]: !prev[isbn],
    }));
  };

  // Handle removing a book
  const handleRemove = (isbn) => {
    dispatch(removeBook(isbn));
  };

  useEffect(() => {
    // Save settings to localStorage
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
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="English (USA)">English (USA)</option>
          <option value="German (Germany)">German (Germany)</option>
          <option value="French (France)">French (France)</option>
        </select>
        <input
          type="number"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Enter seed"
        />
        <input
          type="number"
          step="0.1"
          value={reviews}
          onChange={(e) => setReviews(parseFloat(e.target.value))}
          className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Avg reviews per book"
        />
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
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book, index) => (
                <>
                  <tr
                    key={book.isbn}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.isbn}</td>
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2">{book.publisher}</td>
                    <td className="px-4 py-2 flex items-center space-x-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => toggleExpand(book.isbn)}
                      >
                        {expandedRows[book.isbn] ? "Collapse" : "View Details"}
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleRemove(book.isbn)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                  {expandedRows[book.isbn] && (
                    <tr>
                      <td colSpan={6} className="p-4 bg-gray-100">
                        <div className="flex space-x-4">
                          <img
                            src={book.coverImage}
                            alt={`${book.title} cover`}
                            className="w-32 h-48 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-semibold">Reviews:</p>
                            <ul className="list-disc pl-4 text-sm text-gray-600">
                              <li>"A wonderful read!" - Reviewer 1</li>
                              <li>"Captivating story!" - Reviewer 2</li>
                              <li>"Not my favorite." - Reviewer 3</li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default BookList;
