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

function generateBooks(language, seed, page, reviewCount) {
  const rng = seedrandom(`${language}-${seed}-${page}`);
  const books = [];

  setFakerLocale(language);

  for (let i = 0; i < 10; i++) {
    const bookReviews =
      reviewCount > 0 ? generateReviewCount(reviewCount, rng) : 0;

    const reviews = Array.from({ length: bookReviews }, () => ({
      reviewer: API.person.fullName(),
      text: API.word.words({ count: { min: 5, max: 10 } }),
    }));

    const book = {
      index: i + 1 + (page - 1) * 10,
      isbn: API.string.uuid(),
      title: API.commerce.productName(),
      author: API.person.fullName(),
      publisher: API.company.name(),
      reviews,
      coverImage: API.image.urlPicsumPhotos(),
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

  const books = generateBooks(
    language,
    seed,
    parseInt(page),
    parseFloat(reviewCount)
  );
  res.json(books);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
