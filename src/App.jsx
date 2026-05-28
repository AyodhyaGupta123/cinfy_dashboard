import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/UI/Toast";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Analytics from "./pages/Analytics";
import Applications from "./pages/Applications";
import CustomReports from "./pages/CustomReports";
import DebugDashboard from "./pages/DebugDashboard";
import Earnings from "./pages/Earnings";
import Transactions from "./pages/Transactions";
import PaymentSettings from "./pages/PaymentSettings";
import ResourceCenter from "./pages/ResourceCenter";
import AppAdsTxt from "./pages/AppAdsTxt";
import ReferralProgram from "./pages/ReferralProgram";
import Profile from "./pages/Profile";
import GeneralSettings from "./pages/GeneralSettings";
import Users from "./pages/users/Users";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import KanbanBoard from "./pages/KanbanBoard";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import DataTables from "./pages/DataTables";
import ChartsGallery from "./pages/ChartsGallery";
import NotFound from "./pages/NotFound";
import AddProduct from "./pages/inventory/products/AddProduct";
import Products from "./pages/inventory/products/Products";
import Categories from "./pages/inventory/categories/Categories";

import ChatBotWidget from "./components/ChatBotWidget";

import { AuthProvider } from "./context/AuthContext";
import useScrollToTop from "./hooks/useScrollToTop";
import AddCategory from "./pages/inventory/categories/AddCategory";
import EditCategory from "./pages/inventory/categories/EditCategory";
import EditProduct from "./pages/inventory/products/EditProduct";
import ProductDetails from "./pages/inventory/products/ProductDetails";
import StockIn from "./pages/inventory/stock/StockIn";
import StockOut from "./pages/inventory/stock/StockOut";
import AddStockIn from "./pages/inventory/stock/AddStockIn";
import AddStockOut from "./pages/inventory/stock/AddStockOut";
import StockAdjustments from "./pages/inventory/stock/StockAdjustments";
import AddAdjustment from "./pages/inventory/stock/AddAdjustment";
import LowStock from "./pages/inventory/stock/LowStock";
import Brands from "./pages/inventory/brands/Brands";
import AddBrand from "./pages/inventory/brands/AddBrand";
import Warehouses from "./pages/inventory/warehouse/Warehouses";
import AddWarehouse from "./pages/inventory/warehouse/AddWarehouse";
import Transfers from "./pages/inventory/warehouse/transfers/Transfers";
import CreateTransfer from "./pages/inventory/warehouse/transfers/CreateTransfer";
import Orders from "./pages/inventory/orders/Orders";
import Refunds from "./pages/inventory/orders/Refunds";
import Returns from "./pages/inventory/orders/Returns";
import OrderDetails from "./pages/inventory/orders/OrderDetails";
import RefundDetails from "./pages/inventory/orders/RefundDetails";
import ReturnDetails from "./pages/inventory/orders/ReturnDetails";
import EditBrand from "./pages/inventory/brands/EditBrand";
import EditTransfer from "./pages/inventory/warehouse/transfers/EditTransfer";
import TransferDetails from "./pages/inventory/warehouse/transfers/TransferDetails";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import Companies from "./pages/super-admin/companies/Companies";
import AddCompany from "./pages/super-admin/companies/AddCompany";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";

import PurchaseOrders from "./pages/purchases/purchase-orders/PurchaseOrders";
import CreatePurchase from "./pages/purchases/purchase-orders/CreatePurchase";
import Suppliers from "./pages/purchases/suppliers/Suppliers";
import AddSupplier from "./pages/purchases/suppliers/AddSupplier";
import GoodsReceived from "./pages/purchases/grn/GoodsReceived";
import PurchaseDetails from "./pages/purchases/purchase-orders/PurchaseDetails";
import SupplierDetails from "./pages/purchases/suppliers/SupplierDetails";

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Analytics />} />
              <Route path="users" element={<Users />} />
              <Route path="kanban" element={<KanbanBoard />} />
              <Route path="calendar" element={<Calendar />} />

              <Route path="notifications" element={<Notifications />} />
              <Route path="tables" element={<DataTables />} />
              <Route path="charts" element={<ChartsGallery />} />
              <Route path="reports" element={<CustomReports />} />
              <Route path="applications" element={<Applications />} />
              <Route path="debug" element={<DebugDashboard />} />
              <Route path="payments/earnings" element={<Earnings />} />
              <Route path="payments/transactions" element={<Transactions />} />
              <Route path="payments/invoices" element={<Invoices />} />
              <Route path="payments/settings" element={<PaymentSettings />} />
              <Route path="resources" element={<ResourceCenter />} />
              <Route path="app-ads" element={<AppAdsTxt />} />
              <Route path="referral" element={<ReferralProgram />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<GeneralSettings />} />
              <Route path="inventory/products" element={<Products />} />
              <Route path="inventory/products/add" element={<AddProduct />} />
              <Route path="inventory/categories" element={<Categories />} />
              <Route
                path="/inventory/brands/edit/:id"
                element={<EditBrand />}
              />
              <Route
                path="/inventory/transfers/edit/:id"
                element={<EditTransfer />}
              />
              <Route
                path="/inventory/transfers/:id"
                element={<TransferDetails />}
              />

              <Route
                path="/super-admin/dashboard"
                element={<SuperAdminDashboard />}
              />
              <Route path="/super-admin/companies" element={<Companies />} />
              <Route
                path="/super-admin/companies/add"
                element={<AddCompany />}
              />

              <Route path="chat" element={<Chat />} />
              <Route path="chat-bot" element={<ChatBotWidget />} />

              <Route
                path="inventory/categories/add"
                element={<AddCategory />}
              />
              <Route
                path="/inventory/categories/edit/:id"
                element={<EditCategory />}
              />
              <Route
                path="/inventory/products/edit/:id"
                element={<EditProduct />}
              />
              <Route
                path="/inventory/products/:id"
                element={<ProductDetails />}
              />
              <Route path="/inventory/stock-in" element={<StockIn />} />
              <Route path="/inventory/stock-out" element={<StockOut />} />
              <Route path="/inventory/stock-in/add" element={<AddStockIn />} />
              <Route
                path="/inventory/stock-out/add"
                element={<AddStockOut />}
              />
              <Route
                path="/inventory/stock-adjustments"
                element={<StockAdjustments />}
              />
              <Route
                path="/inventory/stock-adjustments/add"
                element={<AddAdjustment />}
              />
              <Route path="/inventory/low-stock" element={<LowStock />} />
              <Route path="/inventory/brands" element={<Brands />} />
              <Route path="/inventory/brands/add" element={<AddBrand />} />
              <Route path="/inventory/warehouses" element={<Warehouses />} />
              <Route
                path="/inventory/warehouses/add"
                element={<AddWarehouse />}
              />
              <Route path="/inventory/transfers" element={<Transfers />} />
              <Route
                path="/inventory/transfers/create"
                element={<CreateTransfer />}
              />
              <Route path="/users/add" element={<AddUser />} />
              <Route path="/users/edit/:id" element={<EditUser />} />
              <Route path="/inventory/orders" element={<Orders />} />
              <Route path="/inventory/refunds" element={<Refunds />} />
              <Route path="/inventory/returns" element={<Returns />} />
              <Route path="/inventory/orders/:id" element={<OrderDetails />} />
              <Route
                path="/inventory/refunds/:id"
                element={<RefundDetails />}
              />
              <Route
                path="/inventory/returns/:id"
                element={<ReturnDetails />}
              />

              <Route path="/purchases/orders" element={<PurchaseOrders />} />
              <Route
                path="/purchases/orders/create"
                element={<CreatePurchase />}
              />
              <Route path="/purchases/suppliers" element={<Suppliers />} />
              <Route path="/purchases/suppliers/add" element={<AddSupplier />} />
              <Route path="/purchases/grn" element={<GoodsReceived />} />
              <Route
                path="/purchases/orders/:id"
                element={<PurchaseDetails />}
              />
              <Route path="/purchases/suppliers/:id" element={<SupplierDetails />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
