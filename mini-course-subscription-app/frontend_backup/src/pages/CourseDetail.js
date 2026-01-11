import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseDetails from "./CourseDetails";

const CourseDetail = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [subscribedCourses, setSubscribedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all courses and user's subscribed courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // 1️⃣ Fetch all courses
        const resAll = await axios.get("/api/courses");
        setAllCourses(resAll.data);

        // 2️⃣ Fetch subscribed courses
        const token = localStorage.getItem("token");
        const resSubscribed = await axios.get("/api/subscribe/my-courses", {
          headers: { Authorization: "Bearer " + token },
        });
        setSubscribedCourses(resSubscribed.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Subscribe to a course
  const subscribeCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/subscribe",
        { courseId },
        { headers: { Authorization: "Bearer " + token } }
      );

      // Refresh subscribed courses
      const resSubscribed = await axios.get("/api/subscribe/my-courses", {
        headers: { Authorization: "Bearer " + token },
      });
      setSubscribedCourses(resSubscribed.data);
    } catch (err) {
      console.error("Subscription failed:", err);
      alert(err.response?.data?.message || "Subscription failed");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        padding: "20px",
      }}
    >
      {/* LEFT SIDE – COURSE LIST */}
      <div style={{ width: "35%" }}>
        <h2>Courses</h2>

        {allCourses.map((course) => {
          const isSubscribed = subscribedCourses.some(
            (sub) => sub._id === course._id
          );

          return (
            <div
              key={course._id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor:
                  selectedCourse?._id === course._id ? "#f1f5ff" : "#fff",
              }}
            >
              <div>
                <strong>{course.title}</strong>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    marginTop: "4px",
                  }}
                >
                  {course.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedCourse(course)}
                style={{
                  padding: "6px 14px",
                  cursor: "pointer",
                }}
              >
                Click
              </button>
            </div>
          );
        })}
      </div>

      {/* RIGHT SIDE – COURSE DETAILS */}
      <div style={{ width: "65%" }}>
        <CourseDetails course={selectedCourse} />

        {selectedCourse && (
          <div style={{ marginTop: "20px" }}>
            {!subscribedCourses.some(
              (sub) => sub._id === selectedCourse._id
            ) ? (
              <button
                onClick={() => subscribeCourse(selectedCourse._id)}
              >
                Subscribe
              </button>
            ) : (
              <span
                style={{
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                Subscribed
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
