import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Package,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import api from "../../../services/api";
import { useToast } from "../../../components/UI/Toast";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

const Products = () => {
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products || res.data.data || res.data || []);
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Deleted", "Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getStock = (product) =>
    Number(product.currentStock || product.openingStock || 0);

  const getProductStatus = (product) => {
    const stock = getStock(product);
    const minStock = Number(product.minStockLevel || 0);

    if (stock <= 0) return "Out of Stock";
    if (stock <= minStock) return "Low Stock";
    return "In Stock";
  };

  const getInventoryClass = (status) => {
    if (status === "In Stock")
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (status === "Low Stock")
      return "bg-orange-50 text-orange-600 border-orange-100";
    return "bg-red-50 text-red-600 border-red-100";
  };

  const getActiveClass = (status) => {
    if (status === "active") return "bg-emerald-50 text-emerald-600";
    if (status === "draft") return "bg-orange-50 text-orange-600";
    return "bg-red-50 text-red-600";
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const value = `
        ${item.name || ""}
        ${item.shortName || ""}
        ${item.sku || ""}
        ${item.brand || ""}
        ${item.category || ""}
        ${item.subCategory || ""}
        ${item.productType || ""}
        ${item.primaryUnit || item.unit || ""}
      `;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, search]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "active").length;
    const featured = products.filter((p) => p.featuredProduct).length;
    const outOfStock = products.filter((p) => getStock(p) <= 0).length;
    const lowStock = products.filter(
      (p) =>
        getStock(p) > 0 &&
        getStock(p) <= Number(p.minStockLevel || 0)
    ).length;

    return { total, active, featured, lowStock, outOfStock };
  }, [products]);

  const statCards = [
    {
      label: "Total Products",
      value: stats.total,
      icon: Package,
      className: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Active",
      value: stats.active,
      icon: CheckCircle,
      className: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Featured",
      value: stats.featured,
      icon: Star,
      className: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      icon: AlertTriangle,
      className: "bg-orange-50 text-orange-500",
    },
    {
      label: "Out Stock",
      value: stats.outOfStock,
      icon: XCircle,
      className: "bg-red-50 text-red-500",
    },
  ];

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Products" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 mt-1">
            Manage complete generic inventory products.
          </p>
        </div>

        <Link to="/inventory/products/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map((item) => (
          <Card key={item.label} className="p-4 bg-white">
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.className}`}
              >
                <item.icon size={21} />
              </div>

              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h3 className="text-xl font-bold text-gray-900">
                  {item.value}
                </h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Product List
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <Button variant="outline" onClick={fetchProducts}>
              <RefreshCw size={18} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Brand / Unit
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Stock
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Inventory
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
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const inventoryStatus = getProductStatus(product);
                  const stock = getStock(product);

                  return (
                    <tr
                      key={product._id || product.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {product.thumbnail || product.image ? (
                            <img
                              src={getImageUrl(
                                product.thumbnail || product.image
                              )}
                              alt={product.name}
                              className="h-12 w-12 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                              <Package size={18} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[240px]">
                              {product.name || "-"}
                            </p>
                            <p className="text-xs text-gray-400">
                              SKU: {product.sku || "-"}
                            </p>
                            <p className="text-xs text-gray-400">
                              Type: {product.productType || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        <p className="font-medium text-gray-800">
                          {product.category || "-"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.subCategory || "No sub category"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        <p className="font-medium text-gray-800">
                          {product.brand || "-"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.primaryUnit || product.unit || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        <p className="font-semibold text-gray-900">{stock}</p>
                        <p className="text-xs text-gray-400">
                          Min: {product.minStockLevel || 0}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900">
                          ₹{product.sellingPrice || 0}
                        </p>
                        <p className="text-xs text-gray-400">
                          MRP: ₹{product.mrp || 0}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getInventoryClass(
                            inventoryStatus
                          )}`}
                        >
                          {inventoryStatus}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${getActiveClass(
                            product.status || "active"
                          )}`}
                        >
                          {product.status || "active"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/inventory/products/${product._id}`}>
                            <button
                              type="button"
                              className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-600"
                            >
                              <Eye size={17} />
                            </button>
                          </Link>

                          <Link to={`/inventory/products/edit/${product._id}`}>
                            <button
                              type="button"
                              className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-600"
                            >
                              <Edit size={17} />
                            </button>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
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
                    No products found.
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

export default Products;