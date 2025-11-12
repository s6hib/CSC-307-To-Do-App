import { Routes, Route } from "react-router-dom";

import "./css/App.css";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FoldersPage from "./pages/FoldersPage.jsx";
import FolderTasksPage from "./pages/FolderTasksPage.jsx"; 
import DeletedTasksPage from "./pages/DeletedTasksPage.jsx";

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
      <Route path="/folders" element={<FoldersPage />} />
      <Route path="/folders/:folderId/tasks" element={<FolderTasksPage />} />
      <Route path="/deleted-tasks" element={<DeletedTasksPage />} />
    </Routes>
  );
}

export default App;