import axios from "axios";
import { getToken, logout } from "../utils/auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500/api",
});

axiosInstance.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      logout(); // ✅ now valid
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
