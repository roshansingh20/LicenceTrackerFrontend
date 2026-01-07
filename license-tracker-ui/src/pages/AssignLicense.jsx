import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function AssignLicense() {
  const [devices, setDevices] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [deviceId, setDeviceId] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");

  /* ================= LOAD ON PAGE OPEN ================= */
  useEffect(() => {
    loadDevices();
    loadLicenses();
    loadAllAssignments(); // ✅ THIS WAS MISSING
  }, []);

  /* ================= FILTER WHEN DEVICE CHANGES ================= */
  useEffect(() => {
    if (!deviceId) {
      setFiltered(assignments);
    } else {
      setFiltered(
        assignments.filter(a => a.deviceId === deviceId)
      );
    }
  }, [deviceId, assignments]);

  /* ================= API CALLS ================= */

  async function loadDevices() {
    const res = await axiosInstance.get("/devices");
    setDevices(res.data);
  }

  async function loadLicenses() {
    const res = await axiosInstance.get("/licenses");
    setLicenses(res.data);
  }

  async function loadAllAssignments() {
    const res = await axiosInstance.get("/assignments");
    setAssignments(res.data);
    setFiltered(res.data);
  }

  async function assignLicense() {
    setError("");

    if (!deviceId || !licenseKey) {
      setError("Please select device and license");
      return;
    }

    try {
      await axiosInstance.post("/assignments", {
        deviceId,
        licenseKey,
      });

      // ✅ refresh list after assignment
      await loadAllAssignments();
      setLicenseKey("");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Assignment failed (max usage / duplicate)";
      setError(msg);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Assign License</h1>

      {/* ASSIGN FORM */}
      <div className="bg-white p-6 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="border p-2 rounded"
          value={deviceId}
          onChange={e => setDeviceId(e.target.value)}
        >
          <option value="">Select Device</option>
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.deviceId}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={licenseKey}
          onChange={e => setLicenseKey(e.target.value)}
        >
          <option value="">Select License</option>
          {licenses.map(l => (
            <option key={l.licenseKey} value={l.licenseKey}>
              {l.licenseKey} ({l.softwareName})
            </option>
          ))}
        </select>

        <button
          onClick={assignLicense}
          className="bg-indigo-600 text-white rounded px-6 py-2 hover:bg-indigo-700"
        >
          Assign
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* ASSIGNED LICENSES */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Assigned Licenses</h2>

        {filtered.length === 0 ? (
          <p className="text-gray-500">No licenses assigned</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Device</th>
                <th className="p-3 text-left">License</th>
                <th className="p-3 text-left">Software</th>
                <th className="p-3 text-left">Assigned On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.deviceId}</td>
                  <td className="p-3">{a.licenseKey}</td>
                  <td className="p-3">{a.softwareName}</td>
                  <td className="p-3">
                    {new Date(a.assignedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
