import { Routes, Route, Outlet } from "react-router-dom";

import "./css/App.css";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import FoldersPage from "./pages/FoldersPage.jsx";
import Navbar from "./pages/components/Navbar.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import DeletedTasksPage from "./pages/DeletedTasksPage.jsx";

function WithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/createaccount"
        element={<CreateAccountPage />}
      />
      <Route element={<WithNavbar />}>
        <Route path="/folders" element={<FoldersPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route
          path="/deleted-tasks"
          element={<DeletedTasksPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
