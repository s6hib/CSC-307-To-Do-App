import { render, screen } from "@testing-library/react";
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
