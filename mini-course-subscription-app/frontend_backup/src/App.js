import React, { useState } from "react";
import axios from "axios";

function App() {
  const [step, setStep] = useState("signup"); // "signup", "login", "courses"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountPrice, setDiscountPrice] = useState(null);

  const [myCourses, setMyCourses] = useState([]);

  // ---------------- SIGNUP ----------------
  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5001/signup", {
        email,
        password,
      });
      setMessage(res.data.msg);
      setStep("login");
      setPassword("");
    } catch (err) {
      if (err.response?.data?.msg === "User exists") {
        setMessage("User exists. Please login.");
        setStep("login");
      } else {
        setMessage("Network or server error");
      }
    }
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5001/login", {
        email,
        password,
      });
      setMessage(res.data.msg);
      setStep("courses");
      fetchCourses();
      fetchMyCourses();
    } catch (err) {
      setMessage("Invalid credentials or server error");
    }
  };

  // ---------------- FETCH COURSES ----------------
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5001/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/my-courses/${email}`);
      setMyCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- SELECT COURSE ----------------
  const handleSelectCourse = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5001/courses/${id}`);
      setSelectedCourse(res.data);
      setPromoCode("");
      setPromoApplied(false);
      setDiscountPrice(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- APPLY PROMO ----------------
  const handleApplyPromo = () => {
    if (promoCode === "BFSALE25") {
      const discounted = Math.round(selectedCourse.price / 2);
      setDiscountPrice(discounted);
      setPromoApplied(true);
      setMessage("Promo applied successfully");
    } else {
      setPromoApplied(false);
      setDiscountPrice(null);
      setMessage("Invalid promo code");
    }
  };

  // ---------------- SUBSCRIBE ----------------
  const handleSubscribe = async () => {
    try {
      const body = { email };
      if (selectedCourse.price > 0) {
        body.promoCode = promoCode;
      }

      const res = await axios.post(
        `http://localhost:5001/subscribe/${selectedCourse.id}`,
        body
      );

      alert(`Subscribed successfully. Price paid: ₹${res.data.pricePaid}`);
      fetchMyCourses();
    } catch (err) {
      alert("Subscription failed");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Mini Course App</h1>

      {/* SIGNUP */}
      {step === "signup" && (
        <>
          <h2>Signup</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <button onClick={handleSignup}>Signup</button>
          <p>{message}</p>
        </>
      )}

      {/* LOGIN */}
      {step === "login" && (
        <>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <button onClick={handleLogin}>Login</button>
          <p>{message}</p>
        </>
      )}

      {/* COURSES */}
      {step === "courses" && (
        <>
          <h2>Courses</h2>
          <ul>
            {courses.map((c) => (
              <li key={c.id} style={{ marginBottom: 10 }}>
                <b>{c.title}</b> - {c.description}
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => handleSelectCourse(c.id)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>

          {/* COURSE DETAILS */}
          {selectedCourse && (
            <div style={{ border: "1px solid #ccc", padding: 15 }}>
              <h3>{selectedCourse.title}</h3>
              <p>{selectedCourse.description}</p>
              <p>
                Price:{" "}
                {selectedCourse.price === 0
                  ? "FREE"
                  : `₹${selectedCourse.price}`}
              </p>

              {selectedCourse.price > 0 && (
                <>
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={handleApplyPromo}>Apply Promo</button>

                  {promoApplied && (
                    <p style={{ color: "green" }}>
                      Discount applied. Pay ₹{discountPrice}
                    </p>
                  )}
                </>
              )}

              <button
                onClick={handleSubscribe}
                disabled={selectedCourse.price > 0 && !promoApplied}
              >
                Subscribe
              </button>
            </div>
          )}

          {/* MY COURSES */}
          {myCourses.length > 0 && (
            <>
              <h2>My Courses</h2>
              <ul>
                {myCourses.map((c, i) => (
                  <li key={i}>
                    {c.title} – Paid ₹{c.pricePaid} – {c.date}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
