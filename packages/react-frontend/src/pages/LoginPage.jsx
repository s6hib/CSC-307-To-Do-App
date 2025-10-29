// src/pages/LoginPage.jsx
import "../css/LoginPage.css";
import React, { useState } from "react";
function LoginPage(props) {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  function login() {
    props.handleSubmit(user);
    setUser({username: "", password: ""})

  }
  return (
    <>
      <div className="loginpage-login-container">
        <div className="loginpage-username-password">
          <p>username: </p>
          <input type="text" className="loginpage-input" />
        </div>
        <div className="loginpage-username-password">
          <p>password: </p>
          <input type="text" className="loginpage-input" />
        </div>
        <div className="loginpage-login-box">
          <p>login</p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
