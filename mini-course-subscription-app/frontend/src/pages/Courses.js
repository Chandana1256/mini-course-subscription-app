import "./Courses.css";

function Courses({ courses, onSelect }) {
  return (
    <div className="courses-list">
      <h3>Courses</h3>

      {courses.map(course => (
        <div key={course.id} className="course-item">
          <div>
            <strong>{course.title}</strong>
            <p className="course-desc">{course.description}</p>
          </div>

          <button
            className="view-btn"
            onClick={() => onSelect(course)}
          >
            Click
          </button>
        </div>
      ))}
    </div>
  );
}

export default Courses;
