import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, Package } from "lucide-react";
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

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    purchasePrice: "",
    sellingPrice: "",
    currentStock: "",
    minStockLevel: "",
    status: "active",
    unit: "pcs",
    description: "",
  });

  const fetchProduct = async () => {
    try {
      setFetching(true);

      const res = await api.get(`/products/${id}`);

      if (res.data.success) {
        const product = res.data.product;

        setFormData({
          name: product.name || "",
          sku: product.sku || "",
          category: product.category || "",
          brand: product.brand || "",
          purchasePrice: product.purchasePrice || "",
          sellingPrice: product.sellingPrice || "",
          currentStock: product.currentStock || "",
          minStockLevel: product.minStockLevel || "",
          status: product.status || "active",
          unit: product.unit || "pcs",
          description: product.description || "",
        });

        setPreviewImage(product.image ? getImageUrl(product.image) : "");
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load product"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProduct();
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

      const res = await api.put(`/products/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Updated", "Product updated successfully.");
        navigate("/inventory/products");
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
    return <div className="p-6 text-gray-500">Loading product...</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Products", path: "/inventory/products" },
          { label: "Edit Product" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-500 mt-1">
            Update product details. Product ID: {id}
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
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Package size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Product Information
            </h2>
            <p className="text-sm text-gray-500">
              Edit product, price, stock and category details.
            </p>
          </div>
        </div>

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
              value={formData.sku}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select category</option>
              <option value="Fashion">Fashion</option>
              <option value="Ethnic Wear">Ethnic Wear</option>
              <option value="Accessories">Accessories</option>
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
              <option value="Urban Style">Urban Style</option>
              <option value="Local">Local</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Price
            </label>
            <input
              type="number"
              name="purchasePrice"
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
              value={formData.sellingPrice}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Current Stock
            </label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
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

          <div>
            <label className="text-sm font-medium text-gray-700">
              Unit Type
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="pcs">PCS</option>
              <option value="kg">KG</option>
              <option value="ltr">LTR</option>
              <option value="box">Box</option>
              <option value="packet">Packet</option>
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

            {previewImage && (
              <div className="mt-4">
                <img
                  src={previewImage}
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
              value={formData.description}
              onChange={handleChange}
              className={textareaClass}
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Link to="/inventory/products">
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
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProduct;