import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { useGetBooksQuery } from "../redux/slices/booksApiSlice";
import { appendBooks, setPage } from "../redux/slices/booksSlice";

const BookList = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const { books, language, seed, page, reviews, likes } = useSelector(
    (state) => state.books
  );
  const dispatch = useDispatch();

  const {
    data: fetchedBooks,
    isLoading,
    error,
  } = useGetBooksQuery(
    { language, seed, page, reviewCount: reviews, likes },
    { skip: !page } // Prevent unnecessary fetch on initial render
  );

  // Append new books to the list when new data is fetched
  React.useEffect(() => {
    if (fetchedBooks && !isLoading) {
      dispatch(appendBooks(fetchedBooks));
    }
  }, [fetchedBooks, isLoading, dispatch]);

  const fetchMoreBooks = () => {
    dispatch(setPage(page + 1)); // Increment the page number
  };

  const toggleExpand = (isbn) => {
    setExpandedRows((prev) => ({
      ...prev,
      [isbn]: !prev[isbn],
    }));
  };

  if (error) return <p>Error loading books.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Books Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <InfiniteScroll
          dataLength={books.length}
          next={fetchMoreBooks}
          hasMore={books.length < 100} // Replace 100 with a dynamic condition if needed
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
                          <div className="flex flex-col">
                            <img
                              src={book.coverImage}
                              alt={`${book.title} cover`}
                              className="w-32 h-48 object-cover rounded-lg"
                            />
                            <span>Likes: {book.bookLikes}</span>
                          </div>
                          <div>
                            {book.reviews.length > 0 ? (
                              <ul className="list-disc pl-4 text-md text-gray-600">
                                {book.reviews.map((review, index) => (
                                  <li key={index}>
                                    <span className="font-medium">
                                      {review.reviewer}
                                    </span>
                                    : {review.text}{" "}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500 italic">
                                No reviews available.
                              </p>
                            )}
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
