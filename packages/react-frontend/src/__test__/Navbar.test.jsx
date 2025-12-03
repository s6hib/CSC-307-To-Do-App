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

test("nav bar layout", async () => {
  renderApp();
  expect(
    await screen.findByText(/to-do App/i)
  ).toBeInTheDocument();
  expect(
    screen.getByAltText(/adder logo/i)
  ).toBeInTheDocument();
  expect(
    screen.getByAltText(/trashcan logo/i)
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /logout/i })
  ).toBeInTheDocument();
});

test("reroute to deleted task page", async () => {
  const user = userEvent.setup();
  renderApp();
  await user.click(
    await screen.findByAltText(/trashcan logo/i)
  );
  expect(await screen.findByText(/deleted tasks/i));
});

test("click logout; reroute to login page", async () => {
  const user = userEvent.setup();
  renderApp();
  await user.click(
    await screen.findByRole("button", { name: /logout/i })
  );
  expect(await screen.findByText(/login/i));
});
