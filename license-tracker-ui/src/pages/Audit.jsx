import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    loadAuditLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entity, action, user, logs]);

  /* ================= LOAD ================= */
  async function loadAuditLogs() {
    try {
      const res = await axiosInstance.get("/audit");
      setLogs(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Audit API error:", err.response?.data || err.message);

      if (err.response?.status === 403) {
        setError("You are not authorized to view audit logs");
      } else {
        setError("Failed to load audit logs");
      }
    } finally {
      setLoading(false);
    }
  }


  /* ================= FILTER ================= */
  function applyFilters() {
    let data = [...logs];

    if (entity) {
      data = data.filter(l => l.entityType === entity);
    }
    if (action) {
      data = data.filter(l => l.action === action);
    }
    if (user) {
      data = data.filter(l =>
        l.performedBy?.toLowerCase().includes(user.toLowerCase())
      );
    }

    setFiltered(data);
  }

  /* ================= EXPORT ================= */
  async function exportCsv() {
    try {
      const res = await axiosInstance.get("/audit/export", {
        responseType: "blob"
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "audit_logs.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Export failed");
    }
  }

  const badge = status =>
    status === "SUCCESS"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  if (loading) return <div className="p-8">Loading audit logs…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Audit Logs</h1>

        <button
          onClick={exportCsv}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Export CSV
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded shadow">
        <select
          className="border p-2 rounded"
          value={entity}
          onChange={e => setEntity(e.target.value)}
        >
          <option value="">All Entities</option>
          <option value="DEVICE">DEVICE</option>
          <option value="LICENSE">LICENSE</option>
          <option value="ASSIGNMENT">ASSIGNMENT</option>
          <option value="SOFTWARE">SOFTWARE</option>
          <option value="VENDOR">VENDOR</option>
        </select>

        <select
          className="border p-2 rounded"
          value={action}
          onChange={e => setAction(e.target.value)}
        >
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="ASSIGN_LICENSE">ASSIGN_LICENSE</option>
          <option value="DECOMMISSION">DECOMMISSION</option>
          <option value="AUTO_REVOKE">AUTO_REVOKE</option>
        </select>

        <input
          placeholder="Search by user"
          className="border p-2 rounded"
          value={user}
          onChange={e => setUser(e.target.value)}
        />

        <div className="flex items-center text-sm text-gray-600">
          Total Records:
          <b className="ml-1">{filtered.length}</b>
        </div>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          No audit records found
        </p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Entity</th>
                <th className="p-3 text-left">Entity ID</th>
                <th className="p-3 text-center">Action</th>
                <th className="p-3 text-center">User</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-t hover:bg-slate-50">
                  <td className="p-3">{log.entityType}</td>
                  <td className="p-3">{log.entityId}</td>
                  <td className="p-3 text-center">{log.action}</td>
                  <td className="p-3 text-center">{log.performedBy}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
