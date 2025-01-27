import express from "express";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker"; // Use @faker-js/faker
import { fakerRU } from "@faker-js/faker";
import { fakerFR } from "@faker-js/faker";
import seedrandom from "seedrandom";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let API = faker;

// Configure faker's locale dynamically based on language
function setFakerLocale(language) {
  switch (language) {
    case "ru":
      API = fakerRU; // Change locale directly
      break;
    case "fr":
      API = fakerFR; // Change locale directly
      break;
    default:
      API = faker; // Default to English
  }
}

function generateReviewCount(reviewCount, rng) {
  const baseReviews = Math.floor(reviewCount); // Base number of reviews
  const fractionalPart = reviewCount - baseReviews; // Fractional part

  // Determine whether to add +1 review based on the fractional part
  const hasExtraReview = rng() < fractionalPart ? 1 : 0;

  return baseReviews + hasExtraReview;
}

function generateLikeCount(likes, rng) {
  const baseLikes = Math.floor(likes); // Base number of reviews
  const fractionalPart = likes - baseLikes; // Fractional part

  // Determine whether to add +1 review based on the fractional part
  const hasExtraLike = rng() < fractionalPart ? 1 : 0;

  return baseLikes + hasExtraLike;
}

function generateBooks(language, seed, page, reviewCount, likes) {
  const rng = seedrandom(seed + likes + reviewCount + page); // Use seedrandom for full control over randomness
  setFakerLocale(language);
  API.seed(seed + likes + reviewCount + page); // Ensure faker uses the same seed for internal randomness

  const booksPerPage = page === 1 ? 20 : 10; // First page: 20 books, others: 10

  const books = [];
  for (let i = 0; i < booksPerPage; i++) {
    const bookReviews =
      reviewCount > 0 ? generateReviewCount(reviewCount, rng) : 0;

    const bookLikes = likes > 0 ? generateLikeCount(likes, rng) : 0;

    const reviews = Array.from({ length: bookReviews }, () => ({
      reviewer: API.person.fullName(),
      text: API.git.commitMessage(),
    }));

    const book = {
      index: i + 1 + (page - 1) * booksPerPage,
      isbn: API.string.uuid(),
      title: API.commerce.productName(),
      author: API.person.fullName(),
      publisher: API.company.name(),
      reviews,
      bookLikes,
      coverImage: API.image.urlPicsumPhotos(),
    };
    books.push(book);
  }

  return books;
}

// API route to get book data
app.get("/api/books", (req, res) => {
  const { language, seed, page, reviewCount, likes } = req.query;

  if (!language || !seed || !page || !reviewCount || !likes) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const books = generateBooks(
    language,
    seed,
    parseInt(page),
    parseFloat(reviewCount),
    parseFloat(likes)
  );
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
