import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/LoginPage.css";
import { useToast } from "./components/ToastProvider.jsx";

function CreateAccount() {
  const { show } = useToast();
  const [user, setUser] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Following checkpoints are created for frontend test cases testing purposes and is replicated in the backend too
    const { username, password } = user;
    if (!username && !password) {
      show("Username and password is required");
      return;
    }
    if (!username) {
      show("Username is required");
      return;
    }
    if (!password) {
      show("Password is required");
      return;
    }
    if (password.length < 6) {
      show("Password must be at least 6 characters");
      return;
    }

    const res = await fetch(
      //"https://adder-backend.azurewebsites.net/api/signup",
      "/api/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user)
      }
    );

    if (!res.ok) {
      const data = await res.json();
      const err = data.error || data.message || "Signup failed";
      show(err);
      return;
    }

    show("Account created", "success");
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginpage-login-container">
        <div className="loginpage-username-password">
          <p>username: </p>
          <input
            type="text"
            aria-label="username"
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
            aria-label="password"
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
