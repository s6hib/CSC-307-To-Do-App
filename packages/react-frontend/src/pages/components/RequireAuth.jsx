import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useToast } from "./ToastProvider.jsx";

export default function RequireAuth() {
  const { show } = useToast();
  const [state, setState] = useState({
    loading: true,
    ok: false
  });
  const warned = useRef(false);

  useEffect(() => {
    fetch("/api/auth/status", { credentials: "include" })
      .then((r) => setState({ loading: false, ok: r.ok }))
      .catch(() => setState({ loading: false, ok: false }));
  }, []);

  useEffect(() => {
    if (!state.loading && !state.ok && !warned.current) {
      warned.current = true;
      show("You need to log in");
    }
  }, [state.loading, state.ok, show]);

  if (state.loading) return null;
  return state.ok ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ msg: "You need to log in" }}
    />
  );
}
