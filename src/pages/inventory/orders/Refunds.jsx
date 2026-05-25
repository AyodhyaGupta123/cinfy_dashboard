import React, { useEffect, useMemo, useState } from "react";
import { Search, Download, IndianRupee, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Refunds = () => {
  const [search, setSearch] = useState("");
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await api.get("/refunds");

      if (res.data.success) {
        setRefunds(res.data.refunds || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load refunds"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const filteredRefunds = useMemo(() => {
    return refunds.filter((item) => {
      const value = `${item.refundNumber || ""} ${
        item.order?.orderNumber || ""
      } ${item.order?.customerName || ""} ${item.method || ""}`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [refunds, search]);

  const stats = useMemo(() => {
    const totalAmount = refunds.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const processedAmount = refunds
      .filter((item) => item.status === "completed")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const pendingAmount = refunds
      .filter((item) => ["pending", "processing", "failed"].includes(item.status))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return { totalAmount, processedAmount, pendingAmount };
  }, [refunds]);

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
    if (status === "completed") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (["pending", "processing"].includes(status)) {
      return "bg-orange-50 text-orange-600 border-orange-100";
    }

    return "bg-red-50 text-red-600 border-red-100";
  };

  const exportRefunds = () => {
    const rows = [
      ["Refund ID", "Order ID", "Customer", "Amount", "Method", "Date", "Status"],
      ...filteredRefunds.map((item) => [
        item.refundNumber || "",
        item.order?.orderNumber || "",
        item.order?.customerName || "",
        item.amount || 0,
        item.method || "",
        formatDate(item.createdAt),
        item.status || "",
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "refunds.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Orders" },
          { label: "Refunds" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Refunds</h1>
        <p className="text-gray-500 mt-1">
          Track refund requests, payment method and refund status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <IndianRupee size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Refunds</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalAmount)}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Processed</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            {formatCurrency(stats.processedAmount)}
          </h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Pending / Failed</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {formatCurrency(stats.pendingAmount)}
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
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search refund, order or customer..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <Button variant="outline" onClick={exportRefunds}>
            <Download size={18} />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Refund ID
                </th>
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
                  Method
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
                    Loading refunds...
                  </td>
                </tr>
              ) : filteredRefunds.length > 0 ? (
                filteredRefunds.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {item.refundNumber}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {item.order?.orderNumber || "-"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {item.order?.customerName || "-"}
                    </td>

                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </td>

                    <td className="px-4 py-4 text-gray-600 capitalize">
                      {item.method || "-"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <Link to={`/inventory/refunds/${item._id}`}>
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
                    colSpan="8"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No refunds found.
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

export default Refunds;