import React, { useState } from "react";
import { FcComments, FcFullTrash, FcEditImage } from "react-icons/fc"; // Icons
import { useDispatch } from "react-redux";
import { useRemoveBook } from "../redux/slices/booksSlice"; // Action to remove the book

const BookRow = ({ book }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false); // To track if the book row is expanded
  const handleRemove = () => {
    dispatch(useRemoveBook(book.isbn)); // Remove book by ISBN
  };

  // Handle fractional reviews
  const fractionalReviews =
    book.reviews === 0.5 ? "1 review per 2 books" : `${book.reviews} reviews`;

  // Toggle expansion of the book details
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
      {/* Book Information */}
      <div className="flex-1">
        <p className="text-lg font-semibold">{book.title}</p>
        <p className="text-sm text-gray-500">by {book.author}</p>
        <p className="text-xs text-gray-400">{book.publisher}</p>
        <p className="text-xs text-gray-300">ISBN: {book.isbn}</p>
        <p className="text-xs text-gray-300">{fractionalReviews}</p>{" "}
        {/* Reviews info */}
        {/* Expand/Collapse Button */}
        <button
          className="text-sm text-blue-500 hover:underline mt-2"
          onClick={toggleExpand}
        >
          {isExpanded ? "Collapse Details" : "View Details"}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          className="flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
          title="Comments"
        >
          <FcComments size={20} />
        </button>
        <button
          className="flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
          title="Remove"
          onClick={handleRemove}
        >
          <FcFullTrash size={20} />
        </button>
        <button
          className="flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
          title="Edit"
        >
          <FcEditImage size={20} />
        </button>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="mt-4 space-y-2">
          {/* Add the book's cover image */}
          <div className="flex justify-center">
            <img
              src={book.coverImage}
              alt={`${book.title} cover`}
              className="w-32 h-48 object-cover rounded-lg"
            />
          </div>

          {/* Book Reviews (fake reviews) */}
          <div className="text-sm text-gray-500">
            <p className="font-semibold">Reviews:</p>
            <ul>
              <li>"A wonderful read!" - Reviewer 1</li>
              <li>"A captivating story, would recommend." - Reviewer 2</li>
              <li>"Not my favorite, but well-written." - Reviewer 3</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRow;
