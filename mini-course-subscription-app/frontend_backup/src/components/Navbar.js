import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
      <Link to="/signup" style={{ marginRight: "10px" }}>Signup</Link>
      <Link to="/my-courses">My Courses</Link>
    </nav>
  );
}

export default Navbar;
