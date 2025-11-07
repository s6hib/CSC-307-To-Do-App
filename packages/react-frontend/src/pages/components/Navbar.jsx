import { Link, useNavigate } from "react-router-dom";

import "../../css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // go back to login when u logout
  };

  return (
    <>
      <nav className="navbar">
        <div>
          <Link to="/folders" className="navbar-title">
            🗂️To-Do App
          </Link>
        </div>
        <div>
          <Link to="/login">
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </Link>
        </div>
      </nav>
      <h2 className="navbar-subheader">To-Do Folders</h2>
    </>
  );
}
