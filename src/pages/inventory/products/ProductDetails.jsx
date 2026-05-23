import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Package,
  Barcode,
  IndianRupee,
  Boxes,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
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

const ProductDetails = () => {
  const { id } = useParams();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/products/${id}`);

      if (res.data.success) {
        setProduct(res.data.product);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load product details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const status = useMemo(() => {
    if (!product) return "";

    const stock = Number(product.currentStock || 0);
    const minStock = Number(product.minStockLevel || 0);

    if (stock <= 0) return "Out of Stock";
    if (stock <= minStock) return "Low Stock";
    return "In Stock";
  }, [product]);

  const statusClass = useMemo(() => {
    if (status === "In Stock") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (status === "Low Stock") {
      return "bg-orange-50 text-orange-600 border-orange-100";
    }

    return "bg-red-50 text-red-600 border-red-100";
  }, [status]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", path: "/" },
            { label: "Inventory" },
            { label: "Products", path: "/inventory/products" },
            { label: "Product Details" },
          ]}
        />

        <Card className="p-6 text-center text-gray-500">
          Product not found.
        </Card>
      </div>
    );
  }

  const infoItems = [
    { label: "SKU", value: product.sku },
    { label: "Barcode", value: product.barcode || "-" },
    { label: "Category", value: product.category || "-" },
    { label: "Brand", value: product.brand || "-" },
    { label: "Unit", value: product.unit || "pcs" },
    { label: "Status", value: status },
  ];

  const currentStock = Number(product.currentStock || 0);
  const purchasePrice = Number(product.purchasePrice || 0);
  const stockValue = currentStock * purchasePrice;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Products", path: "/inventory/products" },
          { label: "Product Details" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Details
          </h1>
          <p className="text-gray-500 mt-1">
            View complete product stock and pricing information.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/inventory/products">
            <Button variant="outline">
              <ArrowLeft size={18} />
              Back
            </Button>
          </Link>

          <Link to={`/inventory/products/edit/${product._id}`}>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Edit size={18} />
              Edit Product
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="h-40 w-40 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center overflow-hidden border border-gray-100">
            {product.image ? (
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package size={64} />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-gray-500 mt-2">
                  {product.description || "No description available."}
                </p>
              </div>

              <span
                className={`inline-flex w-fit px-3 py-1 rounded-full border text-xs font-semibold ${statusClass}`}
              >
                {status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <IndianRupee size={17} />
                  Selling Price
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  ₹{product.sellingPrice || 0}
                </h3>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <IndianRupee size={17} />
                  Purchase Price
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  ₹{product.purchasePrice || 0}
                </h3>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Boxes size={17} />
                  Current Stock
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {currentStock}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            Product Information
          </h3>

          <div className="space-y-4">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-gray-100 pb-3"
              >
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            Stock Summary
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Available Stock</span>
              <span className="text-sm font-medium text-gray-900">
                {currentStock} {product.unit || "pcs"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Low Stock Alert</span>
              <span className="text-sm font-medium text-orange-500">
                {product.minStockLevel || 0} {product.unit || "pcs"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Stock Value</span>
              <span className="text-sm font-medium text-gray-900">
                ₹{stockValue}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3">
              <span className="text-sm text-gray-500">Barcode</span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
                <Barcode size={16} />
                {product.barcode || "-"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;