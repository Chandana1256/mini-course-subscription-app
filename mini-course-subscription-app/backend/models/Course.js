const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Course", courseSchema);
