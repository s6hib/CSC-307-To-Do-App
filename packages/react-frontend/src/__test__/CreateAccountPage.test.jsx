import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import App from "../App.jsx";

const renderApp = (route = "/createaccount") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
const user = userEvent.setup();

test("signup page layout", () => {
  renderApp();
  expect(screen.getByText(/username/i)).toBeInTheDocument();
  expect(screen.getByText(/password/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /add account/i })
  ).toBeInTheDocument();
});

test("type in input", async () => {
  renderApp();
  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  await user.type(usernameInput, "sean");
  await user.type(passwordInput, "seansean");
  expect(usernameInput).toHaveValue("sean");
  expect(passwordInput).toHaveValue("seansean");
});
