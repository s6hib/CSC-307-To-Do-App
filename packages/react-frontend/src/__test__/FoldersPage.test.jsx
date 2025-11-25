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
const user = userEvent.setup();

test("login page layout", () => {
  renderApp();
  expect(screen.getByText(/adder/i)).toBeInTheDocument();
  expect(
    screen.getByText(/a To-DO lissst/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/to-do folders/i)
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /login/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/create account/i)
  ).toBeInTheDocument();
});
