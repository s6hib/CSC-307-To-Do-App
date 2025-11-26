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
        <Route
          path="/folders"
          element={<div>Folders page</div>}
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

test("click back to folders", async () => {
  mockId123();
  const user = userEvent.setup();
  await screen.findByText(/csc 307/i);
  await user.click(
    screen.getByRole("button", { name: /← back to folders/i })
  );

  expect(
    await screen.findByText(/folders page/i)
  ).toBeInTheDocument();
});

test("add new task", async () => {
  const user = userEvent.setup();
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ _id: "123", name: "CSC 307" }]
    })
    //POST method when addTask() is called
    .mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        _id: "123",
        task: "Testing",
        date: "2025-12-13",
        done: false
      })
    });
  renderFolderTasks();
  await screen.findByText(/csc 307/i);
  await user.type(
    screen.getByLabelText(/task description/i),
    "Testing"
  );
  await user.type(screen.getByLabelText(/date/i), "2025-12-13");
  await user.click(
    screen.getByRole("button", { name: /\+ add task/i })
  );

  expect(
    await screen.findByText(/testing/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/done/i)).toBeInTheDocument();
  expect(screen.getByText("Task")).toBeInTheDocument();
  expect(screen.getByText(/due date/i)).toBeInTheDocument();
  expect(screen.getByText(/actions/i)).toBeInTheDocument();
});
