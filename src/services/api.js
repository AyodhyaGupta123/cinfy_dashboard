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
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
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

/* =========================
   RETURN APIs
========================= */

export const getReturns = () =>
  api.get("/returns");

export const getReturnById = (id) =>
  api.get(`/returns/${id}`);

export const createReturn = (data) =>
  api.post("/returns", data);

export const updateReturnStatus = (id, data) =>
  api.put(`/returns/${id}/status`, data);

export const deleteReturn = (id) =>
  api.delete(`/returns/${id}`);

/* =========================
   REFUND APIs
========================= */

export const getRefunds = () =>
  api.get("/refunds");

export const getRefundById = (id) =>
  api.get(`/refunds/${id}`);

export const createRefund = (data) =>
  api.post("/refunds", data);

export const updateRefundStatus = (id, data) =>
  api.put(`/refunds/${id}/status`, data);

export const deleteRefund = (id) =>
  api.delete(`/refunds/${id}`);

/* =========================
   BRAND APIs
========================= */

export const getBrands = () =>
  api.get("/brands");

export const getBrandById = (id) =>
  api.get(`/brands/${id}`);

export const createBrand = (data) =>
  api.post("/brands", data);

export const updateBrand = (id, data) =>
  api.put(`/brands/${id}`, data);

export const deleteBrand = (id) =>
  api.delete(`/brands/${id}`);



/* ====================== 
     Stock APIs
========================= */

export const getStockTransactions = (params) =>
  api.get("/stock", { params });

export const createStockIn = (data) =>
  api.post("/stock/in", data);

export const createStockOut = (data) =>
  api.post("/stock/out", data);

export const createStockAdjustment = (data) =>
  api.post("/stock/adjustment", data);

export const getLowStockProducts = () =>
  api.get("/stock/low-stock");

/* =========================
   WAREHOUSE APIs
========================= */

export const getWarehouses = () => api.get("/warehouses");
export const getWarehouseById = (id) => api.get(`/warehouses/${id}`);
export const createWarehouse = (data) => api.post("/warehouses", data);
export const updateWarehouse = (id, data) => api.put(`/warehouses/${id}`, data);
export const deleteWarehouse = (id) => api.delete(`/warehouses/${id}`);

/* =========================
   TRANSFER APIs
========================= */

export const getTransfers = () => api.get("/transfers");
export const getTransferById = (id) => api.get(`/transfers/${id}`);
export const createTransfer = (data) => api.post("/transfers", data);
export const updateTransferStatus = (id, data) =>
  api.put(`/transfers/${id}/status`, data);
export const deleteTransfer = (id) => api.delete(`/transfers/${id}`);