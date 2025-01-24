import React from "react";

const BookGallery = ({ books }) => {
  return (
    <div className="gallery">
      {books.map((book) => (
        <div key={book.isbn} className="card">
          <img src={book.coverImage} alt={book.title} />
          <div className="card-info">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGallery;
