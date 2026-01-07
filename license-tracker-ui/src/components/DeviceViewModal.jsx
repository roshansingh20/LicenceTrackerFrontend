import { useEffect, useState } from "react";
import { getDeviceDetails, getDeviceAssignments } from "../services/deviceApi";

export default function DeviceViewModal({ deviceId, onClose }) {
  const [device, setDevice] = useState(null);
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    getDeviceDetails(deviceId).then(setDevice);
    getDeviceAssignments(deviceId).then(setLicenses);
  }, [deviceId]);

  if (!device) return null;

  const statusColor = {
    ACTIVE: "bg-green-100 text-green-800",
    MAINTENANCE: "bg-yellow-100 text-yellow-800",
    OBSOLETE: "bg-orange-100 text-orange-800",
    DECOMMISSIONED: "bg-red-100 text-red-800",
  }[device.status];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] rounded-xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-slate-800">
            Device Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-2 gap-6">

          {/* LEFT – DEVICE INFO */}
          <div>
            <h3 className="font-semibold mb-3 text-slate-700">
              Device Information
            </h3>

            <div className="space-y-2 text-sm">
              <p><b>ID:</b> {device.deviceId}</p>
              <p><b>Type:</b> {device.type}</p>
              <p><b>IP Address:</b> {device.ipAddress}</p>
              <p><b>Location:</b> {device.location}</p>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
              >
                {device.status}
              </span>
            </div>
          </div>

          {/* RIGHT – LICENSES */}
          <div>
            <h3 className="font-semibold mb-3 text-slate-700">
              Assigned Licenses
            </h3>

            {licenses.length === 0 ? (
              <p className="text-sm text-gray-500">
                No licenses assigned
              </p>
            ) : (
              <div className="border rounded-lg overflow-hidden max-h-[260px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-2 text-left">License</th>
                      <th className="p-2">Software</th>
                      <th className="p-2">Expiry</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenses.map(l => {
                      const expired =
                        new Date(l.validTo) < new Date();

                      return (
                        <tr key={l.licenseKey} className="border-t">
                          <td className="p-2">{l.licenseKey}</td>
                          <td className="p-2">{l.softwareName}</td>
                          <td className="p-2">{l.validTo}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                expired
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {expired ? "EXPIRED" : "ACTIVE"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-slate-600 text-white hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
