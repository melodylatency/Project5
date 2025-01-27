import express from "express";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { fakerRU } from "@faker-js/faker";
import { fakerNL } from "@faker-js/faker";
import seedrandom from "seedrandom";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

let API = faker;

function setFakerLocale(language) {
  switch (language) {
    case "ru":
      API = fakerRU;
      break;
    case "nl":
      API = fakerNL;
      break;
    default:
      API = faker;
  }
}

function generateReviewCount(reviewCount, rng) {
  const baseReviews = Math.floor(reviewCount);
  const fractionalPart = reviewCount - baseReviews;
  const hasExtraReview = rng() < fractionalPart ? 1 : 0;

  return baseReviews + hasExtraReview;
}

function generateLikeCount(likes, rng) {
  const baseLikes = Math.floor(likes);
  const fractionalPart = likes - baseLikes;
  const hasExtraLike = rng() < fractionalPart ? 1 : 0;

  return baseLikes + hasExtraLike;
}

function generateBooks(language, seed, page, reviewCount, likes) {
  const rng = seedrandom(seed + likes + reviewCount + page);
  setFakerLocale(language);
  API.seed(seed + likes + reviewCount + page);

  const booksPerPage = page === 1 ? 20 : 10;

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
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API running...");
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
