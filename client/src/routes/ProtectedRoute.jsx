import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function tokenValid(storageKey) {
  const t = localStorage.getItem(storageKey);
  if (!t) return false;
  try {
    const { exp } = jwtDecode(t);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function UserProtectedRoute() {
  return tokenValid("token") ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminProtectedRoute() {
  return tokenValid("adminToken") ? <Outlet /> : <Navigate to="/login" replace />;
}
