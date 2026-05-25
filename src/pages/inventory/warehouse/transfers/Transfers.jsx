import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Download, ArrowLeftRight, Eye, Edit } from "lucide-react";
import Card from "../../../../components/UI/Card";
import Button from "../../../../components/UI/Button";
import Breadcrumb from "../../../../components/UI/Breadcrumb";
import { useToast } from "../../../../components/UI/Toast";
import api from "../../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Transfers = () => {
  const [search, setSearch] = useState("");
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transfers");

      if (res.data.success) {
        setTransfers(res.data.transfers || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load transfers",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((item) => {
      const value = `${item.transferNumber || ""} ${item.product?.name || ""} ${
        item.product?.sku || ""
      } ${item.fromWarehouse?.name || ""} ${item.toWarehouse?.name || ""}`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [transfers, search]);

  const stats = useMemo(() => {
    return {
      total: transfers.length,
      completed: transfers.filter((item) => item.status === "completed").length,
      pending: transfers.filter((item) =>
        ["pending", "in-transit"].includes(item.status),
      ).length,
    };
  }, [transfers]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const exportTransfers = () => {
    const rows = [
      ["Transfer No", "Product", "From", "To", "Qty", "Date", "Status"],
      ...filteredTransfers.map((item) => [
        item.transferNumber || "",
        item.product?.name || "",
        item.fromWarehouse?.name || "",
        item.toWarehouse?.name || "",
        item.quantity || 0,
        formatDate(item.createdAt),
        item.status || "",
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "transfers.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (status === "cancelled") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-orange-50 text-orange-600 border-orange-100";
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Transfers" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
          <p className="text-gray-500 mt-1">
            Track stock movement between warehouses and locations.
          </p>
        </div>

        <Link to="/inventory/transfers/create">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Create Transfer
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ArrowLeftRight size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transfers</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Completed</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            {stats.completed}
          </h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Pending</p>
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search transfer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <Button variant="outline" onClick={exportTransfers}>
            <Download size={18} />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Transfer No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  From
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  To
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Qty
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
                    Loading transfers...
                  </td>
                </tr>
              ) : filteredTransfers.length > 0 ? (
                filteredTransfers.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {item.transferNumber}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.product?.name || "-"}
                      <p className="text-xs text-gray-400">
                        SKU: {item.product?.sku || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.fromWarehouse?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.toWarehouse?.name || "-"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {item.quantity || 0}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusClass(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/inventory/transfers/${item._id}`}>
                          <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <Eye size={16} className="mx-auto" />
                          </button>
                        </Link>

                        <Link to={`/inventory/transfers/edit/${item._id}`}>
                          <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <Edit size={16} className="mx-auto" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No transfers found.
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

export default Transfers;
