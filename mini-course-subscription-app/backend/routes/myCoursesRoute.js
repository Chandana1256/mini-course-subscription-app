const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Course = require("../models/Course");

router.get("/my-courses", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
