// import axios from "axios";
// import api from "./api";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// console.log("ENV:", import.meta.env);
// console.log("API URL:", import.meta.env.VITE_API_URL);

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// // 🔹 INTERCEPTOR DE REQUEST
// api.interceptors.request.use(
//   (config) => {
//     // Garantir headers
//     if (!config.headers) {
//       config.headers = {};
//     }

//     // 🔹 CSRF TOKEN
//     const match = document.cookie.match(/(^| )XSRF-TOKEN=([^;]+)/);
//     if (match) {
//       config.headers["X-CSRF-Token"] = decodeURIComponent(match[2]);
//     }

//     // 🔹 JWT TOKEN
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.warn("⚠️ Requisição sem JWT — usuário pode não estar logado");
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // 🔹 INTERCEPTOR DE RESPONSE
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Se token expirou
//     if (error.response && error.response.status === 401) {
//       console.warn("🔐 Sessão expirada. Redirecionando para login.");

//       localStorage.removeItem("token");
//       localStorage.removeItem("usuario");

//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   },
// );

// export default api;

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
      console.warn("🔐 Sessão expirada. Redirecionando para login.");
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
