import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";

import "./css/App.css";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import FoldersPage from "./pages/FoldersPage.jsx";
import Navbar from "./pages/components/Navbar.jsx";
import FolderTasksPage from "./pages/FolderTasksPage.jsx";
import DeletedTasksPage from "./pages/DeletedTasksPage.jsx";
import RequireAuth from "./pages/components/RequireAuth.jsx";
import { ToastProvider } from "./pages/components/ToastProvider.jsx";

function WithNavbar() {
  return (
    <>
      <Navbar />
      <main className="with-navbar">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/createaccount"
          element={<CreateAccountPage />}
        />
        <Route element={<WithNavbar />}>
          <Route element={<RequireAuth />}>
            <Route path="/folders" element={<FoldersPage />} />
            <Route
              path="/folders/:folderId/tasks"
              element={<FolderTasksPage />}
            />
            <Route
              path="/deleted-tasks"
              element={<DeletedTasksPage />}
            />
          </Route>
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
