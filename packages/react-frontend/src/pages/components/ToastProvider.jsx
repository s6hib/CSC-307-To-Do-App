import {
  createContext,
  useCallback,
  useContext,
  useState
} from "react";
import "../../css/Toast.css";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback(
    (message, type = "error", ms = 4000) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== id)),
        ms
      );
    },
    []
  );
  return (
    <>
      <div
        className="toast-wrap"
        role="status"
        aria-live="assertive"
      >
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
      <ToastCtx.Provider value={{ show }}>
        {children}
      </ToastCtx.Provider>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastCtx);
  if (!context)
    throw new Error(
      "useToast must be used inside <ToastProvider>"
    );
  return context;
}
