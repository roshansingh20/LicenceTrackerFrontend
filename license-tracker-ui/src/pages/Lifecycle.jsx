import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { hasRole } from "../utils/roles";

export default function Lifecycle() {
  const [records, setRecords] = useState([]);
  const [mode, setMode] = useState("LIST"); // LIST | ADD | EDIT
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLifecycle();
  }, []);

  async function loadLifecycle() {
    try {
      const res = await axiosInstance.get("/software/lifecycle");
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load software lifecycle");
    } finally {
      setLoading(false);
    }
  }

  /* ================= MODE VIEWS ================= */

  if (mode === "ADD") {
    return (
      <SoftwareForm
        onClose={() => setMode("LIST")}
        onSaved={loadLifecycle}
      />
    );
  }

  if (mode === "EDIT") {
    return (
      <SoftwareForm
        software={selected}
        onClose={() => setMode("LIST")}
        onSaved={loadLifecycle}
      />
    );
  }

  /* ================= LIST ================= */

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Software Lifecycle</h1>

        {(hasRole("ADMIN") ||
          hasRole("NETWORK_ADMIN") ||
          hasRole("NETWORK_ENGINEER")) && (
          <button
            onClick={() => {
              setSelected(null);
              setMode("ADD");
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded cursor-pointer"
          >
            + Add Software
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Device ID</th>
                <th className="p-3">Software</th>
                <th className="p-3">Installed</th>
                <th className="p-3">Latest</th>
                <th className="p-3">Status</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {records.map((s, i) => (
                <tr key={i} className="border-t hover:bg-slate-50">
                  <td className="p-3">{s.deviceId}</td>
                  <td className="p-3">{s.softwareName}</td>
                  <td className="p-3">{s.installedVersion}</td>
                  <td className="p-3">{s.latestVersion}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        s.status === "OUTDATED"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        s.severity === "WARNING"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {s.severity}
                    </span>
                  </td>

                  <td className="p-3 space-x-4">
                    {(hasRole("ADMIN") ||
                      hasRole("NETWORK_ADMIN") ||
                      hasRole("NETWORK_ENGINEER")) && (
                      <button
                        className="text-indigo-600 underline cursor-pointer"
                        onClick={() => {
                          setSelected({
                            deviceId: s.deviceId,
                            softwareName: s.softwareName,
                            installedVersion: s.installedVersion,
                            latestVersion: s.latestVersion,
                          });
                          setMode("EDIT");
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {records.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No software records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================= FORM ================= */

function SoftwareForm({ software, onClose, onSaved }) {
  const isEdit = Boolean(software);

  const [form, setForm] = useState(
    software || {
      deviceId: "",
      softwareName: "",
      installedVersion: "",
      latestVersion: "",
    }
  );

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    if (
      !form.deviceId ||
      !form.softwareName ||
      !form.installedVersion ||
      !form.latestVersion
    ) {
      alert("All fields are mandatory");
      return;
    }

    try {
      await axiosInstance.post("/software", {
        deviceId: form.deviceId,
        softwareName: form.softwareName,
        installedVersion: form.installedVersion,
        latestVersion: form.latestVersion,
      });

      await onSaved();
      onClose();
    } catch (e) {
      console.error(e);
      alert(e.response?.data || "Save failed");
    }
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Software Version" : "Add Software Version"}
      </h1>

      <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">
        <Input
          label="Device ID"
          name="deviceId"
          value={form.deviceId}
          onChange={update}
          disabled={isEdit}
        />

        <Input
          label="Software Name"
          name="softwareName"
          value={form.softwareName}
          onChange={update}
          disabled={isEdit}
        />

        <Input
          label="Installed Version"
          name="installedVersion"
          value={form.installedVersion}
          onChange={update}
        />

        <Input
          label="Latest Version"
          name="latestVersion"
          value={form.latestVersion}
          onChange={update}
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={save}
          className="bg-indigo-600 text-white px-6 py-2 rounded cursor-pointer"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="bg-gray-200 px-6 py-2 rounded cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...props} className="border p-2 rounded w-full" />
    </div>
  );
}
