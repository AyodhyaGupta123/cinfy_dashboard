import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, FolderTree, Upload } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    parentCategory: "",
    description: "",
  });

  const fetchCategory = async () => {
    try {
      setFetching(true);

      const res = await api.get(`/categories/${id}`);
      const category = res.data.category || res.data;

      setFormData({
        name: category.name || "",
        parentCategory: category.parentCategory || "",
        description: category.description || "",
      });

      setPreviewImage(category.image ? getImageUrl(category.image) : "");
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Failed to load category"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", "Please select only image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File Too Large", "Image size should be less than 2MB.");
      return;
    }

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Category name is required.");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.name);
      form.append("parentCategory", formData.parentCategory);
      form.append("description", formData.description);

      if (image) {
        form.append("image", image);
      }

      const res = await api.put(`/categories/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Category Updated", "Category updated successfully.");
        navigate("/inventory/categories");
      }
    } catch (error) {
      toast.error(
        "Update Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-6 text-gray-500">Loading category...</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Categories", path: "/inventory/categories" },
          { label: "Edit Category" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-500 mt-1">
            Update category details for your products.
          </p>
        </div>

        <Link to="/inventory/categories">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <FolderTree size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Category
            </h2>
            <p className="text-sm text-gray-500">
              Update category for your products.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Parent Category{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>

            <select
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select parent category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="grocery">Grocery</option>
            </select>

            <p className="mt-2 text-sm text-gray-500">
              Leave empty if this is a top-level category
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              placeholder="Enter category description (optional)"
              value={formData.description}
              onChange={handleChange}
              className={textareaClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Category Image{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>

            <label className="mt-2 flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 text-center hover:border-emerald-400 hover:bg-emerald-50/40">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <Upload size={28} className="mb-2 text-black" />
              <p className="text-sm font-semibold text-black">
                Upload Image
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG (Max. 2MB)
              </p>
            </label>

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-4 h-32 w-32 rounded-xl object-cover border border-gray-200"
              />
            )}
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Link to="/inventory/categories">
              <Button
                variant="outline"
                type="button"
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
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditCategory;