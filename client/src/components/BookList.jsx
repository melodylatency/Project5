import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { addBooks } from "../redux/slices/booksSlice";
import Header from "./Header";

const BookList = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const dispatch = useDispatch();

  // Fetch books using useSelector and ensure it's always an array
  const books = useSelector((state) => state.books.books || []); // Use a default empty array if undefined
  const [page, setPage] = useState(1); // Local state for pagination

  // Function to handle page scrolling and load more books
  const fetchNextPage = () => {
    // Simulating fetching additional books for the next page
    setPage((prevPage) => prevPage + 1);

    // Example additional books payload (replace with API call if needed)
    const newBooks = [
      {
        isbn: `isbn-${page + 1}-1`,
        title: `Book ${page + 1}-1`,
        author: `Author ${page + 1}-1`,
        publisher: `Publisher ${page + 1}-1`,
        coverImage: "https://via.placeholder.com/150",
      },
      {
        isbn: `isbn-${page + 1}-2`,
        title: `Book ${page + 1}-2`,
        author: `Author ${page + 1}-2`,
        publisher: `Publisher ${page + 1}-2`,
        coverImage: "https://via.placeholder.com/150",
      },
    ];

    // Dispatch the new books to Redux store
    dispatch(addBooks(newBooks));
  };

  // Toggle the expanded state for a row
  const toggleExpand = (isbn) => {
    setExpandedRows((prev) => ({
      ...prev,
      [isbn]: !prev[isbn],
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controls Section */}
      <Header />
      {/* Books Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <InfiniteScroll
          dataLength={books.length}
          next={fetchNextPage}
          hasMore={books.length < 100} // Arbitrary limit for demonstration
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
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book, index) => (
                <React.Fragment key={book.isbn}>
                  <tr
                    onClick={() => toggleExpand(book.isbn)}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.isbn}</td>
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2">{book.publisher}</td>
                    <td className="px-4 py-2 flex items-center space-x-2"></td>
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
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default BookList;
