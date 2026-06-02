import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Download, PackagePlus } from "lucide-react";

import { Link } from "react-router-dom";

import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

const StockIn = () => {
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const fetchStockIn = async () => {
    try {
      setLoading(true);

      const res = await api.get("/stock", {
        params: {
          type: "stock-in",
        },
      });

      if (res.data.success) {
        setTransactions(res.data.transactions || res.data.data || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load stock entries",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStockIn();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const value = `
        ${item.product?.name || ""}
        ${item.product?.sku || ""}
        ${item.referenceNo || ""}
      `;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [transactions, search]);

  const stats = useMemo(() => {
    const totalQty = transactions.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0,
    );

    return {
      total: totalQty,
      completed: transactions.length,
      pending: 0,
    };
  }, [transactions]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const exportData = () => {
    const rows = [
      [
        "Product",
        "SKU",
        "Quantity",
        "Previous Stock",
        "New Stock",
        "Reference No",
        "Date",
      ],

      ...filteredTransactions.map((item) => [
        item.product?.name || "",
        item.product?.sku || "",
        item.quantity || 0,
        item.previousStock || 0,
        item.newStock || 0,
        item.referenceNo || "",
        formatDate(item.createdAt),
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "stock-in.csv";

    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Stock In" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock In</h1>

          <p className="text-gray-500 mt-1">
            Track incoming stock and inventory entries.
          </p>
        </div>

        <Link to="/inventory/stock-in/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Stock In
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <PackagePlus size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Stock In</p>

              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Total Entries</p>

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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search stock in..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <Button variant="outline" onClick={exportData}>
            <Download size={18} />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Product
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Quantity
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Previous
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  New Stock
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Reference
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading stock entries...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                          {item.product?.image ||
                          item.product?.thumbnail ||
                          item.product?.images?.[0] ? (
                            <img
                              src={getImageUrl(
                                item.product?.image ||
                                  item.product?.thumbnail ||
                                  item.product?.images?.[0],
                              )}
                              alt={item.product?.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <PackagePlus size={20} className="text-gray-400" />
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.product?.name}
                          </h4>

                          <p className="text-xs text-gray-500">
                            SKU: {item.product?.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-semibold text-emerald-600">
                      +{item.quantity}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {item.previousStock}
                    </td>

                    <td className="px-4 py-4 text-gray-900 font-semibold">
                      {item.newStock}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {item.referenceNo || "-"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No stock entries found.
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

export default StockIn;
