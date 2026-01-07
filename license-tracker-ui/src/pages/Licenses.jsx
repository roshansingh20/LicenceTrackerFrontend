import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

export default function Licenses() {
  const [licenses, setLicenses] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedLicenseKey, setSelectedLicenseKey] = useState("");// ✅ ONLY ONCE
  const [filterKey, setFilterKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadLicenses();
  }, []);

  async function loadLicenses() {
    const res = await axiosInstance.get("/licenses");
    setLicenses(res.data || []);
  }

  // ✅ FILTER BY LICENSE KEY
  const filteredLicenses = licenses.filter((l) => {
    const matchKey =
      !selectedLicenseKey || l.licenseKey === selectedLicenseKey;

    const matchSearch =
      !search ||
      l.softwareName
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return matchKey && matchSearch;
  });


  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Licenses</h1>
</div>

{/* ================= FILTER ================= */}
<div className="flex gap-4 mb-4">
  <select
    value={selectedLicenseKey}
    onChange={(e) => setSelectedLicenseKey(e.target.value)}
    className="border p-2 rounded w-64"
  >
    <option value="">All License Keys</option>
    {licenses.map((l) => (
      <option key={l.licenseKey} value={l.licenseKey}>
        {l.licenseKey}
      </option>
    ))}
  </select>

  <input
    type="text"
    placeholder="Search by software name"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded w-64"
  />
</div>


      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">License Key</th>
              <th className="p-3">Software</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLicenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No licenses found
                </td>
              </tr>
            ) : (
              filteredLicenses.map(l => (
                <tr key={l.licenseKey} className="border-t">
                  <td className="p-3 font-medium">{l.licenseKey}</td>
                  <td className="p-3">{l.softwareName}</td>
                  <td className="p-3">{l.vendorName}</td>
                  <td className="p-3">{l.validTo}</td>
                  <td className="p-3">
                    <button
                      className="text-indigo-600 underline"
                      onClick={() =>
                        navigate(`/licenses/${l.licenseKey}/devices`)
                      }
                    >
                      View Assigned Devices
                    </button>
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
