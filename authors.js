const express = require("express");
const prisma = require("./prisma"); // Assuming your prisma client is in ./prisma
const router = express.Router();

// Get all authors
router.get("/api/authors", async (req, res) => {
  try {
    const authors = await prisma.author.findMany();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching authors" });
  }
});

// Get a specific author by ID
router.get("/api/authors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const author = await prisma.author.findUnique({
      where: { id: Number(id) },
    });
    if (author) {
      res.json(author);
    } else {
      res.status(404).json({ error: "Author not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching author" });
  }
});

// Create a new author
router.post("/api/authors", async (req, res) => {
  const { name, bio } = req.body;
  try {
    const newAuthor = await prisma.author.create({
      data: { name, bio },
    });
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ error: "Error creating author" });
  }
});

// Update an author
router.put("/api/authors/:id", async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  try {
    const updatedAuthor = await prisma.author.update({
      where: { id: Number(id) },
      data: { name, bio },
    });
    res.json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ error: "Error updating author" });
  }
});

// Delete an author
router.delete("/api/authors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.author.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting author" });
  }
});

module.exports = router;
