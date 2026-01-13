import { NavLink } from "react-router-dom";
import { getUserRole, logout } from "../utils/auth";

/* ================= ROLE AWARE NAV ================= */

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    roles: [
      "ADMIN",
      "NETWORK_ADMIN",
      "PROCUREMENT",
      "COMPLIANCE",
      "AUDITOR",
      "OPERATION_MANAGER",
      "NETWORK_ENGINEER",
    ],
  },
  {
    to: "/devices",
    label: "Devices",
    roles: ["ADMIN", "OPERATION_MANAGER"],
  },
  {
    to: "/licenses",
    label: "Licenses",
    roles: ["ADMIN", "PROCUREMENT", "COMPLIANCE"],
  },
  {
    to: "/users",
    label: "User Management",
    roles: ["ADMIN"],
  },
  {
    to: "/assign",
    label: "Assign License",
    roles: ["ADMIN", "NETWORK_ADMIN"],
  },
  {
    to: "/lifecycle",
    label: "Software Lifecycle",
    roles: ["ADMIN", "NETWORK_ENGINEER"],
  },
  {
    to: "/alerts",
    label: "Alerts",
    roles: ["ADMIN", "COMPLIANCE"],
  },
  {
    to: "/reports",
    label: "Reports",
    roles: ["ADMIN", "COMPLIANCE", "AUDITOR"],
  },
  {
    to: "/licenses/utilization",
    label: "License Utilization",
    roles: ["ADMIN", "COMPLIANCE", "PROCUREMENT"],
  },
  {
    to: "/audit",
    label: "Audit Logs",
    roles: ["ADMIN", "AUDITOR"],
  },
];

export default function Sidebar() {
  const role = getUserRole();

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-600 to-purple-700 text-white flex flex-col">
      {/* HEADER */}
      <div className="p-6 border-b border-white/20">
        <h1 className="text-xl font-bold">License Tracker</h1>
        <p className="text-sm opacity-80 mt-1">
          {role ? `Logged in as ${role}` : ""}
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="p-4 space-y-2 flex-1">
        {NAV_ITEMS.filter(item => item.roles.includes(role)).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition ${
                isActive
                  ? "bg-white text-indigo-700 font-semibold shadow"
                  : "hover:bg-white/20"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={logout}
          className="w-full px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition font-semibold cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
