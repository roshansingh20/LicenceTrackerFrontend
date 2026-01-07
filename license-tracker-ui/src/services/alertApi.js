import axiosInstance from "./axiosInstance";

// License expiry alerts
export const fetchLicenseAlerts = () =>
  axiosInstance.get("/alerts/expiring");
