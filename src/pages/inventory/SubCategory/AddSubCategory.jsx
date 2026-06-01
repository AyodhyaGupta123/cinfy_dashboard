import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, Layers } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none";

const AddSubCategory = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    displayOrder: "",
    notes: "",
    status: "active",
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || res.data.data || res.data || []);
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Failed to load categories",
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Validation Error", "Parent category is required.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Sub category name is required.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/subcategories", {
        ...formData,
        displayOrder: Number(formData.displayOrder || 0),
      });

      if (res.data.success) {
        toast.success("Created", "Sub category added successfully.");
        navigate("/inventory/subcategories");
      }
    } catch (error) {
      toast.error(
        "Create Failed",
        error.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Sub Categories", path: "/inventory/subcategories" },
          { label: "Add Sub Category" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Sub Category</h1>
          <p className="text-gray-500 mt-1">
            Create a new sub category under a parent category.
          </p>
        </div>

        <Link to="/inventory/subcategories">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Layers size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Sub Category Information
            </h2>
            <p className="text-sm text-gray-500">
              Enter sub category details below.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">
              Parent Category <span className="text-red-500">*</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select parent category</option>
              {categories.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Sub Category Name <span className="text-red-500">*</span>
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter sub category name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Display Order
            </label>

            <input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter display order"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={textareaClass}
              placeholder="Enter sub category description"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className={textareaClass}
              placeholder="Enter additional notes"
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <Link to="/inventory/subcategories">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Sub Category"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSubCategory;
