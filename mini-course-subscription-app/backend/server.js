const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const net = require("net");

const app = express();
const JWT_SECRET = "mysecretkey"; // for assessment only


/* ----------------- MIDDLEWARE ----------------- */
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(express.json());

/* ----------------- USERS ----------------- */
const users = [];

/* -------- SIGNUP (PASSWORD HASHED) -------- */
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ msg: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      email,
      password: hashedPassword
    });

    console.log("USERS ARRAY:", users);

    res.json({ msg: "Signup successful", email });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* -------- LOGIN (BCRYPT COMPARE) -------- */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: user.email },
      JWT_SECRET,
      {expiresIn: "1h"}
    );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    res.json({ msg: "Login successful", email: user.email });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- COURSES ----------------- */
const courses = [
  { id: 1, title: "React for Beginners", description: "Learn React step by step", price: 0, image: "" },
  { id: 2, title: "Node.js Basics", description: "Learn backend with Node.js", price: 499, image: "" },
  { id: 3, title: "MongoDB Fundamentals", description: "Learn NoSQL database", price: 299, image: "" }
];

const subscriptions = [];

/* -------- GET ALL COURSES -------- */
app.get("/courses", (req, res) => {
  res.json(courses);
});

/* -------- GET COURSE BY ID -------- */
app.get("/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ msg: "Course not found" });
  }
  res.json(course);
});

/* -------- SUBSCRIBE TO COURSE -------- */
app.post("/subscribe/:id", (req, res) => {
  const { email, promoCode } = req.body;

  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ msg: "Course not found" });
  }

  if (subscriptions.find(s => s.email === email && s.courseId === course.id)) {
    return res.status(400).json({ msg: "Already subscribed" });
  }

  let pricePaid = course.price;

  if (course.price > 0 && promoCode === "BFSALE25") {
    pricePaid = Math.round(course.price / 2);
  }

  if (course.price > 0 && promoCode && promoCode !== "BFSALE25") {
    return res.status(400).json({ msg: "Invalid promo code" });
  }

  subscriptions.push({
    email,
    courseId: course.id,
    pricePaid,
    date: new Date().toLocaleDateString()
  });

  res.json({
    msg: "Subscription successful",
    courseId: course.id,
    pricePaid
  });
});

/* -------- MY COURSES -------- */
app.get("/my-courses/:email", (req, res) => {
  const userSubs = subscriptions
    .filter(s => s.email === req.params.email)
    .map(s => {
      const course = courses.find(c => c.id === s.courseId);
      return {
        title: course.title,
        pricePaid: s.pricePaid,
        date: s.date,
        image: course.image
      };
    });

  res.json(userSubs);
});

/* ----------------- SERVER PORT ----------------- */
const DEFAULT_PORT = 5001;

function findFreePort(port, callback) {
  const server = net.createServer();
  server.listen(port, () => {
    server.once("close", () => callback(port));
    server.close();
  });
  server.on("error", () => findFreePort(port + 1, callback));
}

findFreePort(DEFAULT_PORT, (port) => {
  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
});