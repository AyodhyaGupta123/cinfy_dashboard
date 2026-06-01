import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, FolderTree } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Categories = () => {
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await api.get("/categories");

      setCategories(res.data.categories || res.data || []);
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/categories/${id}`);

      toast.success("Deleted", "Category deleted successfully.");
      fetchCategories();
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const value = `${category.name || ""} ${
        category.parentCategory || ""
      } ${category.description || ""}`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [categories, search]);

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

      <Card className="p-5 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <FolderTree size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Category List
              </h2>
              <p className="text-sm text-gray-500">
                Total {filteredCategories.length} categories found.
              </p>
            </div>
          </div>

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
        </div>

        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Category
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Parent Category
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Description
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
                    colSpan="4"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={getImageUrl(category.image)}
                            alt={category.name}
                            className="h-11 w-11 rounded-xl object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <FolderTree size={18} />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-gray-900">
                            {category.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {category.parentCategory || "Top Level Category"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {category.description || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/inventory/categories/edit/${category._id}`}>
                          <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-600"
                          >
                            <Edit size={17} />
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(category._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No categories found.
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

export default Categories;