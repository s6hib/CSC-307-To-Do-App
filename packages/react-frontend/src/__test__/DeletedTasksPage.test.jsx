import {
  render,
  screen,
  waitFor
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import DeletedTasksPage from "../pages/DeletedTasksPage.jsx";

const mockShow = jest.fn();
jest.mock("../pages/components/ToastProvider.jsx", () => ({
  useToast: () => ({ show: mockShow })
}));

const renderApp = (route = "/tasks/deleted") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/tasks/deleted"
          element={<DeletedTasksPage />}
        />
      </Routes>
    </MemoryRouter>
  );
beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

test("status 500", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: async () => ({})
  });
  const errorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});
  renderApp();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  expect(errorSpy).toHaveBeenCalled();
  expect(errorSpy.mock.calls[0][0]).toBe(
    "Fetch deleted tasks error: "
  );
  errorSpy.mockRestore();
});

test("deleted page layout", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });
  renderApp();
  expect(
    await screen.findByText(/deleted tasks/i)
  ).toBeInTheDocument();
  expect(screen.getByText("Task")).toBeInTheDocument();
  expect(screen.getByText(/date/i)).toBeInTheDocument();
  expect(screen.getByText(/actions/i)).toBeInTheDocument();
});

test("displays deleted tasks", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        _id: "1",
        task: "test",
        date: "2025-01-01T00:00:00.000Z"
      },
      {
        _id: "2",
        task: "test2",
        date: "2025-01-01T00:00:00.000Z"
      }
    ]
  });
  renderApp();

  expect(await screen.findByText("test")).toBeInTheDocument();
  expect(screen.getByText("test2")).toBeInTheDocument();

  const rows = screen.getAllByRole("row");
  expect(rows.length).toBe(3);
});

test("restore tasks", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        _id: "1",
        task: "test",
        date: "2025-01-01T00:00:00.000Z"
      }
    ]
  });
  fetch.mockResolvedValueOnce({
    status: 200,
    json: async () => ({})
  });
  renderApp();

  expect(await screen.findByText(/test/i)).toBeInTheDocument();

  const restoreButton = screen.getByRole("button", {
    name: /restore/i
  });
  await user.click(restoreButton);

  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/tasks/1/restore",
    expect.objectContaining({
      method: "POST",
      credentials: "include"
    })
  );
  //ensure task is now not in the document
  await waitFor(() => {
    expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
  });
  //check toast for popup success message
  expect(mockShow).toHaveBeenCalledWith(
    "Task restored",
    "success"
  );
});

test("fail to restore task", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        _id: "1",
        task: "test",
        date: "2025-01-01T00:00:00.000Z"
      }
    ]
  });
  fetch.mockResolvedValueOnce({
    status: 400,
    json: async () => ({ error: "Bad request" })
  });
  renderApp();

  expect(await screen.findByText(/test/i)).toBeInTheDocument();
  const restoreButton = screen.getByRole("button", {
    name: /restore/i
  });
  await user.click(restoreButton);

  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/tasks/1/restore",
    expect.objectContaining({ method: "POST" })
  );

  expect(screen.getByText(/test/i)).toBeInTheDocument();
});

test("hard delete tasks", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        _id: "1",
        task: "test",
        date: "2025-01-01T00:00:00.000Z"
      }
    ]
  });
  fetch.mockResolvedValueOnce({
    status: 204,
    json: async () => ({})
  });
  renderApp();

  expect(await screen.findByText(/test/i)).toBeInTheDocument();
  const deleteButton = screen.getByRole("button", {
    name: /delete/i
  });
  await user.click(deleteButton);

  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/tasks/1/remove",
    expect.objectContaining({
      method: "DELETE",
      credentials: "include"
    })
  );
  //ensure task is now not in the document
  await waitFor(() => {
    expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
  });
  //check toast for popup success message
  expect(mockShow).toHaveBeenCalledWith(
    "Task deleted!",
    "success"
  );
});

test("hard delete fail", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        _id: "1",
        task: "test",
        date: "2025-01-01T00:00:00.000Z"
      }
    ]
  });
  fetch.mockResolvedValueOnce({
    status: 500,
    json: async () => ({})
  });
  renderApp();

  expect(await screen.findByText(/test/i)).toBeInTheDocument();
  const deleteButton = screen.getByRole("button", {
    name: /delete/i
  });
  await user.click(deleteButton);

  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/tasks/1/remove",
    expect.objectContaining({
      method: "DELETE",
      credentials: "include"
    })
  );
  //ensure task is now not in the document
  await waitFor(() => {
    expect(screen.queryByText(/test/i)).toBeInTheDocument();
  });
});
