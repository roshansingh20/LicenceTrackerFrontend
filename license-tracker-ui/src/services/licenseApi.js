import axiosInstance from "./axiosInstance";

export const fetchLicenses = () =>
  axiosInstance.get("/licenses");

export const createLicense = (payload) =>
  axiosInstance.post("/licenses", payload);

export const updateLicense = (licenseKey, payload) =>
  axiosInstance.put(`/licenses/${licenseKey}`, payload);

export const deleteLicense = (licenseKey) =>
  axiosInstance.delete(`/licenses/${licenseKey}`);
