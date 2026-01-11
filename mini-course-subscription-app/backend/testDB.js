const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connection is successful!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:");
    console.error(err.message);
    process.exit(1);
  });
