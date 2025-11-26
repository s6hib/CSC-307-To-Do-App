import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import App from "../App.jsx";

const renderApp = (route = "/folders") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

test("unauthorized user is sent to login", async () => {
  //ok: false
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({})
  });
  renderApp();

  //expects to go back to the login page
  expect(
    await screen.findByRole("button", { name: /login/i })
  ).toBeInTheDocument();
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
