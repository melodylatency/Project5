import express from "express";
import dotenv from "dotenv";
import faker from "faker";
import seedrandom from "seedrandom";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Generate random books based on user input
function generateBooks(language, seed, page, reviewCount) {
  const rng = seedrandom(`${language}-${seed}-${page}`); // Combine parameters for consistent results
  const books = [];

  for (let i = 0; i < 20; i++) {
    const book = {
      index: i + 1,
      isbn: faker.random.uuid(),
      title: faker.lorem.words(3),
      author: faker.name.findName(),
      language: language,
      publisher: faker.company.companyName(),
      reviews: Math.floor(rng() * reviewCount),
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
