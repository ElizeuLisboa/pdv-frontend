import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   // 🔹 Garantir que headers existem
//   if (!config.headers) {
//     config.headers = {};
//   }

//   // 🔹 CSRF
//   const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
//   if (match) {
//     config.headers["X-CSRF-Token"] = decodeURIComponent(match[2]);
//   }

//   // 🔹 JWT
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } else {
//     console.warn("⚠️ Requisição sem JWT — usuário pode não estar logado");
//   }

//   return config;
// });

// export default api;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 🔹 INTERCEPTOR DE REQUEST
api.interceptors.request.use(
  (config) => {
    // Garantir headers
    if (!config.headers) {
      config.headers = {};
    }

    // 🔹 CSRF TOKEN
    const match = document.cookie.match(/(^| )XSRF-TOKEN=([^;]+)/);
    if (match) {
      config.headers["X-CSRF-Token"] = decodeURIComponent(match[2]);
    }

    // 🔹 JWT TOKEN
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Requisição sem JWT — usuário pode não estar logado");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 INTERCEPTOR DE RESPONSE
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se token expirou
    if (error.response && error.response.status === 401) {
      console.warn("🔐 Sessão expirada. Redirecionando para login.");

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
