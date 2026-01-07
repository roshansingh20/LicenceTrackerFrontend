import axiosInstance from "./axiosInstance";

// ✅ Global assignments
export const fetchAllAssignments = () =>
  axiosInstance.get("/assignments");

// ✅ Assign license
export const assignLicenseToDevice = (payload) =>
  axiosInstance.post("/assignments", payload);

// ✅ Revoke assignment
export const revokeAssignment = (assignmentId) =>
  axiosInstance.put(`/assignments/${assignmentId}/revoke`);
