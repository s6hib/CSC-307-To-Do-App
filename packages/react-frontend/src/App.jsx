import { Routes, Route } from "react-router-dom";

import "./css/App.css";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/createaccount"
        element={<CreateAccountPage />}
      />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
