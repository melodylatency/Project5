const express = require("express");
const path = require("path");
const faker = require("faker");
const seedrandom = require("seedrandom");
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the React app (for production)
app.use(express.static(path.join(__dirname, "build")));

// Generate random books based on user input (seed, likes, reviews, page)
function generateBooks(seed, page, likesPerBook, reviewsPerBook) {
  const rng = seedrandom(seed + page); // Combine seed and page to ensure consistency
  const books = [];

  for (let i = 0; i < 20; i++) {
    const book = {
      index: i + 1,
      isbn: faker.random.uuid(),
      title: faker.lorem.words(3),
      author: faker.name.findName(),
      publisher: faker.company.companyName(),
      likes: Math.floor(rng() * likesPerBook),
      reviews: Math.floor(rng() * reviewsPerBook),
      coverImage: faker.image.imageUrl(),
    };
    books.push(book);
  }

  return books;
}

// API route to get book data (data generation happens here)
app.get("/api/books", (req, res) => {
  const { seed, page, likesPerBook, reviewsPerBook } = req.query;

  if (!seed || !page || !likesPerBook || !reviewsPerBook) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const books = generateBooks(seed, page, likesPerBook, reviewsPerBook);
  res.json(books);
});

// Serve the React app for any other routes (this serves the React front-end)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
