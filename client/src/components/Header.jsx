import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetBooksQuery } from "../redux/slices/booksApiSlice";
import {
  setBooks,
  setLanguage,
  setSeed,
  setReviews,
  setLikes,
  setPage,
} from "../redux/slices/booksSlice";
import Papa from "papaparse";
import { FaRandom } from "react-icons/fa";

const Header = () => {
  const { language, seed, reviews, likes, books } = useSelector(
    (state) => state.books
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLanguage(language));
    dispatch(setSeed(seed));
    dispatch(setReviews(reviews));
    dispatch(setLikes(likes));
    dispatch(setPage(2));
  }, [dispatch, language, seed, reviews, likes]);

  const {
    data: fetchedBooks,
    isLoading,
    error,
  } = useGetBooksQuery({
    language,
    seed,
    page: 1,
    reviewCount: reviews,
    likes,
  });

  useEffect(() => {
    if (!isLoading && fetchedBooks) {
      dispatch(setBooks(fetchedBooks));
    }
  }, [fetchedBooks, isLoading, dispatch]);

  const handleLanguageChange = (e) => {
    dispatch(setLanguage(e.target.value));
  };

  const handleSeedChange = (e) => {
    dispatch(setSeed(Number(e.target.value)));
  };

  const handleReviewsChange = (e) => {
    dispatch(setReviews(parseFloat(e.target.value)));
  };

  const handleLikesChange = (e) => {
    dispatch(setLikes(parseFloat(e.target.value)));
  };

  const handleNewSeed = () => {
    location.reload();
  };

  const handleExportCSV = () => {
    if (!books || books.length === 0) return;
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading books.</p>;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 py-3 px-6">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option value="en">English (USA)</option>
        <option value="ru">Russian (Russia)</option>
        <option value="nl">Netherlands (Dutch)</option>
      </select>
      <input
        type="number"
        value={seed}
        onChange={handleSeedChange}
        className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Enter seed"
      />
      <input
        type="number"
        step="0.1"
        value={reviews}
        onChange={handleReviewsChange}
        className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Avg reviews per book"
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="rating" className="text-sm font-medium text-gray-700">
          Rating (0 to 10)
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={likes}
          onChange={handleLikesChange}
          className="w-full h-2 bg-blue-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
        <span className="text-sm text-gray-600">{likes}</span>
      </div>
      <button
        onClick={handleExportCSV}
        className="flex bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Export to CSV
      </button>
      <button
        onClick={handleNewSeed}
        className="flex bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        <FaRandom />
      </button>
    </div>
  );
};

export default Header;
