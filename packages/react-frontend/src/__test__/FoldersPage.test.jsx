import {
  render,
  screen,
  waitFor
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import FoldersPage from "../pages/FoldersPage.jsx";

const renderApp = (route = "/folders") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/folders" element={<FoldersPage />} />
      </Routes>
    </MemoryRouter>
  );
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(window, "confirm").mockReturnValue(true);
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

// test("unauthorized user is sent to login", async () => {
//   //ok: false
//   fetch.mockResolvedValueOnce({
//     ok: false,
//     json: async () => ({})
//   });
//   renderApp();

//   //expects to go back to the login page
//   expect(
//     await screen.findByText(/login page/i)
//   ).toBeInTheDocument();
// });

test("shows loading state before folders load", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });
  renderApp();

  await waitFor(() =>
    expect(
      screen.queryByText(/loading folders.../i)
    ).not.toBeInTheDocument()
  );
});

test("folder page layout", async () => {
  renderApp();
  //main screen (not including navbar)
  expect(await screen.findByText(/adder/i)).toBeInTheDocument();
  expect(
    screen.getByText(/a to-do lissst/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/to-do folders/i)
  ).toBeInTheDocument();
});

test("click create new folder", async () => {
  const user = userEvent.setup();
  renderApp();

  //waits until it finds the button
  const newFolder = await screen.findByText(/new folder/i);
  expect(newFolder).toBeInTheDocument();
  await user.click(newFolder);

  //form that appears
  expect(
    screen.getByText(/create new folder/i)
  ).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(/folder name/i)
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /\+ create/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /cancel/i })
  ).toBeInTheDocument();
});

test("click cancel", async () => {
  const user = userEvent.setup();
  renderApp();

  //waits until it finds the button
  await user.click(await screen.findByText(/new folder/i));

  //clicks cancel
  await user.click(
    screen.getByRole("button", { name: /cancel/i })
  );
  expect(
    screen.queryByText(/create new folder/i)
  ).not.toBeInTheDocument();
  expect(screen.getByText(/new folder/i)).toBeInTheDocument();
});

test("type in input", async () => {
  const user = userEvent.setup();
  renderApp();

  //waits until it finds the button
  const newFolder = await screen.findByText(/new folder/i);
  expect(newFolder).toBeInTheDocument();
  await user.click(newFolder);

  const folderNameInput =
    screen.getByPlaceholderText(/folder name/i);
  await user.type(folderNameInput, "folder");
  expect(folderNameInput).toHaveValue("folder");
});

test("fetch folders", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { _id: "1", name: "CSC 307", color: "#ffffff" },
      { _id: "2", name: "CSC 308", color: "#ffffff" }
    ]
  });
  renderApp();
  const folder1 = await screen.findByText(/csc 307/i);
  const folder2 = await screen.findByText(/csc 308/i);

  expect(folder1).toBeInTheDocument();
  expect(folder2).toBeInTheDocument();
});

test("folder name is empty", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });
  renderApp();
  await user.click(await screen.findByText(/new folder/i));
  //making sure the form is empty
  const empty = screen.getByPlaceholderText(/folder name/i);
  expect(empty).toHaveValue("");
  fetch.mockClear();

  await user.click(screen.getByText(/\+ create/i));
  expect(fetch).not.toHaveBeenCalled();
});

test("create and delete folder", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });
  //mock create folder
  fetch.mockResolvedValueOnce({
    status: 201,
    json: async () => ({
      _id: "1",
      name: "test",
      color: "#a8d5a8"
    })
  });
  //mock delete folder
  fetch.mockResolvedValueOnce({
    status: 204,
    text: async () => ""
  });
  renderApp();
  await user.click(await screen.findByText(/new folder/i));
  //creating a folder
  const form = screen.getByPlaceholderText(/folder name/i);
  await user.type(form, "test");
  await user.click(screen.getByText(/\+ create/i));
  //did it make a POST request?
  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/folders",
    expect.objectContaining({
      method: "POST"
    })
  );

  expect(await screen.findByText(/test/i)).toBeInTheDocument();

  //delete folder
  const deleteButton = await screen.findByRole("button", {
    name: "×"
  });
  await user.click(deleteButton);
  expect(fetch).toHaveBeenLastCalledWith(
    "https://adder-backend.azurewebsites.net/api/folders/1",
    expect.objectContaining({
      method: "DELETE"
    })
  );
  await screen.findByText(/to-do folders/i);
  expect(screen.queryByText("test")).not.toBeInTheDocument();
});

test("fail to create", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });
  //mock delete folder
  fetch.mockResolvedValueOnce({
    status: 400,
    text: async () => ({ error: "Bad request" })
  });
  //spy on the console for error messages
  const consoleSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});
  renderApp();
  await user.click(await screen.findByText(/new folder/i));
  //creating a folder
  const form = screen.getByPlaceholderText(/folder name/i);
  await user.type(form, "test");
  await user.click(screen.getByText(/\+ create/i));

  expect(consoleSpy).toHaveBeenCalledWith(
    "Failed to create folder"
  );
  consoleSpy.mockRestore();
});

test("does not delete folder if user cancels", async () => {
  const user = userEvent.setup();
  //mock user clicking cancel when prompted to delete
  window.confirm.mockReturnValueOnce(false);
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { _id: "1", name: "test", color: "#ffffff" }
    ]
  });
  renderApp();

  const deleteButton = await screen.findByRole("button", {
    name: "×"
  });

  fetch.mockClear();
  await user.click(deleteButton);
  //check if they were prompted with "delete this folder?"
  expect(window.confirm).toHaveBeenCalled();
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByText("test")).toBeInTheDocument();
});

test("open folder", async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        _id: "1",
        name: "test",
        color: "#ffffff"
      }
    ]
  });
  renderApp();
  const folder = await screen.findByText(/test/i);
  await user.click(folder);

  expect(mockNavigate).toHaveBeenCalledWith("/folders/1/tasks");
});
