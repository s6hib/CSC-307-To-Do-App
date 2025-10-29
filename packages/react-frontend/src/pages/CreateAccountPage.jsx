import "../css/LoginPage.css";

function CreateAccount() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
  };

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
          <button className="loginpage-button">
            add account
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateAccount;
