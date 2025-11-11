import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const [state, setState] = useState({
    loading: true,
    ok: false
  });

  useEffect(() => {
    fetch("/api/auth/status", { credentials: "include" })
      .then((r) => setState({ loading: false, ok: r.ok }))
      .catch(() => setState({ loading: false, ok: false }));
  }, []);

  if (state.loading) return null;
  return state.ok ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}
