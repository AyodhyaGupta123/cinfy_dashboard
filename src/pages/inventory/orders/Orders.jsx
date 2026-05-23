import React, { useEffect, useMemo, useState } from "react";
import { Search, Download, ShoppingBag, Eye, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Orders = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const value = `${item.orderNumber || ""} ${item.customerName || ""} ${
        item.customerPhone || ""
      }`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [orders, search]);

  const stats = useMemo(() => {
    const total = orders.length;

    const delivered = orders.filter(
      (item) => item.orderStatus === "delivered"
    ).length;

    const pending = orders.filter((item) =>
      ["pending", "confirmed", "packed", "shipped"].includes(item.orderStatus)
    ).length;

    return { total, delivered, pending };
  }, [orders]);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (status === "delivered") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (["pending", "confirmed", "packed", "shipped"].includes(status)) {
      return "bg-orange-50 text-orange-600 border-orange-100";
    }

    if (status === "cancelled") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-gray-50 text-gray-600 border-gray-100";
  };

  const getPaymentLabel = (status, method) => {
    if (status === "paid") return "Paid";
    if (method === "cod") return "COD";
    if (status === "refunded") return "Refunded";
    return status || "-";
  };

  const exportOrders = () => {
    const rows = [
      ["Order ID", "Customer", "Amount", "Payment", "Date", "Status"],
      ...filteredOrders.map((item) => [
        item.orderNumber,
        item.customerName,
        item.grandTotal,
        getPaymentLabel(item.paymentStatus, item.paymentMethod),
        formatDate(item.orderDate || item.createdAt),
        item.orderStatus,
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Orders" },
          { label: "All Orders" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage customer orders, payments and delivery status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ShoppingBag size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Delivered</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            {stats.delivered}
          </h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Pending / Shipped</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {stats.pending}
          </h3>
        </Card>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order or customer..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <Button variant="outline" onClick={exportOrders}>
            <Download size={18} />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Customer
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Payment
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {item.orderNumber}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {item.customerName}
                    </td>

                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {formatCurrency(item.grandTotal)}
                    </td>

                    <td className="px-4 py-4 text-gray-600 capitalize">
                      {getPaymentLabel(item.paymentStatus, item.paymentMethod)}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(item.orderDate || item.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusClass(
                          item.orderStatus
                        )}`}
                      >
                        <Truck size={13} />
                        {item.orderStatus}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <Link to={`/inventory/orders/${item._id}`}>
                        <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                          <Eye size={16} className="mx-auto" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Orders;