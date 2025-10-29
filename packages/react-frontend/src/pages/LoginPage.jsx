import { Link } from "react-router-dom";

import "../css/LoginPage.css";

function LoginPage() {
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
        <div className="loginpage-buttons">
          <button className="loginpage-button">login</button>
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
