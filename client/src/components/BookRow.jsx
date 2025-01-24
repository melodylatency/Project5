import React from "react";
import { FcComments, FcFullTrash, FcEditImage } from "react-icons/fc"; // Icons
import { useDispatch } from "react-redux";
import { useRemoveBook } from "../redux/slices/booksSlice"; // Action to remove the book

const BookRow = ({ book }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(useRemoveBook(book.isbn)); // Remove book by ISBN
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
      {/* Book Information */}
      <div className="flex-1">
        <p className="text-lg font-semibold">{book.title}</p>
        <p className="text-sm text-gray-500">by {book.author}</p>
        <p className="text-xs text-gray-400">{book.publisher}</p>
        <p className="text-xs text-gray-300">ISBN: {book.isbn}</p>
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
    </div>
  );
};

export default BookRow;
