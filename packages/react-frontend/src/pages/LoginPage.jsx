import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import "../css/LoginPage.css";
function LoginPage() {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const login = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(user)
    });

    const text = await res.text();
    console.log("Raw response text: ", text);
    console.log("Status code: ", res.status);

    if (!res.ok) {
      throw new Error("Invalid username or password");
    }

    const data = JSON.parse(text);
    localStorage.setItem("token", data.token);

    if (!data.user) {
      console.error("No user returned from backend");
      alert("Login failed: No user info received");
      return;
    }

    setUser({ username: "", password: "" });
    navigate("/folders");
  };

  return (
    <>
      <div className="loginpage-login-container">
        <form onSubmit={login}>
          <div className="loginpage-username-password">
            <p>username: </p>
            <input
              type="text"
              name="username"
              className="loginpage-input"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="loginpage-username-password">
            <p>password: </p>
            <input
              type="password"
              name="password"
              className="loginpage-input"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
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
        </form>
      </div>
    </>
  );
}

export default LoginPage;
