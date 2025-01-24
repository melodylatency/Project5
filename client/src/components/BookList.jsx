import React, { useState } from "react";
import { useGetBooksQuery } from "../redux/slices/booksApiSlice"; // assuming you have the API slice
import BookRow from "./BookRow"; // A component for rendering a single book
import InfiniteScroll from "react-infinite-scroll-component";
import Papa from "papaparse";

const BookList = ({ language, seed, likes, reviews }) => {
  const [page, setPage] = useState(1);
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

  const fetchNextPage = () => setPage((prev) => prev + 1);

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading books.</p>;

  return (
    <div>
      <button onClick={handleExportCSV}>Export to CSV</button>
      <InfiniteScroll
        dataLength={books.length}
        next={fetchNextPage}
        hasMore={true} // You can modify this based on API response
        loader={<h4>Loading...</h4>}
      >
        <table>
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
