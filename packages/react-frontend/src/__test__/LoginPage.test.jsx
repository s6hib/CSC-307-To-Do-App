import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import App from "../App.jsx";

const renderApp = (route = "/login") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

test("login page layout", () => {
  renderApp();
  expect(screen.getByText(/username/i)).toBeInTheDocument();
  expect(screen.getByText(/password/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /login/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/create account/i)
  ).toBeInTheDocument();
});

test("type in input", async () => {
  const user = userEvent.setup();
  renderApp();
  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  await user.type(usernameInput, "sean");
  await user.type(passwordInput, "seansean");
  expect(usernameInput).toHaveValue("sean");
  expect(passwordInput).toHaveValue("seansean");
});

test("reroute to create account page", async () => {
  const user = userEvent.setup();
  renderApp();
  await user.click(screen.getByText(/create account/i));
  expect(
    await screen.findByText(/add account/i)
  ).toBeInTheDocument();
});
