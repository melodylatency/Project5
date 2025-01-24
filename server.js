import express from "express";
import dotenv from "dotenv";
import faker from "faker";
import seedrandom from "seedrandom";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Generate random books based on user input
// Adjust the number of books generated per page to 10
function generateBooks(language, seed, page, reviewCount) {
  const rng = seedrandom(`${language}-${seed}-${page}`);
  const books = [];

  for (let i = 0; i < 10; i++) {
    // Fractional review logic
    const bookReviews =
      rng() < reviewCount ? Math.ceil(rng() * reviewCount) : 0;

    const book = {
      index: i + 1 + (page - 1) * 10,
      isbn: faker.datatype.uuid(),
      title: faker.lorem.words(3),
      author: faker.name.findName(),
      language: language,
      publisher: faker.company.companyName(),
      reviews: bookReviews,
      coverImage: faker.image.imageUrl(),
    };
    books.push(book);
  }

  return books;
}

// API route to get book data
app.get("/api/books", (req, res) => {
  const { language, seed, page, reviewCount } = req.query;

  if (!language || !seed || !page || !reviewCount) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const books = generateBooks(language, seed, page, reviewCount);
  res.json(books);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
