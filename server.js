const express = require("express");
const app = express();

app.use(express.json());

// Import and use the routes
app.use("/authors", require("./authors"));
app.use("/books", require("./books"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
