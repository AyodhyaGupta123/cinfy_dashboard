import React from "react";
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

const ProductDetails = () => {
  const { id } = useParams();

  const product = {
    id,
    name: "Cotton Kurti",
    sku: "PRD-001",
    barcode: "8901234567890",
    category: "Fashion",
    brand: "Kat Forever",
    unit: "PCS",
    purchasePrice: 850,
    sellingPrice: 1299,
    stock: 120,
    lowStockAlert: 10,
    status: "In Stock",
    description: "Premium quality cotton kurti for daily and festive wear.",
  };

  const infoItems = [
    { label: "SKU", value: product.sku },
    { label: "Barcode", value: product.barcode },
    { label: "Category", value: product.category },
    { label: "Brand", value: product.brand },
    { label: "Unit", value: product.unit },
    { label: "Status", value: product.status },
  ];

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

          <Link to={`/inventory/products/edit/${product.id}`}>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Edit size={18} />
              Edit Product
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="h-40 w-40 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Package size={64} />
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-gray-500 mt-2">{product.description}</p>
              </div>

              <span className="inline-flex w-fit px-3 py-1 rounded-full border text-xs font-semibold bg-emerald-50 text-emerald-600 border-emerald-100">
                {product.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <IndianRupee size={17} />
                  Selling Price
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  ₹{product.sellingPrice}
                </h3>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <IndianRupee size={17} />
                  Purchase Price
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  ₹{product.purchasePrice}
                </h3>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Boxes size={17} />
                  Current Stock
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {product.stock}
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
                {product.stock} {product.unit}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Low Stock Alert</span>
              <span className="text-sm font-medium text-orange-500">
                {product.lowStockAlert} {product.unit}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Stock Value</span>
              <span className="text-sm font-medium text-gray-900">
                ₹{product.stock * product.purchasePrice}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3">
              <span className="text-sm text-gray-500">Barcode</span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
                <Barcode size={16} />
                {product.barcode}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;