// backend/seedCourses.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/Course");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("MongoDB connected");

  const courses = [
    { title: "React for Beginners", description: "Learn React from scratch", price: 500 },
    { title: "JavaScript Mastery", description: "Advanced JS concepts", price: 0 },
    { title: "Full-Stack Web Development", description: "React + Node.js + MongoDB", price: 1000 },
  ];

  await Course.deleteMany({});      // optional: clears old courses
  await Course.insertMany(courses); // insert new courses
  console.log("Courses seeded successfully");

  mongoose.disconnect();
});
