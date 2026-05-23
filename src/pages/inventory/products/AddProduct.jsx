import React, { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    unit: "pcs",
    purchasePrice: "",
    sellingPrice: "",
    openingStock: "",
    minStockLevel: "",
    description: "",
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

    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Product name is required.");
      return;
    }

    if (!formData.sku.trim()) {
      toast.error("Validation Error", "SKU is required.");
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

      const res = await api.post("/products", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Product Created", "Product added successfully.");
        navigate("/inventory/products");
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
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Add Product" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
          <p className="text-gray-500 mt-1">
            Create a new product for your inventory.
          </p>
        </div>

        <Link to="/inventory/products">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              placeholder="PRD-001"
              value={formData.sku}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select category</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Grocery">Grocery</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select brand</option>
              <option value="Kat Forever">Kat Forever</option>
              <option value="Generic">Generic</option>
              <option value="Local">Local</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="pcs">Pcs</option>
              <option value="kg">Kg</option>
              <option value="ltr">Ltr</option>
              <option value="box">Box</option>
              <option value="packet">Packet</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Price
            </label>
            <input
              type="number"
              name="purchasePrice"
              placeholder="0"
              value={formData.purchasePrice}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Selling Price
            </label>
            <input
              type="number"
              name="sellingPrice"
              placeholder="0"
              value={formData.sellingPrice}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Opening Stock
            </label>
            <input
              type="number"
              name="openingStock"
              placeholder="0"
              value={formData.openingStock}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Low Stock Alert
            </label>
            <input
              type="number"
              name="minStockLevel"
              placeholder="10"
              value={formData.minStockLevel}
              onChange={handleChange}
              className={inputClass}
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
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={inputClass}
            />

            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-32 w-32 rounded-xl object-cover border border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              name="description"
              placeholder="Write product description..."
              value={formData.description}
              onChange={handleChange}
              className={textareaClass}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <Link to="/inventory/products">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;