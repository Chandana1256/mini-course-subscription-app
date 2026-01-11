import { useEffect, useState } from "react";
import API from "../api";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await API.get("/subscribe/my-courses");
        setCourses(res.data);
      } catch (err) {
        console.error("MyCourses error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        courses.map((c) => <div key={c._id}>{c.title}</div>)
      )}
    </div>
  );
}

export default MyCourses;
