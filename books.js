const express = require("express");
const prisma = require("./prisma"); // Assuming your prisma client is in ./prisma
const router = express.Router();
// Get all books
router.get("/api/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: { author: true, publisher: true, genres: true, reviews: true },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Error fetching books" });
  }
});

// Get a specific book by ID
router.get("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: { author: true, publisher: true, genres: true, reviews: true },
    });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching book" });
  }
});

// Create a new book
router.post("/api/books", async (req, res) => {
  const { title, published, authorId, publisherId, genreIds } = req.body;
  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        published,
        author: { connect: { id: authorId } },
        publisher: { connect: { id: publisherId } },
        genres: { connect: genreIds.map((id) => ({ id })) },
      },
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Error creating book" });
  }
});

// Update a book
router.put("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, published, authorId, publisherId, genreIds } = req.body;
  try {
    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        published,
        author: { connect: { id: authorId } },
        publisher: { connect: { id: publisherId } },
        genres: { set: genreIds.map((id) => ({ id })) },
      },
    });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Error updating book" });
  }
});

// Delete a book
router.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting book" });
  }
});

module.exports = router;
