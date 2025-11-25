import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import FolderTasksPage from "../pages/FolderTasksPage.jsx";

//since we rendered FolderTasksPage directly, we have to put ToastProvider around it
jest.mock("../pages/components/ToastProvider.jsx", () => ({
  useToast: () => ({ show: jest.fn() })
}));

const renderFolderTasks = (route = "/folders/123") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/folders/:folderId"
          element={<FolderTasksPage />}
        />
      </Routes>
    </MemoryRouter>
  );

const mockId123 = () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ _id: "123", name: "CSC 307" }]
  });
  renderFolderTasks();
};

const mockId1234 = () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ _id: "1234", name: "CSC 307" }]
  });
  renderFolderTasks();
};

const user = userEvent.setup();

test("non-existing folder", async () => {
  //notice FolderTasksPage.jsx has two fetch requests.
  //fetch tasks in specific folder
  mockId1234();

  expect(
    await screen.findByRole("button", {
      name: /Back to Folders/i
    })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Folder not found/i)
  ).toBeInTheDocument();
});

test("empty folder", async () => {
  mockId123();

  expect(
    await screen.findByText(/CSC 307/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/No tasks yet. Add one below!/i)
  ).toBeInTheDocument();
});

test("task page layout", async () => {
  mockId123();
  expect(
    await screen.findByRole("button", {
      name: /Back to Folders/i
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: /closest date/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: /furthest date/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: /due today/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: /due tomorrow/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: /due this week/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: /all tasks/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: /overdue tasks/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/add new task/i)).toBeInTheDocument();
  expect(
    screen.getByLabelText(/task description/i)
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /add task/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: /view recently deleted/i
    })
  ).toBeInTheDocument();
});
