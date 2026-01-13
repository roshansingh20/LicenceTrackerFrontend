import { getUserRole, logout } from "../utils/auth";

export default function Topbar() {
  const role = getUserRole();

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white text-gray-800 shadow">
      <span className="font-semibold text-lg">
        License Tracker
      </span>

      <div className="flex items-center gap-4">
        {/* ROLE BADGE */}
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
          Logged in as {role}
        </span>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
