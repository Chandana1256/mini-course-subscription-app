const express = require("express");
const app = express();

// Test root route
app.get("/", (req, res) => {
  res.send("Server is running");  // <- this will appear in browser and curl
});

// Start server on port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
