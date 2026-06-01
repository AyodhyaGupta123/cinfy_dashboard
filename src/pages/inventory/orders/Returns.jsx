import React, { useEffect, useMemo, useState } from "react";
import { Search, Download, RotateCcw, Eye, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Returns = () => {
  const [search, setSearch] = useState("");
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await api.get("/returns");

      if (res.data.success) {
        setReturns(res.data.returns || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load stock returns"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const filteredReturns = useMemo(() => {
    return returns.filter((item) => {
      const orderNo = item.issueOrder?.orderNumber || item.order?.orderNumber || "";
      const department =
        item.issueOrder?.department ||
        item.department ||
        item.clientName ||
        "";
      const warehouse =
        item.warehouse?.name ||
        item.issueOrder?.warehouse?.name ||
        item.warehouseName ||
        "";

      const value = `${item.returnNumber || ""} ${orderNo} ${department} ${warehouse} ${item.reason || ""}`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [returns, search]);

  const stats = useMemo(() => {
    const total = returns.length;

    const received = returns.filter((item) =>
      ["approved", "received", "completed"].includes(
        String(item.status || "").toLowerCase()
      )
    ).length;

    const pending = returns.filter((item) =>
      ["requested", "pending"].includes(String(item.status || "").toLowerCase())
    ).length;

    return { total, received, pending };
  }, [returns]);

  const getTotalQty = (items = []) => {
    return items.reduce(
      (sum, item) => sum + Number(item.quantity || item.qty || 0),
      0
    );
  };

  const getStatusClass = (status = "") => {
    const value = status.toLowerCase();

    if (["approved", "received", "completed"].includes(value)) {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (value === "rejected" || value === "cancelled") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-orange-50 text-orange-600 border-orange-100";
  };

  const exportReturns = () => {
    const rows = [
      [
        "Return No",
        "Issue Order No",
        "Department / Client",
        "Warehouse",
        "Items",
        "Total Qty",
        "Reason",
        "Date",
        "Status",
      ],
      ...filteredReturns.map((item) => [
        item.returnNumber || "",
        item.issueOrder?.orderNumber || item.order?.orderNumber || "",
        item.issueOrder?.department || item.department || item.clientName || "",
        item.warehouse?.name ||
          item.issueOrder?.warehouse?.name ||
          item.warehouseName ||
          "",
        item.items?.length || 0,
        getTotalQty(item.items || []),
        item.reason || "",
        formatDate(item.createdAt || item.returnDate),
        item.status || "",
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "stock-returns.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Orders" },
          { label: "Stock Returns" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Returns</h1>
        <p className="text-gray-500 mt-1">
          Manage returned stock from departments, clients, or issue orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <RotateCcw size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Stock Returns</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Received / Completed</p>
              <h3 className="text-2xl font-bold text-emerald-600">
                {stats.received}
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
              <p className="text-sm text-gray-500">Pending Returns</p>
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
              placeholder="Search return no, issue order, department, or warehouse..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <Button variant="outline" onClick={exportReturns}>
            <Download size={18} />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Return No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Issue Order
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
                  Reason
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
                    colSpan="10"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading stock returns...
                  </td>
                </tr>
              ) : filteredReturns.length > 0 ? (
                filteredReturns.map((item) => {
                  const status = item.status || "pending";

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {item.returnNumber || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.issueOrder?.orderNumber ||
                          item.order?.orderNumber ||
                          "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.issueOrder?.department ||
                          item.department ||
                          item.clientName ||
                          "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.warehouse?.name ||
                          item.issueOrder?.warehouse?.name ||
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
                        {item.reason || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(item.createdAt || item.returnDate)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <Link to={`/inventory/returns/${item._id}`}>
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
                    colSpan="10"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No stock returns found.
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

export default Returns;