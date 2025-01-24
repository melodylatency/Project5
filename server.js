import express from "express";
import dotenv from "dotenv";
import path from "path";
import faker from "faker";
import seedrandom from "seedrandom";

dotenv.config();

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 5000;

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API running...");
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
