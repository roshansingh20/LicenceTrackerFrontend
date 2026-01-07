import axiosInstance from "./axiosInstance";

export const getDashboardStats = () =>
  axiosInstance.get("/dashboard/stats");

export const getLicenseAlerts = () =>
  axiosInstance.get("/alerts/licenses");

export const getSoftwareAlerts = () =>
  axiosInstance.get("/alerts/software");

