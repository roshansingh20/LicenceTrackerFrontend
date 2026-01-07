import { useEffect, useState } from "react";
import api from "../services/api";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const res = await api.get("/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error("Failed to load vendors", err);
    }
  };

  const addVendor = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await api.post("/vendors", {
        vendorName: name,
        active: true
      });
      setName("");
      loadVendors();
    } catch (err) {
      alert("Failed to add vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vendors</h1>

      {/* Add Vendor */}
      <div className="flex gap-3 mb-6">
        <input
          className="border p-2 rounded w-64"
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addVendor}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700 cursor-pointer"
        >
          Add Vendor
        </button>
      </div>

      {/* Vendor Table */}
      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Vendor Name</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.vendorName}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      v.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
              </tr>
            ))}

            {vendors.length === 0 && (
              <tr>
                <td colSpan="2" className="p-4 text-gray-500 text-center">
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
