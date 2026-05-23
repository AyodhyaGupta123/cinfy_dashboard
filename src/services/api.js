import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 15000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }   

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Unauthorized
    if (status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Forbidden
    if (status === 403) {
      console.error("Access denied");
    }

    // Server Error
    if (status >= 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export default api;

/* =========================
   AUTH APIs
========================= */

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const getProfile = () =>
  api.get("/auth/profile");

/* =========================
   PRODUCT APIs
========================= */

export const getProducts = () =>
  api.get("/products");

export const createProduct = (data) =>
  api.post("/products", data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

/* =========================
   CATEGORY APIs
========================= */

export const getCategories = () =>
  api.get("/categories");

export const createCategory = (data) =>
  api.post("/categories", data);

/* =========================
   STOCK APIs
========================= */

export const stockIn = (data) =>
  api.post("/stock-in", data);

export const stockOut = (data) =>
  api.post("/stock-out", data);

export const getDashboardStats = () =>
  api.get("/dashboard/stats");

/* =========================
   ORDERS APIs
========================= */

export const getOrders = () =>
  api.get("/orders");

export const getOrderById = (id) =>
  api.get(`/orders/${id}`);

export const createOrder = (data) =>
  api.post("/orders", data);

export const updateOrderStatus = (id, data) =>
  api.put(`/orders/${id}/status`, data);

export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`);