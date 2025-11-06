import { Link } from "react-router-dom";
import logo from "../../adderlogo.png";
import "../css/MainPage.css";

function MainPage() {
  return (
    <>
      <div className="mainpage-heading-container">
        <h1 className="mainpage-header">adder</h1>
        <p className="mainpage-subheading">a TO-DO lissst</p>
      </div>

      <div className="mainpage-logo-container">
        <img src={logo} alt="Adder logo" className="mainpage-logo" />
      </div>
      <Link to="/login" className="mainpage-button">
        login
      </Link>
    </>
  );
}

export default MainPage;
