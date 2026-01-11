const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const Subscription = require("../models/Subscription");

router.get("/my-courses", authMiddleware, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user.id
    }).populate("courseId");

    const courses = subscriptions.map(sub => sub.courseId);

    res.json(courses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
