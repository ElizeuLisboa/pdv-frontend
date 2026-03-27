import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

console.log("ENV:", import.meta.env);
console.log("API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 🔹 INTERCEPTOR DE REQUEST
api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }

    // CSRF TOKEN
    const match = document.cookie.match(/(^| )XSRF-TOKEN=([^;]+)/);
    if (match) {
      config.headers["X-CSRF-Token"] = decodeURIComponent(match[2]);
    }

    // JWT TOKEN
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🔹 INTERCEPTOR DE RESPONSE
api.interceptors.response.use(
  
  (response) => response,
  (error) => {
    
    if (error.response && error.response.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
