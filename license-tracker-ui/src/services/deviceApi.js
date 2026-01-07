import axiosInstance from "./axiosInstance";

// 📋 Get all devices
export const fetchDevices = () => axiosInstance.get("/devices");

// ➕ Add device
export const createDevice = (device) =>
  axiosInstance.post("/devices", device);

// ✏ Update device
export const updateDevice = (deviceId, device) =>
  axiosInstance.put(`/devices/${deviceId}`, device);

// ❌ Decommission device (delete)
export const decommissionDevice = (deviceId) =>
  axiosInstance.post(`/devices/${deviceId}/decommission`);

// 🔍 View device details (licenses)
export const fetchDeviceLicenses = (deviceId) =>
  axiosInstance.get(`/devices/${deviceId}/licenses`);
