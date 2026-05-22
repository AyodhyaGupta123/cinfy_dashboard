import React, { useState } from "react";
import { Search, Download, AlertTriangle, PackageMinus } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const LowStock = () => {
  const [search, setSearch] = useState("");

  const lowStockItems = [
    {
      id: 1,
      product: "Cotton Kurti",
      sku: "PRD-001",
      category: "Women Wear",
      stock: 5,
      minStock: 20,
      status: "Critical",
    },
    {
      id: 2,
      product: "Silk Saree",
      sku: "PRD-002",
      category: "Saree",
      stock: 12,
      minStock: 25,
      status: "Low",
    },
    {
      id: 3,
      product: "Designer Dupatta",
      sku: "PRD-003",
      category: "Accessories",
      stock: 8,
      minStock: 30,
      status: "Critical",
    },
  ];

  const filteredLowStock = lowStockItems.filter((item) =>
    item.product.toLowerCase().includes(search.toLowerCase()),
  );

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
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Critical Items</p>
          <h3 className="text-2xl font-bold text-red-600">8</h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Need Restock</p>
          <h3 className="text-2xl font-bold text-orange-500">16</h3>
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
              placeholder="Search low stock product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <Button variant="outline">
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
                  SKU
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
              {filteredLowStock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{item.sku}</td>
                  <td className="px-4 py-4 text-gray-600">{item.category}</td>
                  <td className="px-4 py-4 font-semibold text-red-600">
                    {item.stock}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{item.minStock}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${
                        item.status === "Critical"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LowStock;