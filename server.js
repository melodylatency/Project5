import express from "express";
import dotenv from "dotenv";
import faker from "faker";
import seedrandom from "seedrandom";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure faker's locale dynamically based on language
function setFakerLocale(language) {
  switch (language) {
    case "de":
      faker.locale = "de";
      break;
    case "fr":
      faker.locale = "fr";
      break;
    default:
      faker.locale = "en";
  }
}

// Generate random books based on user input
function generateBooks(language, seed, page, reviewCount) {
  const rng = seedrandom(`${language}-${seed}-${page}`);
  const books = [];

  // Set faker locale based on selected language
  setFakerLocale(language);

  for (let i = 0; i < 10; i++) {
    const bookReviews =
      rng() < reviewCount ? Math.ceil(rng() * reviewCount) : 0;

    const book = {
      index: i + 1 + (page - 1) * 10,
      isbn: faker.datatype.uuid(),
      title: faker.commerce.productName(), // Replace this with localized logic if needed
      author: faker.name.findName(),
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
