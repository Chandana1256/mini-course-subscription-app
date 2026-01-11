const express = require("express");
const router = express.Router();
const User = require("../models/User"); // make sure this path is correct

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  // Temporary: just echo back to confirm route works
  console.log("Login body:", req.body);
  res.json({ msg: "Login route working", email, password });
});

module.exports = router;
