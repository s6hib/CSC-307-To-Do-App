import { Routes, Route } from "react-router-dom";

import "./css/App.css";
import MainPage from "./pages/MainPage.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
