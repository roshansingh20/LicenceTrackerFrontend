const TOKEN_KEY = "token";

/* ================= TOKEN ================= */

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
}

/* ================= AUTH ================= */

export function isAuthenticated() {
  return !!getToken();
}

/* ================= ROLE ================= */

export function getUserRole() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (e) {
    console.error("Invalid token");
    return null;
  }
}

/* ================= LOGOUT ================= */

export function logout() {
  clearAuth();
  window.location.href = "/login";
}
