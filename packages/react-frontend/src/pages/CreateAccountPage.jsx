import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/LoginPage.css";

function CreateAccount() {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(
        data.message || data.error || "Signup failed"
      );
      return;
    }

    console.log("Account created");
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginpage-login-container">
        <div className="loginpage-username-password">
          <p>username: </p>
          <input
            type="text"
            className="loginpage-input"
            value={user.username}
            onChange={(e) =>
              setUser({ ...user, username: e.target.value })
            }
          />
        </div>
        <div className="loginpage-username-password">
          <p>password: </p>
          <input
            type="password"
            className="loginpage-input"
            value={user.password}
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
          />
        </div>
        <div className="loginpage-buttons">
          <button type="submit" className="loginpage-button">
            add account
          </button>
        </div>
      </div>
    </form>
  );
}

export default CreateAccount;
