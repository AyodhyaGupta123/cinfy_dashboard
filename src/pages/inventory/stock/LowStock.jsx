import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  AlertTriangle,
  PackageMinus,
} from "lucide-react";

import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";

import api from "../../../services/api";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

const LowStock = () => {
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/stock/low-stock");

      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load low stock products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const value = `${item.name || ""} ${item.sku || ""} ${
        item.category || ""
      }`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, search]);

  const stats = useMemo(() => {
    const critical = products.filter(
      (item) => Number(item.currentStock || 0) <= 0
    ).length;

    const needRestock = products.filter(
      (item) => Number(item.currentStock || 0) > 0
    ).length;

    return {
      total: products.length,
      critical,
      needRestock,
    };
  }, [products]);

  const getStatus = (product) => {
    const stock = Number(product.currentStock || 0);

    if (stock <= 0) return "Critical";
    return "Low";
  };

  const getStatusClass = (status) => {
    if (status === "Critical") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-orange-50 text-orange-600 border-orange-100";
  };

  const exportData = () => {
    const rows = [
      ["Product", "SKU", "Category", "Current Stock", "Min Stock", "Status"],
      ...filteredProducts.map((item) => [
        item.name || "",
        item.sku || "",
        item.category || "",
        item.currentStock || 0,
        item.minStockLevel || 0,
        getStatus(item),
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "low-stock-products.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Low Stock" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Low Stock</h1>
          <p className="text-gray-500 mt-1">
            Track products that are running below minimum stock level.
          </p>
        </div>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <AlertTriangle size={18} />
          Stock Alert
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <PackageMinus size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Critical Items</p>
          <h3 className="text-2xl font-bold text-red-600">
            {stats.critical}
          </h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Need Restock</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {stats.needRestock}
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
              placeholder="Search low stock product..."
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
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Min Stock
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading low stock products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item) => {
                  const status = getStatus(item);

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <PackageMinus
                                size={20}
                                className="text-gray-400"
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              SKU: {item.sku || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.category || "-"}
                      </td>

                      <td className="px-4 py-4 font-semibold text-red-600">
                        {item.currentStock || 0}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.minStockLevel || 0}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No low stock products found.
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

export default LowStock;