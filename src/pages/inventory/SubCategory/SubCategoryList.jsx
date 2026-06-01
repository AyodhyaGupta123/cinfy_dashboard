import React, { useEffect, useMemo, useState } from "react";
import { Edit, Layers, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const SubCategoryList = () => {
  const toast = useToast();

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchSubCategories = async () => {
    try {
      setLoading(true);

      const res = await api.get("/subcategories");

      if (res.data.success) {
        setSubCategories(
          res.data.subCategories || res.data.subcategories || res.data.data || []
        );
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load sub categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sub category?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/subcategories/${id}`);

      if (res.data.success) {
        toast.success("Deleted", "Sub category deleted successfully.");
        fetchSubCategories();
      }
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((item) => {
      const value = `${item.name || ""} ${item.category || ""} ${
        item.description || ""
      }`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [subCategories, search]);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Sub Categories" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sub Categories</h1>
          <p className="text-gray-500 mt-1">
            Manage product sub categories for generic inventory.
          </p>
        </div>

        <Link to="/inventory/categories/add-subcategory">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Sub Category
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Layers size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Sub Category List
              </h2>
              <p className="text-sm text-gray-500">
                View, edit and delete sub categories.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Search sub category..."
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  Sub Category
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Parent Category
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Display Order
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading sub categories...
                  </td>
                </tr>
              ) : filteredSubCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No sub category found.
                  </td>
                </tr>
              ) : (
                filteredSubCategories.map((item) => (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.description || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {typeof item.category === "object"
                        ? item.category?.name
                        : item.category || "-"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.displayOrder || 0}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.status || "active"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/inventory/subcategories/edit/${item._id}`}>
                          <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center">
                            <Edit size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="h-9 w-9 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SubCategoryList;