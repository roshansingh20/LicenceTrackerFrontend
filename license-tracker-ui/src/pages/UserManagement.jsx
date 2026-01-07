import { useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function UserManagement() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    if (!form.name || !form.email || !form.password || !form.role) {
      alert("All fields are mandatory");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/users", form);

      alert("User created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="bg-white p-6 rounded shadow w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>

        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={update}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
          />

          <Select
            label="Role"
            name="role"
            value={form.role}
            onChange={update}
            options={[
              "ADMIN",
              "NETWORK_ADMIN",
              "NETWORK_ENGINEER",
              "OPERATION_MANAGER",
              "PROCUREMENT",
              "COMPLIANCE",
              "AUDITOR",
            ]}
          />
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={save}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save User"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        {...props}
        className="border p-2 rounded w-full"
      >
        <option value="">-- Select {label} --</option>
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
