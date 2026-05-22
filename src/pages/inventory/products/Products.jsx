import React, { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const Products = () => {
  const [search, setSearch] = useState("");

  const products = [
    {
      id: 1,
      name: "Cotton Kurti",
      sku: "PRD-001",
      category: "Fashion",
      brand: "Kat Forever",
      stock: 120,
      price: 1299,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Silk Saree",
      sku: "PRD-002",
      category: "Ethnic Wear",
      brand: "Kat Forever",
      stock: 8,
      price: 2499,
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Designer Dupatta",
      sku: "PRD-003",
      category: "Accessories",
      brand: "Kat Forever",
      stock: 0,
      price: 699,
      status: "Out of Stock",
    },
  ];

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusClass = (status) => {
    if (status === "In Stock") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (status === "Low Stock") {
      return "bg-orange-50 text-orange-600 border-orange-100";
    }

    return "bg-red-50 text-red-600 border-red-100";
  };

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
              <h3 className="text-2xl font-bold text-gray-900">3,240</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">In Stock</p>
          <h3 className="text-2xl font-bold text-emerald-600">2,980</h3>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h3 className="text-2xl font-bold text-orange-500">185</h3>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <h3 className="text-2xl font-bold text-red-500">75</h3>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-emerald-500"
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{product.sku}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {product.brand}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {product.stock}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      ₹{product.price}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/inventory/products/${product.id}`}>
                          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                            <Eye size={17} />
                          </button>
                        </Link>

                        <Link to={`/inventory/products/edit/${product.id}`}>
                          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                            <Edit size={17} />
                          </button>
                        </Link>

                        <button className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                          <Trash2 size={17} />
                        </button>
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