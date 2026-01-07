/* ================= AUTH HELPERS ================= */

/**
 * Check if user is logged in
 * (JWT present in localStorage)
 */
export const isLoggedIn = () => {
  return Boolean(localStorage.getItem("token"));
};

/**
 * Get logged-in user role
 */
export const getUserRole = () => {
  return localStorage.getItem("role"); // ADMIN, NETWORK_ADMIN, etc
};

/**
 * Logout user safely
 * Clears all auth-related data
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  // Hard redirect to clear React state
  window.location.href = "/login";
};
