import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

export default function DeviceDetails() {
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
    const res = await axiosInstance.get("/devices");
    const found = res.data.find(d => d.deviceId === deviceId);
    if (found) {
      setDevice(found);
      setLifecycle(found.status);
    }
  }

  async function updateLifecycle() {
    try {
      await axiosInstance.put(`/devices/${deviceId}`, {
        ...device,
        status: lifecycle
      });

      setMessage("Device updated successfully");

      if (lifecycle === "DECOMMISSIONED") {
        setTimeout(() => navigate("/devices"), 1500);
      }
    } catch {
      setMessage("Failed to update device");
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Device Details</h1>

        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* ================= DEVICE INFO ================= */}
      <div className="bg-white rounded shadow p-6 mb-6 grid grid-cols-2 gap-4">
        <Detail label="Device ID" value={device.deviceId} />
        <Detail label="IP Address" value={device.ipAddress} />
        <Detail label="Type" value={device.type} />
        <Detail label="Location" value={device.location} />
        <Detail label="Vendor" value={device.vendor} />
        <Detail label="Model" value={device.model} />
        <Detail label="Lifecycle Status" value={device.status} />
      </div>

      {/* ================= SOFTWARE ================= */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Software Version
        </h2>

        <p>
          <strong>Installed:</strong>{" "}
          {device.softwareName} {device.installedVersion}
        </p>

        <p>
          <strong>Latest Vendor Version:</strong>{" "}
          {device.latestVersion}
        </p>

        <p className="mt-2">
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
        </p>
      </div>

      {/* ================= LIFECYCLE ================= */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Lifecycle Management
        </h2>

        <label className="block text-sm font-medium mb-1">
          Lifecycle Stage
        </label>
        <select
          value={lifecycle}
          onChange={(e) => setLifecycle(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
          <option value="OBSOLETE">OBSOLETE</option>
          <option value="DECOMMISSIONED">DECOMMISSIONED</option>
        </select>

        <label className="block text-sm font-medium mb-1">
          Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          rows="3"
        />

        <div className="flex gap-3">
          <button
            onClick={updateLifecycle}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Update Status
          </button>

          {/* 🔚 CLOSE */}
          <button
            onClick={() => navigate("/devices")}
            className="bg-gray-200 px-6 py-2 rounded"
          >
            Close
          </button>
        </div>

        {message && (
          <div className="mt-3 text-sm text-green-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */
function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
