import {
  render,
  screen,
  waitFor
} from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import {
  ToastProvider,
  useToast
} from "../pages/components/ToastProvider.jsx";

function TestComponent() {
  const { show } = useToast();
  //creates button when clicked shows toast
  return (
    <button onClick={() => show("toast test", "success", 4000)}>
      Show toast
    </button>
  );
}

//wraps input with ToastProvider so that there will be no errors/warnings
//doing it differently since it's a component not a page
const renderWithToastProvider = (input) =>
  render(<ToastProvider>{input}</ToastProvider>);

test("toast is empty", () => {
  renderWithToastProvider(<div>test</div>);

  expect(screen.getByText("test")).toBeInTheDocument();

  //toast has a role="status"
  const wrap = screen.getByRole("status");
  expect(wrap).toBeInTheDocument();
  expect(wrap).toBeEmptyDOMElement();
});

test("show toast", async () => {
  renderWithToastProvider(<TestComponent />);

  // click the button that calls show("Hello toast", "success")
  const user = userEvent.setup();
  await user.click(screen.getByText("Show toast"));
  const toast = screen.getByText("toast test");
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveClass("toast");
  expect(toast).toHaveClass("success");
});

test("toast diasappears after 4s", async () => {
  jest.useFakeTimers();
  const user = userEvent.setup({
    advanceTimers: (ms) => jest.advanceTimersByTime(ms)
  });
  renderWithToastProvider(<TestComponent />);

  await user.click(screen.getByText("Show toast"));
  const toast = screen.getByText("toast test");
  expect(toast).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(4000);
  });

  await waitFor(() => {
    //toast disappears
    expect(
      screen.queryByText("Hello toast")
    ).not.toBeInTheDocument();
  });
});
