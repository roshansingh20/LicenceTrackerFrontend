import axiosInstance from "./axiosInstance";

export const getTrainingChecklist = () =>
  axiosInstance.get("/ai/training-checklist");
