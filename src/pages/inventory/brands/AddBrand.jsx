import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Tags, Upload } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none";

const AddBrand = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    website: "",
    description: "",
    categories: "",
    status: "active",
  });

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

      const res = await api.post("/brands", form);

      if (res.data.success) {
        toast.success("Brand Created", "Brand added successfully.");
        navigate("/inventory/brands");
      }
    } catch (error) {
      toast.error(
        "Create Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Brands", path: "/inventory/brands" },
          { label: "Add Brand" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Add New Brand
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Add a new brand and link it with product categories.
          </p>
        </div>

        <Link to="/inventory/brands" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 sm:h-12 sm:w-12">
            <Tags size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Brand Information
            </h2>
            <p className="text-sm text-gray-500">Fill brand details below.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">
              Brand Name <span className="text-red-500">*</span>
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
            <label className="text-sm font-medium text-gray-700">
              Brand Code <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="code"
              placeholder="Example: ROYAL001"
              value={formData.code}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Website
            </label>

            <input
              type="url"
              name="website"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
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
            <label className="text-sm font-medium text-gray-700">
              Select Category <span className="text-gray-400">(Optional)</span>
            </label>

            <select
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Choose category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="grocery">Grocery</option>
            </select>
          </div>

          <div className="md:row-span-2">
            <label className="text-sm font-medium text-gray-700">
              Brand Logo <span className="text-gray-400">(Optional)</span>
            </label>

            <label className="mt-2 flex min-h-[134px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 text-center transition-all hover:border-emerald-400 hover:bg-emerald-50/40">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <Upload size={28} className="mb-2 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700">
                Upload Brand Logo
              </p>
              <p className="mt-1 text-xs text-gray-500">JPG, PNG up to 2MB</p>
            </label>

            {image && (
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-20 w-20 rounded-xl border border-gray-200 object-cover"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter brand description"
              value={formData.description}
              onChange={handleChange}
              rows={1}
              className={textareaClass}
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <Link to="/inventory/brands" className="w-full sm:w-auto">
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
              className="w-full bg-emerald-500 text-white hover:bg-emerald-600 sm:w-auto"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Brand"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddBrand;