import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Package,
  Barcode,
  IndianRupee,
  Boxes,
  Tag,
  Layers,
  ShieldCheck,
  Truck,
  ImageIcon,
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

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="mb-5 flex items-center gap-2">
    <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
      <Icon size={18} />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-900 text-right">
      {value || "-"}
    </span>
  </div>
);

const Badge = ({ children, active = true }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
      active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
    }`}
  >
    {children}
  </span>
);

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
        setProduct(res.data.product || res.data.data);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load product details",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const inventoryStatus = useMemo(() => {
    if (!product) return "";

    const stock = Number(product.currentStock || product.openingStock || 0);
    const minStock = Number(product.minStockLevel || 0);

    if (stock <= 0) return "Out of Stock";
    if (stock <= minStock) return "Low Stock";
    return "In Stock";
  }, [product]);

  const inventoryStatusClass = useMemo(() => {
    if (inventoryStatus === "In Stock") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (inventoryStatus === "Low Stock") {
      return "bg-orange-50 text-orange-600 border-orange-100";
    }

    return "bg-red-50 text-red-600 border-red-100";
  }, [inventoryStatus]);

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

  const currentStock = Number(
    product.currentStock || product.openingStock || 0,
  );
  const purchasePrice = Number(product.purchasePrice || 0);
  const sellingPrice = Number(product.sellingPrice || 0);
  const stockValue = currentStock * purchasePrice;

  const profitMargin =
    purchasePrice && sellingPrice && sellingPrice > purchasePrice
      ? (((sellingPrice - purchasePrice) / sellingPrice) * 100).toFixed(2)
      : "0.00";

  const galleryImages = product.images || [];

  const features = [
    ["Published", product.published],
    ["Featured Product", product.featuredProduct],
    ["Online Only", product.onlineOnly],
    ["Returnable", product.returnable],
    ["Fragile", product.fragile],
    ["COD Available", product.codAvailable],
    ["Subscription Product", product.subscriptionProduct],
    ["Perishable", product.perishable],
    ["Requires Shipping", product.requiresShipping],
    ["Fast Moving", product.fastMoving],
    ["Seasonal", product.seasonal],
    ["High Margin", product.highMargin],
    ["Bestseller", product.bestseller],
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
          <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
          <p className="text-gray-500 mt-1">
            View complete product information for generic inventory.
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
          <div className="h-44 w-44 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center overflow-hidden border border-gray-100">
            {product.thumbnail || product.image ? (
              <img
                src={getImageUrl(product.thumbnail || product.image)}
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
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h2>
                  <Badge>{product.productType || "Simple Product"}</Badge>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {product.shortName || "No short name"}
                </p>

                <p className="text-gray-500 mt-3">
                  {product.productDescription ||
                    product.description ||
                    "No description available."}
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-2">
                <span
                  className={`inline-flex w-fit px-3 py-1 rounded-full border text-xs font-semibold ${inventoryStatusClass}`}
                >
                  {inventoryStatus}
                </span>

                <span className="inline-flex w-fit px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold capitalize">
                  {product.status || "active"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
                  MRP
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  ₹{product.mrp || 0}
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

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Tag size={17} />
                  Profit Margin
                </div>
                <h3 className="text-2xl font-bold text-emerald-600 mt-2">
                  {profitMargin}%
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {galleryImages.length > 0 && (
        <Card className="p-6 bg-white">
          <SectionTitle icon={ImageIcon} title="Gallery Images" />

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {galleryImages.map((image, index) => (
              <img
                key={index}
                src={getImageUrl(image)}
                alt={`Product ${index + 1}`}
                className="h-28 w-full rounded-xl border object-cover"
              />
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <SectionTitle icon={Package} title="Basic Information" />

          <InfoRow label="SKU" value={product.sku} />
          <InfoRow label="Barcode / QR Code" value={product.barcode} />
          <InfoRow label="Product Type" value={product.productType} />
          <InfoRow label="Category" value={product.category?.name || "-"} />

          <InfoRow
            label="Sub Category"
            value={product.subCategory?.name || "No sub category"}
          />

          <InfoRow label="Brand" value={product.brand?.name || "-"} />
          <InfoRow label="HSN / SAC Code" value={product.hsnSacCode} />
          <InfoRow label="Internal Code" value={product.internalProductCode} />
          <InfoRow
            label="Primary Unit"
            value={product.primaryUnit || product.unit}
          />
          <InfoRow label="Visibility" value={product.visibility} />
        </Card>

        <Card className="p-6 bg-white">
          <SectionTitle icon={IndianRupee} title="Pricing Information" />

          <InfoRow
            label="Purchase Price"
            value={`₹${product.purchasePrice || 0}`}
          />
          <InfoRow
            label="Selling Price"
            value={`₹${product.sellingPrice || 0}`}
          />
          <InfoRow label="MRP" value={`₹${product.mrp || 0}`} />
          <InfoRow
            label="Wholesale Price"
            value={`₹${product.wholesalePrice || 0}`}
          />
          <InfoRow
            label="Distributor Price"
            value={`₹${product.distributorPrice || 0}`}
          />
          <InfoRow label="Tax" value={product.tax ? `${product.tax}%` : "0%"} />
          <InfoRow label="Discount Type" value={product.discountType} />
          <InfoRow label="Discount Value" value={product.discountValue || 0} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <SectionTitle icon={Boxes} title="Stock Summary" />

          <InfoRow label="Opening Stock" value={product.openingStock || 0} />
          <InfoRow label="Current Stock" value={currentStock} />
          <InfoRow
            label="Minimum Stock Alert"
            value={product.minStockLevel || 0}
          />
          <InfoRow
            label="Reorder Quantity"
            value={product.reorderQuantity || 0}
          />
          <InfoRow label="Maximum Stock" value={product.maximumStock || 0} />
          <InfoRow
            label="Warehouse / Store"
            value={product.warehouseLocation}
          />
          <InfoRow label="Stock Value" value={`₹${stockValue}`} />
          <InfoRow label="Inventory Status" value={inventoryStatus} />
        </Card>

        <Card className="p-6 bg-white">
          <SectionTitle icon={ShieldCheck} title="Stock Settings" />

          <div className="flex flex-wrap gap-2">
            <Badge active={product.enableStockTracking}>
              Stock Tracking: {product.enableStockTracking ? "Yes" : "No"}
            </Badge>
            <Badge active={product.allowNegativeStock}>
              Negative Stock: {product.allowNegativeStock ? "Yes" : "No"}
            </Badge>
            <Badge active={product.trackBatchNumber}>
              Batch Tracking: {product.trackBatchNumber ? "Yes" : "No"}
            </Badge>
            <Badge active={product.trackSerialNumber}>
              Serial Tracking: {product.trackSerialNumber ? "Yes" : "No"}
            </Badge>
            <Badge active={product.enableExpiryTracking}>
              Expiry Tracking: {product.enableExpiryTracking ? "Yes" : "No"}
            </Badge>
            <Badge active={product.enableVariants}>
              Variants: {product.enableVariants ? "Yes" : "No"}
            </Badge>
          </div>
        </Card>
      </div>

      {product.unitConversions?.length > 0 && (
        <Card className="p-6 bg-white">
          <SectionTitle icon={Layers} title="Unit Conversions" />

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Unit</th>
                  <th className="px-4 py-3 text-left">Conversion</th>
                  <th className="px-4 py-3 text-left">Secondary Unit</th>
                </tr>
              </thead>

              <tbody>
                {product.unitConversions.map((item, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-3">{item.unit || "-"}</td>
                    <td className="px-4 py-3">{item.conversion || "-"}</td>
                    <td className="px-4 py-3">{item.secondaryUnit || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {product.variantTypes?.length > 0 && (
        <Card className="p-6 bg-white">
          <SectionTitle icon={Tag} title="Variant Configuration" />

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Variant Type</th>
                  <th className="px-4 py-3 text-left">Values</th>
                </tr>
              </thead>

              <tbody>
                {product.variantTypes.map((item, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-3">{item.type || "-"}</td>
                    <td className="px-4 py-3">{item.values || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {product.batches?.length > 0 && (
        <Card className="p-6 bg-white">
          <SectionTitle icon={Barcode} title="Batch & Expiry Details" />

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Batch No</th>
                  <th className="px-4 py-3 text-left">Lot No</th>
                  <th className="px-4 py-3 text-left">MFG Date</th>
                  <th className="px-4 py-3 text-left">Expiry Date</th>
                  <th className="px-4 py-3 text-left">Best Before</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                </tr>
              </thead>

              <tbody>
                {product.batches.map((batch, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-3">{batch.batchNo || "-"}</td>
                    <td className="px-4 py-3">{batch.lotNo || "-"}</td>
                    <td className="px-4 py-3">
                      {batch.manufacturingDate || "-"}
                    </td>
                    <td className="px-4 py-3">{batch.expiryDate || "-"}</td>
                    <td className="px-4 py-3">{batch.bestBefore || "-"}</td>
                    <td className="px-4 py-3">{batch.quantity || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {product.suppliers?.length > 0 && (
        <Card className="p-6 bg-white">
          <SectionTitle icon={Truck} title="Supplier & Procurement" />

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Preferred Vendor</th>
                  <th className="px-4 py-3 text-left">Vendor SKU</th>
                  <th className="px-4 py-3 text-left">Lead Time</th>
                  <th className="px-4 py-3 text-left">Purchase Unit</th>
                </tr>
              </thead>

              <tbody>
                {product.suppliers.map((supplier, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      {supplier.preferredVendor || "-"}
                    </td>
                    <td className="px-4 py-3">{supplier.vendorSku || "-"}</td>
                    <td className="px-4 py-3">{supplier.leadTime || "-"}</td>
                    <td className="px-4 py-3">
                      {supplier.purchaseUnit || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-white">
        <SectionTitle icon={Truck} title="E-Commerce Information" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          <InfoRow label="SEO Title" value={product.seoTitle} />
          <InfoRow label="SEO Keywords" value={product.seoKeywords} />
          <InfoRow label="Meta Description" value={product.metaDescription} />
          <InfoRow label="Slug URL" value={product.slugUrl} />
          <InfoRow label="Weight" value={product.weight || 0} />
          <InfoRow label="Length" value={product.length || 0} />
          <InfoRow label="Width" value={product.width || 0} />
          <InfoRow label="Height" value={product.height || 0} />
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <SectionTitle icon={ShieldCheck} title="Advanced Features" />

        <div className="flex flex-wrap gap-2">
          {features.map(([label, value]) => (
            <Badge key={label} active={Boolean(value)}>
              {label}: {value ? "Yes" : "No"}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProductDetails;
