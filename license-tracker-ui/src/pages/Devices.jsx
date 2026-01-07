import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { hasRole } from "../utils/roles";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [mode, setMode] = useState("LIST"); // LIST | ADD | EDIT | VIEW
  const [selected, setSelected] = useState(null);

  const isAdmin = hasRole("ADMIN");
  const isOperationManager = hasRole("OPERATION_MANAGER");

  useEffect(() => {
    loadDevices();
  }, []);

  async function loadDevices() {
    const res = await axiosInstance.get("/devices");
    setDevices(res.data || []);
  }

  /* ================= MODE SWITCH ================= */

  if (mode === "ADD")
    return <DeviceForm onCancel={() => setMode("LIST")} onSave={loadDevices} />;

  if (mode === "EDIT")
    return (
      <DeviceForm
        device={selected}
        onCancel={() => setMode("LIST")}
        onSave={loadDevices}
      />
    );

  if (mode === "VIEW")
    return <DeviceView device={selected} onClose={() => setMode("LIST")} />;

  /* ================= LIST ================= */

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Device Management</h1>

        {/* ADD DEVICE – ADMIN ONLY */}
        {isAdmin && (
          <button
            onClick={() => setMode("ADD")}
            className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer"
          >
            + Add Device
          </button>
        )}
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Device ID</th>
              <th className="p-3">IP</th>
              <th className="p-3">Type</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.deviceId} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{d.deviceId}</td>
                <td className="p-3">{d.ipAddress}</td>
                <td className="p-3">{d.type}</td>
                <td className="p-3">{d.vendor}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      d.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : d.status === "DECOMMISSIONED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>

                <td className="p-3 space-x-4">
                  {/* VIEW – ALL */}
                  <button
                    className="text-indigo-600 underline cursor-pointer"
                    onClick={() => {
                      setSelected(d);
                      setMode("VIEW");
                    }}
                  >
                    View Details
                  </button>

                  {/* EDIT – ADMIN ONLY */}
                  {isAdmin && (
                    <button
                      className="text-blue-600 underline cursor-pointer"
                      onClick={() => {
                        setSelected(d);
                        setMode("EDIT");
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {/* DECOMMISSION – OPERATION MANAGER ONLY */}
                  {isOperationManager && d.status !== "DECOMMISSIONED" && (
                    <button
                      className="text-red-600 underline cursor-pointer"
                      onClick={() => decommission(d.deviceId, loadDevices)}
                    >
                      Decommission
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= VIEW ================= */

function DeviceView({ device, onClose }) {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Device Details</h1>

      <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">
        <Detail label="Device ID" value={device.deviceId} />
        <Detail label="IP Address" value={device.ipAddress} />
        <Detail label="Type" value={device.type} />
        <Detail label="Vendor" value={device.vendor} />
        <Detail label="Location" value={device.location} />
        <Detail label="Software" value={device.softwareName} />
        <Detail label="Installed Version" value={device.installedVersion} />
        <Detail label="Latest Version" value={device.latestVersion} />
        <Detail label="Status" value={device.status} />
      </div>

      <button
        onClick={onClose}
        className="mt-6 bg-gray-200 px-6 py-2 rounded cursor-pointer"
      >
        Close
      </button>
    </div>
  );
}

/* ================= FORM ================= */

function DeviceForm({ device, onCancel, onSave }) {
  const [form, setForm] = useState(
    device || {
      deviceId: "",
      ipAddress: "",
      type: "",
      vendor: "",
      location: "",
      softwareName: "",
      status: "ACTIVE",
    }
  );

  const isEdit = Boolean(device);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    if (!form.deviceId || !form.ipAddress) {
      alert("Device ID & IP Address are mandatory");
      return;
    }

    if (isEdit) {
      await axiosInstance.put(`/devices/${form.deviceId}`, form);
    } else {
      await axiosInstance.post("/devices", form);
    }

    onSave();
    onCancel();
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Device" : "Add Device"}
      </h1>

      <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">
        <Input label="Device ID *" name="deviceId" value={form.deviceId} onChange={update} disabled={isEdit} />
        <Input label="IP Address *" name="ipAddress" value={form.ipAddress} onChange={update} />
        <Select label="Select Type" name="type" value={form.type} onChange={update} options={["ROUTER","SWITCH","FIREWALL"]} />
        <Select label="Select Vendor" name="vendor" value={form.vendor} onChange={update} options={["Cisco","Juniper","Palo Alto"]} />
        <Input label="Location" name="location" value={form.location} onChange={update} />
        <Select label="Select Software" name="softwareName" value={form.softwareName} onChange={update} options={["PAN-OS","Cisco DNA Center","SolarWinds"]} />

        {isEdit && (
          <Select
            label="Lifecycle Status"
            name="status"
            value={form.status}
            onChange={update}
            options={["ACTIVE","MAINTENANCE","OBSOLETE","DECOMMISSIONED"]}
          />
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={save} className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer">
          Save
        </button>
        <button onClick={onCancel} className="bg-gray-200 px-6 py-2 rounded cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...props} className="border p-2 rounded w-full" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select {...props} className="border p-2 rounded w-full">
        <option value="">-- {label} --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

async function decommission(id, reload) {
  await axiosInstance.post(`/devices/${id}/decommission`);
  reload();
}
