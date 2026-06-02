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

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("auth_token") || localStorage.getItem("token");

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

/* AUTH APIs */
export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const getProfile = () => api.get("/auth/profile");

/* SUPER ADMIN APIs */
export const createCompany = (data) =>
  api.post("/super-admin/create-company", data);

export const getCompanies = () =>
  api.get("/super-admin/companies");

/* PRODUCT APIs */
export const getProducts = (params = {}) =>
  api.get("/products", { params });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const getLowStockProducts = () =>
  api.get("/products/low-stock");

export const createProduct = (formData) =>
  api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

/* CATEGORY APIs */
export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);

/* SUB CATEGORY APIs */
export const getSubCategories = () => api.get("/subcategories");
export const createSubCategory = (data) => api.post("/subcategories", data);
export const getSubCategoryById = (id) => api.get(`/subcategories/${id}`);
export const updateSubCategory = (id, data) => api.put(`/subcategories/${id}`, data);
export const deleteSubCategory = (id) => api.delete(`/subcategories/${id}`);

/* STOCK APIs */
export const stockIn = (data) => api.post("/stock-in", data);
export const stockOut = (data) => api.post("/stock-out", data);
export const getDashboardStats = () => api.get("/dashboard/stats");

export const getStockTransactions = (params) =>
  api.get("/stock", { params });

export const createStockIn = (data) => api.post("/stock/in", data);
export const createStockOut = (data) => api.post("/stock/out", data);
export const createStockAdjustment = (data) =>
  api.post("/stock/adjustment", data);


/* ISSUE ORDER APIs */

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

/* STOCK RETURN APIs */

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

/* REFUND APIs */
export const getRefunds = () => api.get("/refunds");
export const getRefundById = (id) => api.get(`/refunds/${id}`);
export const createRefund = (data) => api.post("/refunds", data);
export const updateRefundStatus = (id, data) =>
  api.put(`/refunds/${id}/status`, data);
export const deleteRefund = (id) => api.delete(`/refunds/${id}`);

/* BRAND APIs */
export const getBrands = () => api.get("/brands");
export const getBrandById = (id) => api.get(`/brands/${id}`);
export const createBrand = (data) => api.post("/brands", data);
export const updateBrand = (id, data) => api.put(`/brands/${id}`, data);
export const deleteBrand = (id) => api.delete(`/brands/${id}`);

/* WAREHOUSE APIs */
export const getWarehouses = () => api.get("/warehouses");
export const getWarehouseById = (id) => api.get(`/warehouses/${id}`);
export const createWarehouse = (data) => api.post("/warehouses", data);
export const updateWarehouse = (id, data) =>
  api.put(`/warehouses/${id}`, data);
export const deleteWarehouse = (id) => api.delete(`/warehouses/${id}`);

/* TRANSFER APIs */
export const getTransfers = () => api.get("/transfers");
export const getTransferById = (id) => api.get(`/transfers/${id}`);
export const createTransfer = (data) => api.post("/transfers", data);
export const updateTransferStatus = (id, data) =>
  api.put(`/transfers/${id}/status`, data);
export const deleteTransfer = (id) => api.delete(`/transfers/${id}`);

/*staff user APIs */

export const createStaffUser = (data) => api.post("/users", data);

export const getCompanyUsers = () => api.get("/users");

export const getCompanyUserById = (id) => api.get(`/users/${id}`);

export const updateCompanyUser = (id, data) => api.put(`/users/${id}`, data);

export const deleteCompanyUser = (id) => api.delete(`/users/${id}`);


/* PURCHASE SUPPLIER APIs */
export const getSuppliers = () => api.get("/purchases/suppliers");

export const getSupplierById = (id) =>
  api.get(`/purchases/suppliers/${id}`);

export const createSupplier = (data) =>
  api.post("/purchases/suppliers", data);

export const updateSupplier = (id, data) =>
  api.put(`/purchases/suppliers/${id}`, data);

export const deleteSupplier = (id) =>
  api.delete(`/purchases/suppliers/${id}`);


/* UNIT APIs */

export const getUnits = () => api.get("/units");

export const getUnitById = (id) =>
  api.get(`/units/${id}`);

export const createUnit = (data) =>
  api.post("/units", data);

export const updateUnit = (id, data) =>
  api.put(`/units/${id}`, data);

export const deleteUnit = (id) =>
  api.delete(`/units/${id}`);

/* TAX APIs */

export const getTaxes = async (params = {}) => {
  const res = await api.get("/taxes", { params });
  return res.data;
};

export const getTaxById = async (id) => {
  const res = await api.get(`/taxes/${id}`);
  return res.data;
};

export const createTax = async (data) => {
  const res = await api.post("/taxes", data);
  return res.data;
};

export const updateTax = async (id, data) => {
  const res = await api.put(`/taxes/${id}`, data);
  return res.data;
};

export const deleteTax = async (id) => {
  const res = await api.delete(`/taxes/${id}`);
  return res.data;
};


/* PURCHASE ORDER APIs */
export const getPurchaseOrders = () =>
  api.get("/purchases/orders");

export const getPurchaseOrderById = (id) =>
  api.get(`/purchases/orders/${id}`);

export const createPurchaseOrder = (data) =>
  api.post("/purchases/orders", data);

export const updatePurchaseOrder = (id, data) =>
  api.put(`/purchases/orders/${id}`, data);

export const updatePurchaseOrderStatus = (id, data) =>
  api.put(`/purchases/orders/${id}/status`, data);

export const deletePurchaseOrder = (id) =>
  api.delete(`/purchases/orders/${id}`);


/* GOODS RECEIVED NOTE APIs */
export const getGoodsReceived = () =>
  api.get("/purchases/grn");

export const getGoodsReceivedById = (id) =>
  api.get(`/purchases/grn/${id}`);

export const createGoodsReceived = (data) =>
  api.post("/purchases/grn", data);

export const updateGoodsReceived = (id, data) =>
  api.put(`/purchases/grn/${id}`, data);

export const deleteGoodsReceived = (id) =>
  api.delete(`/purchases/grn/${id}`);

/* ANALYTICS APIs */

export const getAnalyticsDashboard = () =>
  api.get("/dashboard/analytics");


/* REPORT APIs */

export const getReports = () => api.get("/reports");
export const createReport = (data) => api.post("/reports", data);
export const getReportById = (id) => api.get(`/reports/${id}`);
export const updateReport = (id, data) => api.put(`/reports/${id}`, data);
export const deleteReport = (id) => api.delete(`/reports/${id}`);