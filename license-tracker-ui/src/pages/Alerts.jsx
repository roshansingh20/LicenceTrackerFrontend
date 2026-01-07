import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("ALL_ALERTS");

  /* ================= LOAD ALERTS ================= */

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      const res = await axiosInstance.get("/alerts/licenses");
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Failed to load alerts", err);
    }
  }

  /* ================= FILTER LOGIC ================= */

  const filteredAlerts = alerts.filter((a) => {
    const days = a.daysRemaining;

    switch (filter) {
      case "EXPIRED":
        return a.status === "EXPIRED";

      case "EXP_15":
        return a.status === "EXPIRING" && days >= 0 && days <= 15;

      case "EXP_30":
        return a.status === "EXPIRING" && days >= 0 && days <= 30;

      case "EXP_45":
        return a.status === "EXPIRING" && days >= 0 && days <= 45;

      default:
        return true; // ALL_ALERTS
    }
  });

  /* ================= REMINDER ================= */

  function sendReminder() {
    alert("Reminder sent to concerned teams");
  }

  /* ================= UI ================= */

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        License Compliance Alerts
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div className="flex justify-between items-center mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-72"
        >
          <option value="ALL_ALERTS">All Alerts</option>
          <option value="EXPIRED">Expired Licenses</option>
          <option value="EXP_15">Expiring in 15 Days</option>
          <option value="EXP_30">Expiring in 30 Days</option>
          <option value="EXP_45">Expiring in 45 Days</option>
        </select>

        <button
          onClick={sendReminder}
          className="bg-orange-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-orange-700"
        >
          Send Reminder
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">License</th>
              <th className="p-3 text-left">Software</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-center">Devices Used</th>
              <th className="p-3 text-left">Expiry Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Days Left</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-500"
                >
                  No alerts found for selected filter
                </td>
              </tr>
            )}

            {filteredAlerts.map((a) => (
              <tr key={a.licenseKey} className="border-t">
                <td className="p-3 font-medium">{a.licenseKey}</td>
                <td className="p-3">{a.softwareName}</td>
                <td className="p-3">{a.vendor}</td>
                <td className="p-3 text-center">{a.deviceUsed}</td>
                <td className="p-3">{a.expiryDate}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      a.severity === "RED"
                        ? "bg-red-100 text-red-700"
                        : a.severity === "ORANGE"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {a.daysRemaining < 0
                    ? `${Math.abs(a.daysRemaining)} days ago`
                    : `${a.daysRemaining} days`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
