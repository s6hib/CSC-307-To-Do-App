import { Link } from "react-router-dom";

import "../css/MainPage.css";

function MainPage() {
  return (
    <>
      <div className="mainpage-heading-container">
        <h1 className="mainpage-header">adder</h1>
        <p className="mainpage-subheading">a TO-DO lissst</p>
      </div>

      <Link to="/login" className="mainpage-login-box">
        login
      </Link>
    </>
  );
}

export default MainPage;
