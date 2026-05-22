import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Download, Tags, Edit, Trash2 } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Brands = () => {
  const [search, setSearch] = useState("");

  const brands = [
    {
      id: 1,
      name: "Raymond",
      code: "BRD-001",
      products: 42,
      status: "Active",
      createdAt: "21 May 2026",
    },
    {
      id: 2,
      name: "Manyavar",
      code: "BRD-002",
      products: 28,
      status: "Active",
      createdAt: "20 May 2026",
    },
    {
      id: 3,
      name: "Local Fashion",
      code: "BRD-003",
      products: 15,
      status: "Inactive",
      createdAt: "18 May 2026",
    },
  ];

  const filteredBrands = brands.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Brands" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-500 mt-1">
            Manage product brands and organize inventory items.
          </p>
        </div>

        <Link to="/inventory/brands/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Brand
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Tags size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Brands</p>
              <h3 className="text-2xl font-bold text-gray-900">32</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Active Brands</p>
          <h3 className="text-2xl font-bold text-emerald-600">28</h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Inactive Brands</p>
          <h3 className="text-2xl font-bold text-orange-500">4</h3>
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
              placeholder="Search brand..."
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
                  Brand Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Products
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Created At
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredBrands.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{item.code}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {item.products}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{item.createdAt}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Edit size={16} className="mx-auto" />
                      </button>
                      <button className="h-9 w-9 rounded-lg border border-red-100 text-red-500 hover:bg-red-50">
                        <Trash2 size={16} className="mx-auto" />
                      </button>
                    </div>
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

export default Brands;