import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRightLeft,
  BarChart2,
  Calendar,
  PackageCheck,
  PackageMinus,
  PackagePlus,
  RefreshCw,
  ShoppingCart,
  Truck,
  Warehouse,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "../components/UI/StatCard";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Breadcrumb from "../components/UI/Breadcrumb";
import { useToast } from "../components/UI/Toast";
import { theme } from "../theme/constants";
import {
  getProducts,
  getLowStockProducts,
  getStockTransactions,
  getOrders,
  getReturns,
  getRefunds,
  getBrands,
  getWarehouses,
  getTransfers,
  getSuppliers,
  getPurchaseOrders,
  getGoodsReceived,
} from "../services/api";

const inputClass =
  "w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Analytics = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [chartPeriod, setChartPeriod] = useState("daily");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    warehouse: "all",
    brand: "all",
    status: "all",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [stockTransactions, setStockTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returnsList, setReturnsList] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [grns, setGrns] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        productsRes,
        lowStockRes,
        stockRes,
        ordersRes,
        returnsRes,
        refundsRes,
        brandsRes,
        warehousesRes,
        transfersRes,
        suppliersRes,
        purchaseOrdersRes,
        grnRes,
      ] = await Promise.allSettled([
        getProducts(),
        getLowStockProducts(),
        getStockTransactions(),
        getOrders(),
        getReturns(),
        getRefunds(),
        getBrands(),
        getWarehouses(),
        getTransfers(),
        getSuppliers(),
        getPurchaseOrders(),
        getGoodsReceived(),
      ]);

      setProducts(getArray(productsRes, ["products", "data"]));
      setLowStockProducts(getArray(lowStockRes, ["products", "lowStockProducts", "data"]));
      setStockTransactions(getArray(stockRes, ["transactions", "stockTransactions", "data"]));
      setOrders(getArray(ordersRes, ["orders", "data"]));
      setReturnsList(getArray(returnsRes, ["returns", "data"]));
      setRefunds(getArray(refundsRes, ["refunds", "data"]));
      setBrands(getArray(brandsRes, ["brands", "data"]));
      setWarehouses(getArray(warehousesRes, ["warehouses", "data"]));
      setTransfers(getArray(transfersRes, ["transfers", "data"]));
      setSuppliers(getArray(suppliersRes, ["suppliers", "data"]));
      setPurchaseOrders(getArray(purchaseOrdersRes, ["purchaseOrders", "data"]));
      setGrns(getArray(grnRes, ["grns", "goodsReceived", "data"]));
    } catch (error) {
      toast.error(
        "Dashboard Load Failed",
        error.response?.data?.message || "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setAppliedFilters(filters);
    toast.success("Filters Applied", "Dashboard filters applied successfully.");
  };

  const handleClear = () => {
    const reset = {
      fromDate: "",
      toDate: "",
      warehouse: "all",
      brand: "all",
      status: "all",
    };

    setFilters(reset);
    setAppliedFilters(reset);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productBrand =
        product.brand?._id || product.brand || product.brandId || "";

      const productWarehouse =
        product.warehouse?._id || product.warehouse || product.warehouseId || "";

      const stock = Number(product.stock || product.quantity || 0);
      const minStock = Number(product.minStock || product.lowStockLimit || 0);

      const brandMatch =
        appliedFilters.brand === "all" || productBrand === appliedFilters.brand;

      const warehouseMatch =
        appliedFilters.warehouse === "all" ||
        productWarehouse === appliedFilters.warehouse;

      const statusMatch =
        appliedFilters.status === "all" ||
        (appliedFilters.status === "in_stock" && stock > minStock) ||
        (appliedFilters.status === "low_stock" && stock <= minStock);

      return brandMatch && warehouseMatch && statusMatch;
    });
  }, [products, appliedFilters]);

  const filteredTransactions = useMemo(() => {
    return stockTransactions.filter((item) => {
      const itemDate = new Date(item.createdAt || item.date);
      const itemWarehouse =
        item.warehouse?._id || item.warehouse || item.warehouseId || "";

      const fromMatch =
        !appliedFilters.fromDate ||
        itemDate >= new Date(`${appliedFilters.fromDate}T00:00:00`);

      const toMatch =
        !appliedFilters.toDate ||
        itemDate <= new Date(`${appliedFilters.toDate}T23:59:59`);

      const warehouseMatch =
        appliedFilters.warehouse === "all" ||
        itemWarehouse === appliedFilters.warehouse;

      return fromMatch && toMatch && warehouseMatch;
    });
  }, [stockTransactions, appliedFilters]);

  const filteredLowStock = useMemo(() => {
    return lowStockProducts.filter((product) => {
      const productBrand =
        product.brand?._id || product.brand || product.brandId || "";

      const productWarehouse =
        product.warehouse?._id || product.warehouse || product.warehouseId || "";

      const brandMatch =
        appliedFilters.brand === "all" || productBrand === appliedFilters.brand;

      const warehouseMatch =
        appliedFilters.warehouse === "all" ||
        productWarehouse === appliedFilters.warehouse;

      return brandMatch && warehouseMatch;
    });
  }, [lowStockProducts, appliedFilters]);

  const filteredPurchaseOrders = useMemo(() => {
    return purchaseOrders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.purchaseDate);

      const fromMatch =
        !appliedFilters.fromDate ||
        orderDate >= new Date(`${appliedFilters.fromDate}T00:00:00`);

      const toMatch =
        !appliedFilters.toDate ||
        orderDate <= new Date(`${appliedFilters.toDate}T23:59:59`);

      return fromMatch && toMatch;
    });
  }, [purchaseOrders, appliedFilters]);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((transfer) => {
      const transferDate = new Date(transfer.createdAt || transfer.date);

      const fromWarehouse =
        transfer.fromWarehouse?._id ||
        transfer.fromWarehouse ||
        transfer.sourceWarehouse ||
        "";

      const toWarehouse =
        transfer.toWarehouse?._id ||
        transfer.toWarehouse ||
        transfer.destinationWarehouse ||
        "";

      const fromMatch =
        !appliedFilters.fromDate ||
        transferDate >= new Date(`${appliedFilters.fromDate}T00:00:00`);

      const toMatch =
        !appliedFilters.toDate ||
        transferDate <= new Date(`${appliedFilters.toDate}T23:59:59`);

      const warehouseMatch =
        appliedFilters.warehouse === "all" ||
        fromWarehouse === appliedFilters.warehouse ||
        toWarehouse === appliedFilters.warehouse;

      return fromMatch && toMatch && warehouseMatch;
    });
  }, [transfers, appliedFilters]);

  const summary = useMemo(() => {
    const stockInQty = filteredTransactions
      .filter((item) => isStockIn(item.type))
      .reduce((sum, item) => sum + Number(item.quantity || item.qty || 0), 0);

    const stockOutQty = filteredTransactions
      .filter((item) => isStockOut(item.type))
      .reduce((sum, item) => sum + Number(item.quantity || item.qty || 0), 0);

    return {
      products: filteredProducts.length,
      lowStock: filteredLowStock.length,
      stockTransactions: filteredTransactions.length,
      stockIn: stockInQty,
      stockOut: stockOutQty,
      orders: orders.length,
      returns: returnsList.length,
      refunds: refunds.length,
      brands: brands.length,
      warehouses: warehouses.length,
      transfers: filteredTransfers.length,
      suppliers: suppliers.length,
      purchaseOrders: filteredPurchaseOrders.length,
      grns: grns.length,
      pendingPO: filteredPurchaseOrders.filter((item) => item.status === "Pending").length,
      receivedPO: filteredPurchaseOrders.filter((item) => item.status === "Received").length,
      cancelledPO: filteredPurchaseOrders.filter((item) => item.status === "Cancelled").length,
      pendingTransfers: filteredTransfers.filter((item) => item.status === "Pending").length,
      completedTransfers: filteredTransfers.filter((item) => item.status === "Completed").length,
      inTransitTransfers: filteredTransfers.filter((item) => item.status === "In Transit").length,
    };
  }, [
    filteredProducts,
    filteredLowStock,
    filteredTransactions,
    filteredTransfers,
    filteredPurchaseOrders,
    orders,
    returnsList,
    refunds,
    brands,
    warehouses,
    suppliers,
    grns,
  ]);

  const stockChartData = useMemo(() => {
    const labels =
      chartPeriod === "monthly"
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        : chartPeriod === "weekly"
        ? ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const base = labels.map((label) => ({
      name: label,
      stockIn: 0,
      stockOut: 0,
    }));

    filteredTransactions.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (Number.isNaN(date.getTime())) return;

      let index = 0;

      if (chartPeriod === "monthly") {
        index = date.getMonth();
      } else if (chartPeriod === "weekly") {
        index = Math.min(Math.floor((date.getDate() - 1) / 7), 4);
      } else {
        index = date.getDay();
      }

      const qty = Number(item.quantity || item.qty || 0);

      if (isStockIn(item.type)) base[index].stockIn += qty;
      if (isStockOut(item.type)) base[index].stockOut += qty;
    });

    return base;
  }, [filteredTransactions, chartPeriod]);

  const recentActivities = useMemo(() => {
    const activities = [];

    filteredTransactions.slice(0, 2).forEach((item) => {
      const out = isStockOut(item.type);

      activities.push({
        title: out ? "Stock Out Added" : "Stock In Added",
        description: `${item.quantity || item.qty || 0} units updated in inventory`,
        time: formatDate(item.createdAt || item.date),
        icon: out ? PackageMinus : PackagePlus,
      });
    });

    filteredPurchaseOrders.slice(0, 2).forEach((order) => {
      activities.push({
        title: "Purchase Order Created",
        description: `${order.orderNumber || "Purchase order"} created for ${
          order.supplier?.name || "supplier"
        }`,
        time: formatDate(order.createdAt || order.purchaseDate),
        icon: ShoppingCart,
      });
    });

    filteredLowStock.slice(0, 2).forEach((product) => {
      activities.push({
        title: "Low Stock Alert",
        description: `${product.name || "Product"} is below minimum stock level`,
        time: "Low Stock",
        icon: AlertTriangle,
      });
    });

    return activities.slice(0, 5);
  }, [filteredTransactions, filteredPurchaseOrders, filteredLowStock]);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory Overview" },
        ]}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>
            Inventory Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor products, stock movement, suppliers, purchases, orders, and warehouse activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <RefreshCw
              style={{ width: 16, height: 16 }}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate("/inventory/stock-in")}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <PackagePlus style={{ width: 16, height: 16 }} />
            Add Stock
          </Button>
        </div>
      </div>

      <Card
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3"
        style={{ padding: "14px 18px" }}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            From Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            To Date
          </label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Warehouse
          </label>
          <select
            name="warehouse"
            value={filters.warehouse}
            onChange={handleFilterChange}
            className={inputClass}
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name || item.warehouseName || "Warehouse"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Brand
          </label>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className={inputClass}
          >
            <option value="all">All Brands</option>
            {brands.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name || "Brand"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Stock Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className={inputClass}
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            className="flex-1"
          >
            Clear
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleApply}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Warehouse} title="Products" value={summary.products} iconBg={theme.statIcons.impressions} />
        <StatCard icon={PackagePlus} title="Stock In" value={summary.stockIn} iconBg={theme.statIcons.revenue} />
        <StatCard icon={PackageMinus} title="Stock Out" value={summary.stockOut} iconBg={theme.statIcons.clicks} />
        <StatCard icon={AlertTriangle} title="Low Stock" value={summary.lowStock} iconBg={theme.statIcons.ctr} />
        <StatCard icon={Truck} title="Suppliers" value={summary.suppliers} iconBg={theme.statIcons.ecpm} />
        <StatCard icon={ShoppingCart} title="Purchase Orders" value={summary.purchaseOrders} iconBg={theme.statIcons.fillRate} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2" style={{ marginBottom: 24 }}>
          <div className="flex items-center gap-3 mb-5">
            <BarChart2 style={{ width: 18, height: 18, color: theme.primary }} />
            <h3 className="font-semibold text-gray-900">Stock Movement Overview</h3>
          </div>

          <div className="flex justify-between mb-5">
            <span className="text-sm text-gray-500">Stock In / Stock Out</span>

            <div className="flex border rounded-lg overflow-hidden">
              {["Daily", "Weekly", "Monthly"].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period.toLowerCase())}
                  className={`px-4 py-2 text-xs ${
                    chartPeriod === period.toLowerCase()
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-500"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="stockIn"
                  stroke={theme.primary}
                  fill={theme.primary}
                  fillOpacity={0.12}
                />
                <Area
                  type="monotone"
                  dataKey="stockOut"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.08}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Recent Inventory Activity</h3>
              <p className="text-sm text-gray-500">Latest stock and purchase movements</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No recent activity found.
              </div>
            ) : (
              recentActivities.map((activity, index) => {
                const ActivityIcon = activity.icon;

                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <ActivityIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{activity.time}</span>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SummaryCard
          icon={PackageCheck}
          title="Stock Summary"
          description="Current inventory flow"
          rows={[
            ["Total Products", summary.products],
            ["Stock Transactions", summary.stockTransactions],
            ["Low Stock Products", summary.lowStock],
          ]}
        />

        <SummaryCard
          icon={ShoppingCart}
          title="Purchase Summary"
          description="Purchase order status"
          rows={[
            ["Pending Orders", summary.pendingPO],
            ["Received Orders", summary.receivedPO],
            ["Cancelled Orders", summary.cancelledPO],
          ]}
        />

        <SummaryCard
          icon={ArrowRightLeft}
          title="Transfer Summary"
          description="Warehouse movements"
          rows={[
            ["Pending Transfers", summary.pendingTransfers],
            ["Completed Transfers", summary.completedTransfers],
            ["In Transit", summary.inTransitTransfers],
          ]}
        />
      </div>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, title, description, rows }) => (
  <Card>
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>

    <div className="space-y-3 text-sm">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
        >
          <span className="text-gray-500">{label}</span>
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      ))}
    </div>
  </Card>
);

const getArray = (result, keys) => {
  if (result.status !== "fulfilled") return [];

  const data = result.value?.data || {};

  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key];
  }

  if (Array.isArray(data)) return data;

  return [];
};

const isStockIn = (type = "") => ["in", "stock-in", "stock_in"].includes(type);

const isStockOut = (type = "") =>
  ["out", "stock-out", "stock_out"].includes(type);

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN");
};

export default Analytics;