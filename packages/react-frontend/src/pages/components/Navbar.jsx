import { Link, useNavigate } from "react-router-dom";

import "../../css/Navbar.css";
import logo from "../../assets/adderlogo.png";

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
            <h1>To-Do App</h1>
            <img
              src={logo}
              alt="Adder logo"
              className="navbar-logo"
            />
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
    </>
  );
}
