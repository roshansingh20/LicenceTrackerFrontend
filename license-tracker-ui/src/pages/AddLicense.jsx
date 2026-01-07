import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AddLicense() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    licenseKey: "",
    softwareName: "",
    vendorName: "",
    validFrom: "",
    validTo: "",
    maxUsage: "",
    licenseType: "PER_DEVICE"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveLicense() {
    setError("");
    setSuccess("");

    try {
      await axiosInstance.post("/licenses", {
        ...form,
        maxUsage: Number(form.maxUsage)
      });

      setSuccess("License saved successfully");

      setTimeout(() => {
        navigate("/licenses");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to save license"
      );
    }
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Add New Software License
      </h1>

      <div className="bg-white p-6 rounded shadow max-w-xl space-y-4">

        <Input label="License Key" name="licenseKey" value={form.licenseKey} onChange={handleChange} />
        <Input label="Software Name" name="softwareName" value={form.softwareName} onChange={handleChange} />
        <Input label="Vendor" name="vendorName" value={form.vendorName} onChange={handleChange} />

        <Input label="Valid From" type="date" name="validFrom" value={form.validFrom} onChange={handleChange} />
        <Input label="Valid To" type="date" name="validTo" value={form.validTo} onChange={handleChange} />

        <Input label="Max Usage" type="number" name="maxUsage" value={form.maxUsage} onChange={handleChange} />

        <div>
          <label className="block text-sm font-medium mb-1">
            License Type
          </label>
          <select
            name="licenseType"
            value={form.licenseType}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="PER_DEVICE">Per Device</option>
            <option value="SITE">Site</option>
          </select>
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <div className="flex gap-4">
          <button
            onClick={saveLicense}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Save License
          </button>

          <button
            onClick={() => navigate("/licenses")}
            className="bg-gray-200 px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        {...props}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
