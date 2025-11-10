import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // go back to login when u logout
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/folders">
          🗂️To-Do App
        </Link>
        {" | "}
        <Link to="/deleted-tasks">
          🗑️Deleted Tasks
        </Link>
      </div>
      <div>
        <Link to="/login">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </Link>
      </div>
    </nav>
  )
}
