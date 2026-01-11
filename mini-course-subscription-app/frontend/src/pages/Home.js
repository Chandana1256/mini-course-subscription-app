import React, { useEffect, useState } from "react";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError("Could not load courses. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: "20px", fontSize: "18px" }}>Loading courses...</p>;
  if (error) return <p style={{ padding: "20px", color: "red", fontSize: "18px" }}>{error}</p>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", width: "100%" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "30px", textAlign: "left", fontWeight: "700" }}>My Courses</h1>

      {courses.length === 0 ? (
        <p style={{ fontSize: "18px", color: "#666" }}>No courses available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {courses.map((course, index) => (
            <li
              key={course._id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                padding: "25px 20px",
                marginBottom: "20px",
                borderRadius: "12px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                width: "100%",
              }}
            >
              {/* Number circle */}
              <div
                style={{
                  minWidth: "40px",
                  minHeight: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "700",
                  fontSize: "18px",
                }}
              >
                {index + 1}
              </div>

              {/* Course info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "22px", fontWeight: "700", color: "#333" }}>{course.title}</span>
                <span
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    backgroundColor: course.type === "FREE" ? "#4CAF50" : "#FF9800",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "14px",
                    width: "fit-content",
                  }}
                >
                  {course.type}
                </span>
                <span style={{ fontSize: "18px", fontWeight: "500", color: "#555" }}>
                  {course.price === 0 ? "FREE" : `₹${course.price}`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
