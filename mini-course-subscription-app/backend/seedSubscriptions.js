require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Course = require("./models/Course");
const Subscription = require("./models/Subscription");

async function seedSubscription() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 2️⃣ Find existing user (must match MongoDB exactly)
    const user = await User.findOne({ email: "test2@test.com" });
    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }

    // 3️⃣ Find any existing course
    const course = await Course.findOne();
    if (!course) {
      console.log("❌ Course not found");
      process.exit(1);
    }

    // 4️⃣ Prevent duplicate subscription
    const alreadySubscribed = await Subscription.findOne({
      userId: user._id,
      courseId: course._id
    });

    if (alreadySubscribed) {
      console.log("⚠️ Subscription already exists");
      process.exit(0);
    }

    // 5️⃣ Create subscription (pricePaid REQUIRED)
    const subscription = new Subscription({
      userId: user._id,
      courseId: course._id,
      pricePaid: course.price
    });

    await subscription.save();

    console.log("✅ Subscription created successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error creating subscription:", error.message);
    process.exit(1);
  }
}

seedSubscription();
