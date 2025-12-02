import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import CreateAccountPage from "../pages/CreateAccountPage.jsx";

const mockShow = jest.fn();
jest.mock("../pages/components/ToastProvider.jsx", () => ({
  useToast: () => ({ show: mockShow })
}));

const renderApp = (route = "/createaccount") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/createaccount"
          element={<CreateAccountPage />}
        />
      </Routes>
    </MemoryRouter>
  );
beforeEach(() => {
  mockShow.mockClear();
});

test("signup page layout", () => {
  renderApp();
  expect(screen.getByText(/username/i)).toBeInTheDocument();
  expect(screen.getByText(/password/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /add account/i })
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

test("submit nothing gives error", async () => {
  const user = userEvent.setup();
  renderApp();
  const submitButton = screen.getByRole("button", {
    name: /add account/i
  });
  await user.click(submitButton);
  expect(mockShow).toHaveBeenCalledWith(
    "Username and password is required"
  );
});

test("submit no username gives error", async () => {
  const user = userEvent.setup();
  renderApp();
  await user.type(
    screen.getByLabelText(/password/i),
    "abcdefg"
  );
  const submitButton = screen.getByRole("button", {
    name: /add account/i
  });
  await user.click(submitButton);
  expect(mockShow).toHaveBeenCalledWith("Username is required");
});

test("submit no password gives error", async () => {
  const user = userEvent.setup();
  renderApp();
  await user.type(
    screen.getByLabelText(/username/i),
    "abcdefg"
  );
  const submitButton = screen.getByRole("button", {
    name: /add account/i
  });
  await user.click(submitButton);
  expect(mockShow).toHaveBeenCalledWith("Password is required");
});

test("submit password less than 6 characters gives error", async () => {
  const user = userEvent.setup();
  renderApp();
  await user.type(
    screen.getByLabelText(/username/i),
    "abcdefg"
  );
  await user.type(screen.getByLabelText(/password/i), "abcd");
  const submitButton = screen.getByRole("button", {
    name: /add account/i
  });
  await user.click(submitButton);
  expect(mockShow).toHaveBeenCalledWith(
    "Password must be at least 6 characters"
  );
});

test("submit taken username gives error", async () => {
  const user = userEvent.setup();
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: "Username already taken" })
  });
  renderApp();
  await user.type(screen.getByLabelText(/username/i), "sean");
  await user.type(
    screen.getByLabelText(/password/i),
    "abcdefg"
  );
  const submitButton = screen.getByRole("button", {
    name: /add account/i
  });
  await user.click(submitButton);
  expect(mockShow).toHaveBeenCalledWith(
    "Username already taken"
  );
});
