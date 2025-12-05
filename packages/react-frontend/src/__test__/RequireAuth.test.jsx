import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "../pages/components/RequireAuth.jsx";

//mock toast
const mockShow = jest.fn();
jest.mock("../pages/components/ToastProvider.jsx", () => ({
  useToast: () => ({ show: mockShow })
}));

//mock rerouting
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

const renderWithRoutes = () =>
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route
            path="/protected"
            element={<div>protected content</div>}
          />
        </Route>
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

test("placeholder", async () => {});

test("nothing is loaded", () => {
  global.fetch.mockReturnValue(new Promise(() => {}));
  renderWithRoutes();
  //shouldn't have access to protected content
  expect(
    screen.queryByText(/protected content/i)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(/login page/i)
  ).not.toBeInTheDocument();
  expect(mockShow).not.toHaveBeenCalled();
});

test("authorized", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true
  });

  renderWithRoutes();
  //should be able to see protected content
  expect(
    await screen.findByText(/protected content/i)
  ).toBeInTheDocument();

  expect(
    screen.queryByText(/login page/i)
  ).not.toBeInTheDocument();
});

test("unauthorized", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false
  });

  renderWithRoutes();
  expect(
    await screen.findByText(/login page/i)
  ).toBeInTheDocument();

  expect(
    screen.queryByText(/protected content/i)
  ).not.toBeInTheDocument();
  //authentication needed
  expect(mockShow).toHaveBeenCalledWith("You need to log in");
});
