import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  ClipboardList,
  Eye,
  PackageCheck,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
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
        error.response?.data?.message || "Failed to load issue orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getTotalQty = (items = []) =>
    items.reduce(
      (sum, item) => sum + Number(item.quantity || item.qty || 0),
      0,
    );

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const warehouseName =
        item.warehouse?.name ||
        item.warehouse?.warehouseName ||
        item.warehouseName ||
        "";

      const value = `${item.orderNumber || ""} ${item.issueOrderNumber || ""} ${
        item.department || ""
      } ${item.clientName || ""} ${warehouseName}`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [orders, search]);

  const stats = useMemo(() => {
    const total = orders.length;

    const issued = orders.filter((item) =>
      ["issued", "completed"].includes(
        String(item.status || item.orderStatus || "").toLowerCase(),
      ),
    ).length;

    const pending = orders.filter((item) =>
      ["draft", "pending", "approved"].includes(
        String(item.status || item.orderStatus || "").toLowerCase(),
      ),
    ).length;

    return { total, issued, pending };
  }, [orders]);

  const getStatusClass = (status = "") => {
    const value = status.toLowerCase();

    if (["issued", "completed"].includes(value)) {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (["draft", "pending", "approved"].includes(value)) {
      return "bg-orange-50 text-orange-600 border-orange-100";
    }

    if (value === "cancelled") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-gray-50 text-gray-600 border-gray-100";
  };

  const exportOrders = () => {
    const rows = [
      [
        "Issue Order No",
        "Department / Client",
        "Warehouse",
        "Items",
        "Total Qty",
        "Date",
        "Status",
      ],
      ...filteredOrders.map((item) => [
        item.orderNumber || item.issueOrderNumber || "",
        item.department || item.clientName || "",
        item.warehouse?.name ||
          item.warehouse?.warehouseName ||
          item.warehouseName ||
          "",
        item.items?.length || 0,
        getTotalQty(item.items || []),
        formatDate(item.issueDate || item.createdAt),
        item.status || item.orderStatus || "pending",
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "issue-orders.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Orders" },
          { label: "Issue Orders" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issue Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage internal stock issue, department dispatch, and warehouse stock
          movement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Issue Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <PackageCheck size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Issued / Completed</p>
              <h3 className="text-2xl font-bold text-emerald-600">
                {stats.issued}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending / Approved</p>
              <h3 className="text-2xl font-bold text-orange-500">
                {stats.pending}
              </h3>
            </div>
          </div>
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
              placeholder="Search issue order, department, or warehouse..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/inventory/orders/add">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Plus size={18} />
                Add Issue Order
              </Button>
            </Link>

            <Button variant="outline" onClick={exportOrders}>
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Issue Order No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Department / Client
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Warehouse
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Items
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Total Qty
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
                    colSpan="8"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading issue orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((item) => {
                  const status = item.status || item.orderStatus || "pending";

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {item.orderNumber || item.issueOrderNumber || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.department || item.clientName || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.warehouse?.name ||
                          item.warehouse?.warehouseName ||
                          item.warehouseName ||
                          "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.items?.length || 0}
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {getTotalQty(item.items || [])}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(item.issueDate || item.createdAt)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusClass(
                            status,
                          )}`}
                        >
                          <CheckCircle size={13} />
                          {status}
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
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No issue orders found.
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

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default Orders;
