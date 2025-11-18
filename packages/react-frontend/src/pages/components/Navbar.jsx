import { Link, useNavigate } from "react-router-dom";

import "../../css/Navbar.css";
import adderLogo from "../../assets/adderlogo.png";
import trashcanLogo from "../../assets/trashcan.png";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await fetch("https://adder-backend.azurewebsites.net/api/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch {
      return;
    }
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="navbar-left">
        <div>
          <Link to="/folders" className="navbar-title">
            <h1>To-Do App</h1>
            <img
              src={adderLogo}
              alt="Adder logo"
              className="navbar-logo"
            />
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/deleted-tasks">
            <img
              src={trashcanLogo}
              alt="Trashcan logo"
              className="navbar-trashcan"
            />
          </Link>
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
