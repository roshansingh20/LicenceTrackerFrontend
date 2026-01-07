import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

export default function DeviceSoftware() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [lifecycle, setLifecycle] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDevice();
  }, []);

  async function loadDevice() {
    const res = await axiosInstance.get(`/devices`);
    const found = res.data.find(d => d.deviceId === deviceId);
    if (found) {
      setDevice(found);
      setLifecycle(found.status);
    }
  }

  async function saveLifecycle() {
    try {
      await axiosInstance.put(`/devices/${deviceId}`, {
        ...device,
        status: lifecycle
      });

      setMessage("Lifecycle updated successfully");

      // UX: if decommissioned → redirect
      if (lifecycle === "DECOMMISSIONED") {
        setTimeout(() => navigate("/devices"), 1500);
      }
    } catch {
      setMessage("Failed to update lifecycle");
    }
  }

  if (!device) {
    return <div className="p-8">Loading...</div>;
  }

  const outdated =
    device.installedVersion &&
    device.latestVersion &&
    device.installedVersion !== device.latestVersion;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Software & Lifecycle View
      </h1>

      <div className="bg-white rounded shadow p-6 space-y-4">

        <div>
          <strong>Device:</strong> {device.deviceId}
        </div>

        <div>
          <strong>Installed Software:</strong>{" "}
          {device.softwareName} {device.installedVersion}
        </div>

        <div>
          <strong>Latest Vendor Version:</strong>{" "}
          {device.latestVersion}
        </div>

        <div>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-sm ${
              outdated
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {outdated ? "OUTDATED" : "UP TO DATE"}
          </span>
        </div>

        <hr />

        <div>
          <label className="block text-sm font-medium mb-1">
            Lifecycle Stage
          </label>
          <select
            value={lifecycle}
            onChange={(e) => setLifecycle(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="OBSOLETE">OBSOLETE</option>
            <option value="DECOMMISSIONED">DECOMMISSIONED</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-2 rounded w-full"
            rows="3"
          />
        </div>

        <button
          onClick={saveLifecycle}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Update Status
        </button>

        {message && (
          <div className="text-sm text-green-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
