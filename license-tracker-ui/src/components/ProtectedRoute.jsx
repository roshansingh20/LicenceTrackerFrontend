import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

export default function ProtectedRoute({ children, roles }) {

  /* 🔐 Not logged in */
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  /* 🔒 Role check */
  if (roles && !roles.includes(getUserRole())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
