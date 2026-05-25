import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Tags } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "active",
    description: "",
  });

  const fetchBrand = async () => {
    try {
      setFetching(true);

      const res = await api.get(`/brands/${id}`);

      if (res.data.success) {
        const brand = res.data.brand;

        setFormData({
          name: brand.name || "",
          code: brand.code || "",
          status: brand.status || "active",
          description: brand.description || "",
        });

        setPreviewImage(brand.image ? getImageUrl(brand.image) : "");
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load brand"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBrand();
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

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Brand name is required.");
      return;
    }

    if (!formData.code.trim()) {
      toast.error("Validation Error", "Brand code is required.");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      if (image) {
        form.append("image", image);
      }

      const res = await api.put(`/brands/${id}`, form);

      if (res.data.success) {
        toast.success("Updated", "Brand updated successfully.");
        navigate("/inventory/brands");
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
    return <div className="p-6 text-gray-500">Loading brand...</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Brands", path: "/inventory/brands" },
          { label: "Edit Brand" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Brand</h1>
          <p className="text-gray-500 mt-1">
            Update brand details and image.
          </p>
        </div>

        <Link to="/inventory/brands">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Brands
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Tags size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Brand Information
              </h2>
              <p className="text-sm text-gray-500">
                Edit brand name, code, image and status details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter brand name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand Code
              </label>
              <input
                type="text"
                name="code"
                placeholder="BRD-001"
                value={formData.code}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={inputClass}
              />

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-4 h-24 w-24 rounded-xl object-cover border border-gray-200"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Write brand description..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`${inputClass} h-auto py-3 resize-none`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/inventory/brands">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save size={18} />
              {loading ? "Updating..." : "Update Brand"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditBrand;