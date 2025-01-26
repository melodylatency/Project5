import React, { useEffect } from "react";
import { useGetBooksQuery } from "../redux/slices/booksApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setBooks,
  setLanguage,
  setReviews,
  setSeed,
} from "../redux/slices/booksSlice"; // Ensure this action is imported correctly
import Papa from "papaparse"; // Make sure PapaParse is installed and imported

const Header = () => {
  const { language, seed, reviews, page } = useSelector((state) => state.books);

  const dispatch = useDispatch();

  const { books, isLoading, error } = useGetBooksQuery({
    language,
    seed,
    page,
    reviewCount: reviews,
  });

  // Function to handle CSV export
  const handleExportCSV = () => {
    if (!books || books.length === 0) return; // Prevent exporting if no books
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

  // Save settings to localStorage whenever parameters change
  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("seed", seed.toString());
    localStorage.setItem("reviews", reviews.toString());
  }, [books, language, seed, reviews]);

  useEffect(() => {
    if (books) {
      dispatch(setBooks(books));
    }
  }, [books]);

  // Show loading or error states
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading books.</p>;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 py-3 px-6">
      <select
        value={language}
        onChange={(e) => dispatch(setLanguage(e.target.value))}
        className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option value="en">English (USA)</option>
        <option value="de">German (Germany)</option>
        <option value="fr">French (France)</option>
      </select>
      <input
        type="number"
        value={seed}
        onChange={(e) => dispatch(setSeed(Number(e.target.value)))}
        className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Enter seed"
      />
      <input
        type="number"
        step="0.1"
        value={reviews}
        onChange={(e) => dispatch(setReviews(parseFloat(e.target.value)))}
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
  );
};

export default Header;
