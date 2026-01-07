import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

export default function AssignedDevices() {
  const { licenseKey } = useParams();
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [util, setUtil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [licenseKey]);

  async function load() {
    try {
      const [d, u] = await Promise.all([
        axiosInstance.get(`/licenses/${licenseKey}/devices`),
        axiosInstance.get(`/utilization/${licenseKey}`)
      ]);

      setDevices(d.data || []);
      setUtil(u.data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 underline"
      >
        ← Back
      </button>

      {/* UTILIZATION SUMMARY */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-2">
          License Utilization – {util.licenseKey}
        </h2>

        <div className="grid grid-cols-4 gap-4 text-sm">
          <Stat label="Software" value={util.softwareName} />
          <Stat label="Used" value={util.used} />
          <Stat label="Total" value={util.total} />
          <Stat
            label="Status"
            value={util.status}
            color={
              util.status.includes("RED")
                ? "text-red-600"
                : util.status.includes("YELLOW")
                ? "text-yellow-600"
                : "text-green-600"
            }
          />
        </div>
      </div>

      {/* ASSIGNED DEVICES */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Device ID</th>
              <th className="p-3">Assigned On</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No devices assigned
                </td>
              </tr>
            ) : (
              devices.map(d => (
                <tr key={d.id} className="border-t">
                  <td className="p-3">{d.deviceId}</td>
                  <td className="p-3">{d.assignedOn}</td>
                  <td className="p-3">
                    {d.active ? "ACTIVE" : "REVOKED"}
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

function Stat({ label, value, color = "" }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className={`font-semibold ${color}`}>{value}</p>
    </div>
  );
}


