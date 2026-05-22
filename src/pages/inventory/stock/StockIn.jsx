import React, { useState } from "react";
import { Plus, Search, Download, PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const StockIn = () => {
  const [search, setSearch] = useState("");

  const stockIns = [
    {
      id: 1,
      product: "Cotton Kurti",
      sku: "PRD-001",
      supplier: "Raj Textile",
      quantity: 50,
      date: "21 May 2026",
      status: "Completed",
    },
    {
      id: 2,
      product: "Silk Saree",
      sku: "PRD-002",
      supplier: "Surat Fabrics",
      quantity: 25,
      date: "20 May 2026",
      status: "Pending",
    },
    {
      id: 3,
      product: "Designer Dupatta",
      sku: "PRD-003",
      supplier: "Fashion Hub",
      quantity: 80,
      date: "19 May 2026",
      status: "Completed",
    },
  ];

  const filteredStockIns = stockIns.filter((item) =>
    item.product.toLowerCase().includes(search.toLowerCase()),
  );

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
            Track incoming stock and supplier purchases.
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
              <h3 className="text-2xl font-bold text-gray-900">1,240</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Completed</p>
          <h3 className="text-2xl font-bold text-emerald-600">1,120</h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Pending</p>
          <h3 className="text-2xl font-bold text-orange-500">120</h3>
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
                  Supplier
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredStockIns.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{item.sku}</td>
                  <td className="px-4 py-4 text-gray-600">{item.supplier}</td>
                  <td className="px-4 py-4 font-semibold text-emerald-600">
                    +{item.quantity}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{item.date}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${
                        item.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
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

export default StockIn;
