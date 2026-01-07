import { useEffect, useState } from "react";
import api from "../services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


export default function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNonCompliantDevices();
  }, []);

  const fetchNonCompliantDevices = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/compliance/non-compliant");
      setData(res.data || []);
    } catch (err) {
      console.error("Reports API error:", err);
      setError("Failed to load compliance report");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CSV EXPORT ================= */
  const exportCsv = async () => {
    try {
      const res = await api.get("/compliance/export", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "non_compliant_devices.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to export CSV");
    }
  };

  /* ================= PDF EXPORT ================= */
 const exportPdf = () => {
   const doc = new jsPDF();

   doc.setFontSize(16);
   doc.text("Non-Compliant Devices Report", 14, 15);

   const tableColumn = [
     "Device ID",
     "Device Type",
     "Location",
     "Reason"
   ];

   const tableRows = data.map(d => ([
     d.deviceId || "",
     d.deviceType || "",
     d.location || "",
     d.reason || ""
   ]));

   autoTable(doc, {
     head: [tableColumn],
     body: tableRows,
     startY: 25,
     styles: { fontSize: 10 }
   });

   // ✅ THIS LINE TRIGGERS DOWNLOAD
   doc.save("non_compliant_devices.pdf");
 };

  if (loading) {
    return <div className="text-center">Loading report...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Compliance Report – Non-Compliant Devices
        </h1>

        <div className="flex gap-3">
          <button
            onClick={exportCsv}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>

          <button
            onClick={exportPdf}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* TABLE */}
      {data.length === 0 ? (
        <div className="text-green-600 font-semibold">
          🎉 All devices are compliant
        </div>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Device ID</th>
              <th className="border p-2">Device Type</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="border p-2">{row.deviceId}</td>
                <td className="border p-2">{row.deviceType}</td>
                <td className="border p-2">{row.location}</td>
                <td className="border p-2 text-red-600 font-semibold">
                  {row.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
