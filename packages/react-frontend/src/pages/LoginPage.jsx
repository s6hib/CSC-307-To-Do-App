import { Link } from "react-router-dom";
import { useState } from "react";

import "../css/LoginPage.css";

function LoginPage() {
  return (
    <>
      <div className="loginpage-login-container">
        <div className="loginpage-username-password">
          <p>username: </p>
          <input
            type="text"
            className="loginpage-input"
            required
          />
        </div>
        <div className="loginpage-username-password">
          <p>password: </p>
          <input
            type="password"
            className="loginpage-input"
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
      </div>
    </>
  );
}

export default LoginPage;
