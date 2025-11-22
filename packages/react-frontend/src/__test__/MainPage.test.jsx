import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../App.jsx";

test("start page", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(
    screen.getByRole("heading", { name: /adder/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/a to-do lissst/i)
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /login/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("img")).toBeInTheDocument();
});
