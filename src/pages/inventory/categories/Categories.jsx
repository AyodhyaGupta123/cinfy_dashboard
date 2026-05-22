import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, FolderTree } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Categories = () => {
  const [search, setSearch] = useState("");

  const categories = [
    {
      id: 1,
      name: "Fashion",
      products: 128,
      status: "Active",
    },
    {
      id: 2,
      name: "Electronics",
      products: 84,
      status: "Active",
    },
    {
      id: 3,
      name: "Grocery",
      products: 52,
      status: "Inactive",
    },
  ];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Categories" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">
            Manage product categories for your inventory.
          </p>
        </div>

        <Link to="/inventory/categories/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <FolderTree size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Categories</p>
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Active Categories</p>
          <h3 className="text-2xl font-bold text-emerald-600">21</h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Inactive Categories</p>
          <h3 className="text-2xl font-bold text-red-500">3</h3>
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
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Category name"
              className={inputClass}
            />
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Save
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Products
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
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {category.products}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${
                        category.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/inventory/categories/edit/${category.id}`}>
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Categories;
