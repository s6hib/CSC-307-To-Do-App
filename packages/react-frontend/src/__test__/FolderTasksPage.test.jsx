import {
  render,
  screen,
  waitFor
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import FolderTasksPage from "../pages/FolderTasksPage.jsx";

//since we rendered FolderTasksPage directly, we have to put ToastProvider around it
const mockShow = jest.fn();
jest.mock("../pages/components/ToastProvider.jsx", () => ({
  useToast: () => ({ show: mockShow })
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
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
beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

//created some mock Ids for convenience
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

test("status 500", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: async () => ({})
  });
  const errorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});
  renderFolderTasks();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
  expect(errorSpy).toHaveBeenCalled();
  expect(errorSpy.mock.calls[0][0]).toBe("Fetch error:");
  errorSpy.mockRestore();
});

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

test("create task", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ _id: "123", name: "CSC 307" }]
  });
  fetch.mockResolvedValueOnce({
    status: 201,
    json: async () => ({
      _id: "1",
      task: "test",
      date: "2025-01-01",
      done: false,
      folder: "123"
    })
  });
  renderFolderTasks();

  await screen.findByText(/csc 307/i);
  await user.type(
    screen.getByLabelText(/task description/i),
    "test"
  );
  await user.type(screen.getByLabelText(/date/i), "2025-01-01");
  await user.click(
    screen.getByRole("button", {
      name: /\+ add task/i
    })
  );
  //check if POST method called
  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/tasks",
    expect.objectContaining({
      method: "POST",
      credentials: "include"
    })
  );

  expect(await screen.findByText(/test/i)).toBeInTheDocument();
  expect(
    screen.getByLabelText(/task description/i)
  ).toHaveValue("");
  expect(screen.getByLabelText(/date/i)).toHaveValue("");
  //toast success message
  expect(mockShow).toHaveBeenCalledWith(
    "Task created",
    "success"
  );
});

test("failed to create task", async () => {
  const user = userEvent.setup();
  window.alert = jest.fn();
  mockId123();
  await screen.findByText(/csc 307/i);
  const addButton = screen.getByRole("button", {
    name: /\+ add task/i
  });
  await user.click(addButton);

  expect(window.alert).toHaveBeenCalledWith(
    "Please enter both task description and date"
  );
  expect(fetch).toHaveBeenCalledTimes(2);
});

test("mark task done", async () => {
  const user = userEvent.setup();
  const task = {
    _id: "1",
    task: "test",
    date: "2025-01-01T00:00:00.000Z",
    done: false
  };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [task]
  });
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ _id: "123", name: "CSC 307" }]
  });
  fetch.mockResolvedValueOnce({
    status: 200,
    json: async () => ({ ...task, done: true })
  });
  renderFolderTasks();
  await screen.findByText(/test/i);
  //see if task is marked done already
  const checkbox = screen.getByRole("checkbox");
  expect(checkbox).not.toBeChecked();
  await user.click(checkbox);
  //check if PUT method was made
  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/tasks/1",
    expect.objectContaining({
      method: "PUT"
    })
  );
  //ensure the task is marked done
  await waitFor(() => {
    expect(checkbox).toBeChecked();
  });
});

test("delete task", async () => {
  const user = userEvent.setup();
  const task = {
    _id: "1",
    task: "test",
    date: "2025-01-01T00:00:00.000Z",
    done: false
  };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [task]
  });
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ _id: "123", name: "CSC 307" }]
  });
  fetch.mockResolvedValueOnce({
    status: 204,
    json: async () => ""
  });
  renderFolderTasks();

  expect(await screen.findByText(/test/i));
  const deleteButton = screen.getByRole("button", {
    name: "Delete"
  });
  await user.click(deleteButton);
  //ensure DELETE method was called
  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/tasks/1",
    expect.objectContaining({
      method: "DELETE"
    })
  );

  await waitFor(() => {
    expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
  });

  expect(mockShow).toHaveBeenCalledWith(
    "Task deleted",
    "success"
  );
});

test("delete task", async () => {
  const user = userEvent.setup();
  window.prompt = jest.fn().mockReturnValue("test2");
  const task = {
    _id: "1",
    task: "test",
    date: "2025-01-01T00:00:00.000Z",
    done: false
  };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [task]
  });
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ _id: "123", name: "CSC 307" }]
  });
  fetch.mockResolvedValueOnce({
    status: 200,
    json: async () => ({ ...task, task: "test2" })
  });
  renderFolderTasks();

  expect(await screen.findByText(/test/i)).toBeInTheDocument();

  const taskRow = await screen.findByText(/test/i);
  await user.click(taskRow);
  expect(window.prompt).toHaveBeenCalledWith(
    "Edit task:",
    "test"
  );
  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/tasks/1",
    expect.objectContaining({
      method: "PUT"
    })
  );

  expect(await screen.findByText(/test2/i)).toBeInTheDocument();
  expect(mockShow).toHaveBeenCalledWith(
    "Task updated",
    "success"
  );
});
