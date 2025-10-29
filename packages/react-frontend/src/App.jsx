import { Routes, Route } from "react-router-dom";

import "./css/App.css";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import FoldersPage from "./pages/FoldersPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/folders" element={<FoldersPage />} />
    </Routes>
  );
}

export default App;
