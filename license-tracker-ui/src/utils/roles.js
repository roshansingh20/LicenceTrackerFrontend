export const ROLES = {
  ADMIN: "ADMIN",
  NETWORK_ADMIN: "NETWORK_ADMIN",
  PROCUREMENT: "PROCUREMENT",
  COMPLIANCE: "COMPLIANCE",
  AUDITOR: "AUDITOR",
};

export const getRole = () => localStorage.getItem("role");

export const hasRole = (...allowed) => {
  const role = getRole();
  return allowed.includes(role);
};
