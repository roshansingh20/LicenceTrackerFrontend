import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function LicenseUtilization() {
  const [data, setData] = useState([]);
  const [vendor, setVendor] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUtilization();
  }, [vendor]);

  /* ================= LOAD DATA ================= */

  async function loadUtilization() {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/utilization", {
        params: vendor ? { vendor } : {},
      });

      const rows = res.data || [];
      setData(rows);
      extractVendors(rows);
    } catch (err) {
      console.error(err);
      alert("Failed to load utilization data");
    } finally {
      setLoading(false);
    }
  }

  function extractVendors(rows) {
    const unique = [...new Set(rows.map(r => r.vendor))];
    setVendors(unique);
  }

  /* ================= EXPORT ================= */

  async function exportCsv() {
    try {
      const res = await axiosInstance.get("/utilization/export", {
        params: vendor ? { vendor } : {},
        responseType: "blob", // 🔑 REQUIRED
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "license_utilization.csv");
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  }

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-8">Loading license utilization…</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        License Utilization Report
      </h1>

      {/* FILTER BAR */}
      <div className="flex items-end gap-4 mb-6 bg-white p-4 rounded shadow">
        <div>
          <label className="text-sm font-medium block mb-1">
            Filter by Vendor
          </label>
          <select
            className="border p-2 rounded w-56"
            value={vendor}
            onChange={e => setVendor(e.target.value)}
          >
            <option value="">All Vendors</option>
            {vendors.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={exportCsv}
          className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">License Key</th>
              <th className="p-3 text-left">Software</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-center">Used</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Available</th>
              <th className="p-3 text-center">Utilization %</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No license data found
                </td>
              </tr>
            ) : (
              data.map(row => (
                <tr key={row.licenseKey} className="border-t">
                  <td className="p-3 font-medium">{row.licenseKey}</td>
                  <td className="p-3">{row.softwareName}</td>
                  <td className="p-3">{row.vendor}</td>
                  <td className="p-3 text-center">{row.used}</td>
                  <td className="p-3 text-center">{row.total}</td>
                  <td className="p-3 text-center">{row.available}</td>
                  <td className="p-3 text-center">
                    {row.percentage.toFixed(2)}%
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.status === "EXPIRED"
                          ? "bg-red-100 text-red-700"
                          : row.status === "CRITICAL"
                          ? "bg-orange-100 text-orange-700"
                          : row.status === "WARNING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {row.status}
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
