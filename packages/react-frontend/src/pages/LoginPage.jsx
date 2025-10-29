import { Link } from "react-router-dom";
import { useState } from "react";

import "../css/LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    });
    const text = await res.text();
    console.log("Raw response text:", text);
    console.log("Status code:", res.status);

    if (!res.ok) {
      setError("Invalid username or password");
      return;
    }

    const data = JSON.parse(text);
    localStorage.setItem("token", data.token);

    if (!data.user) {
      console.error("❌ No user returned from backend");
      alert("Login failed: No user info received");
      return;
    }
  };

  return (
    <>
      <div className="loginpage-login-container">
        <form onSubmit={handleSubmit}>
          <div className="loginpage-username-password">
            <p>username: </p>
            <input
              type="text"
              className="loginpage-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="loginpage-username-password">
            <p>password: </p>
            <input
              type="password"
              className="loginpage-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
        <div className="loginpage-buttons">
          <button type="submit" className="loginpage-button">
            login
          </button>
          <Link
            to="/createaccount"
            className="loginpage-button"
          >
            create account
          </Link>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
