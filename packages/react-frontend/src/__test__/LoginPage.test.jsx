import {
  render,
  screen,
  waitFor
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";

const mockShow = jest.fn();
jest.mock("../pages/components/ToastProvider.jsx", () => ({
  useToast: () => ({ show: mockShow })
}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

const renderLogin = (route = "/login") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/createaccount"
          element={<div>signup page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  //need to clear token
  localStorage.clear();
});

test("login page layout", () => {
  renderLogin();
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
  renderLogin();
  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  await user.type(usernameInput, "sean");
  await user.type(passwordInput, "seansean");
  expect(usernameInput).toHaveValue("sean");
  expect(passwordInput).toHaveValue("seansean");
});

test("reroute to create account page", async () => {
  const user = userEvent.setup();
  renderLogin();
  await user.click(screen.getByText(/create account/i));
  expect(
    await screen.findByText(/signup page/i)
  ).toBeInTheDocument();
});

test("login success", async () => {
  const user = userEvent.setup();
  renderLogin();
  const mockToken = {
    token: "token",
    user: { id: "1", username: "sean" }
  };
  global.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify(mockToken))
  });

  await user.type(screen.getByLabelText(/username/i), "sean");
  await user.type(
    screen.getByLabelText(/password/i),
    "seansean"
  );

  await user.click(
    screen.getByRole("button", { name: /login/i })
  );
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  expect(global.fetch).toHaveBeenCalledWith(
    "https://adder-backend.azurewebsites.net/api/login",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer null"
      },
      body: JSON.stringify({
        username: "sean",
        password: "seansean"
      })
    }
  );
  expect(localStorage.getItem("token")).toBe("token");

  // toast
  await waitFor(() => {
    expect(mockShow).toHaveBeenCalledWith(
      "Logged in successfully",
      "success"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/folders");
  });
});

test("fail to login", async () => {
  const user = userEvent.setup();
  renderLogin();
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status: 401,
    text: () => Promise.resolve("Unauthorized")
  });

  await user.type(screen.getByLabelText(/username/i), "sean");
  await user.type(screen.getByLabelText(/password/i), "sean");

  const loginButton = screen.getByRole("button", {
    name: /login/i
  });
  await user.click(loginButton);

  await waitFor(() => {
    expect(mockShow).toHaveBeenCalledWith(
      "Invalid username or password"
    );
  });
  //should not have navigated to folders page after failure
  expect(mockNavigate).not.toHaveBeenCalled();
});
