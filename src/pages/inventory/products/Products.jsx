import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, Package } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");

      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load products",
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
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/products/${id}`);

      if (res.data.success) {
        toast.success("Deleted", "Product deleted successfully.");
        fetchProducts();
      }
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Something went wrong",
      );
    }
  };

  const getProductStatus = (product) => {
    const stock = Number(product.currentStock || 0);
    const minStock = Number(product.minStockLevel || 0);

    if (stock <= 0) return "Out of Stock";
    if (stock <= minStock) return "Low Stock";
    return "In Stock";
  };

  const getStatusClass = (status) => {
    if (status === "In Stock") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (status === "Low Stock") {
      return "bg-orange-50 text-orange-600 border-orange-100";
    }

    return "bg-red-50 text-red-600 border-red-100";
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const value = `${item.name || ""} ${item.sku || ""} ${item.brand || ""} ${
        item.category || ""
      }`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, search]);

  const stats = useMemo(() => {
    const total = products.length;

    const outOfStock = products.filter(
      (p) => Number(p.currentStock || 0) <= 0,
    ).length;

    const lowStock = products.filter(
      (p) =>
        Number(p.currentStock || 0) > 0 &&
        Number(p.currentStock || 0) <= Number(p.minStockLevel || 0),
    ).length;

    const inStock = products.filter(
      (p) => Number(p.currentStock || 0) > Number(p.minStockLevel || 0),
    ).length;

    return { total, inStock, lowStock, outOfStock };
  }, [products]);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Products" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">
            Manage your complete product inventory.
          </p>
        </div>

        <Link to="/inventory/products/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Package size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">In Stock</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            {stats.inStock}
          </h3>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {stats.lowStock}
          </h3>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <h3 className="text-2xl font-bold text-red-500">
            {stats.outOfStock}
          </h3>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-emerald-500 text-gray-900 bg-white"
            />
          </div>

          <Button variant="outline">
            <Filter size={18} />
            Filter
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
                  SKU
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Brand
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Stock
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Price
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
                  const status = getProductStatus(product);

                  return (
                    <tr
                      key={product._id || product.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="h-11 w-11 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                              <Package size={18} />
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product.unit || "pcs"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-gray-600">{product.sku}</td>

                      <td className="px-4 py-4 text-gray-600">
                        {product.category || "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {product.brand || "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {product.currentStock || 0}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        ₹{product.sellingPrice || 0}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                            status,
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/inventory/products/${product._id}`}>
                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                              <Eye size={17} />
                            </button>
                          </Link>

                          <Link to={`/inventory/products/edit/${product._id}`}>
                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                              <Edit size={17} />
                            </button>
                          </Link>

                          <button
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
