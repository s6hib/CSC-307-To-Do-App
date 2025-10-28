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
        <div className="loginpage-login-box">
          <p>login</p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
