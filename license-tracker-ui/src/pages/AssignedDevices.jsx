import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

export default function AssignedDevices() {
  const { licenseKey } = useParams();
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [utilization, setUtilization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [licenseKey]);

  async function loadData() {
    try {
      const [devicesRes, utilRes] = await Promise.all([
//         axiosInstance.get(`/licenses/${licenseKey}/devices`),
axiosInstance.get(`/assignments/license/${licenseKey}`),

        axiosInstance.get(`/utilization/${licenseKey}`),
      ]);

      setDevices(devicesRes.data || []);
      setUtilization(utilRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load assigned devices");
    } finally {
      setLoading(false);
    }
  }

  function statusBadge(status) {
    if (status.includes("RED"))
      return "bg-red-100 text-red-700";
    if (status.includes("YELLOW"))
      return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  }

  if (loading) {
    return <div className="p-8">Loading assigned devices…</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          License Utilization – {licenseKey}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* UTILIZATION SUMMARY */}
      {utilization && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Summary label="Software" value={utilization.softwareName} />
          <Summary label="Used" value={utilization.used} />
          <Summary label="Total" value={utilization.total} />
          <Summary
            label="Usage %"
            value={`${utilization.percentage.toFixed(1)}%`}
          />
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded text-sm font-semibold ${statusBadge(
                utilization.status
              )}`}
            >
              {utilization.status}
            </span>
          </div>
        </div>
      )}

      {/* ASSIGNED DEVICES TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Device ID</th>
              <th className="p-3 text-left">Assigned On</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No devices assigned to this license
                </td>
              </tr>
            ) : (
              devices.map((d) => (
                <tr key={d.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium">{d.deviceId}</td>
                  <td className="p-3">
                    {d.assignedOn
                      ? new Date(d.assignedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        d.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.active ? "ACTIVE" : "REVOKED"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Summary({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value ?? "-"}</p>
    </div>
  );
}
