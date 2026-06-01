import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  ArrowLeft,
  Package,
  IndianRupee,
  Boxes,
  ImagePlus,
  Tag,
  Layers,
  ShieldCheck,
  Truck,
  Barcode,
  Sparkles,
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
} from "lucide-react";
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
  "mt-2 w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const labelClass = "text-xs font-semibold text-gray-700";

const tabs = [
  "Basic Info",
  "Pricing",
  "Inventory",
  "Variants",
  "Batch & Expiry",
  "E-commerce",
  "Suppliers",
  "Other Settings",
];

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="mb-5 flex items-center gap-2">
    <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
      <Icon size={17} />
    </div>
    <h3 className="text-sm font-bold text-gray-900">{title}</h3>
  </div>
);

const AddonButton = ({ path, navigate }) => (
  <button
    type="button"
    onClick={() => navigate(path)}
    className="mt-2 grid h-10 w-11 place-items-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
  >
    <Plus size={16} />
  </button>
);

const Field = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
  addon,
  className = "",
}) => (
  <div className={className}>
    <label className={labelClass}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <div className={addon ? "flex gap-2" : ""}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className={inputClass}
      />
      {addon}
    </div>
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  required,
  addon,
  children,
  className = "",
}) => (
  <div className={className}>
    <label className={labelClass}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <div className={addon ? "flex gap-2" : ""}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
      >
        {children}
      </select>
      {addon}
    </div>
  </div>
);

const Toggle = ({ name, label, checked, onChange }) => (
  <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs font-medium text-gray-700">
    {label}
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 accent-emerald-500"
    />
  </label>
);

const Flag = ({ name, label, checked, onChange }) => (
  <label className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs font-medium text-gray-700">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 accent-emerald-500"
    />
    {label}
  </label>
);

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const [variantTypes, setVariantTypes] = useState([]);
  const [unitConversions, setUnitConversions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    category: "",
    subCategory: "",
    brand: "",
    productType: "Simple Product",
    sku: "",
    barcode: "",
    hsnSacCode: "",
    internalProductCode: "",
    purchasePrice: "",
    sellingPrice: "",
    mrp: "",
    wholesalePrice: "",
    distributorPrice: "",
    tax: "",
    discountType: "Flat",
    discountValue: "",
    openingStock: "",
    currentStock: "",
    minStockLevel: "",
    reorderQuantity: "",
    maximumStock: "",
    warehouseLocation: "",
    enableStockTracking: true,
    allowNegativeStock: false,
    trackBatchNumber: true,
    trackSerialNumber: false,
    enableVariants: false,
    primaryUnit: "Piece",
    enableExpiryTracking: false,
    productDescription: "",
    seoTitle: "",
    seoKeywords: "",
    metaDescription: "",
    slugUrl: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    published: true,
    featuredProduct: false,
    onlineOnly: false,
    returnable: false,
    fragile: false,
    codAvailable: false,
    subscriptionProduct: false,
    perishable: false,
    requiresShipping: false,
    fastMoving: false,
    seasonal: false,
    highMargin: false,
    bestseller: false,
    status: "active",
    visibility: "Visible Everywhere",
  });

  const profitMargin = useMemo(() => {
    const purchase = Number(formData.purchasePrice);
    const selling = Number(formData.sellingPrice);
    if (!purchase || !selling || selling <= purchase) return "0.00";
    return (((selling - purchase) / selling) * 100).toFixed(2);
  }, [formData.purchasePrice, formData.sellingPrice]);

  const expectedMargin = useMemo(() => {
    const mrp = Number(formData.mrp);
    const selling = Number(formData.sellingPrice);
    if (!mrp || !selling || mrp <= selling) return "0.00";
    return (((mrp - selling) / mrp) * 100).toFixed(2);
  }, [formData.mrp, formData.sellingPrice]);

  const variantCombinations = useMemo(() => {
    if (!formData.enableVariants) return [];

    const validTypes = variantTypes
      .filter((item) => item.type && item.values)
      .map((item) => ({
        type: item.type,
        values: item.values
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      }))
      .filter((item) => item.values.length);

    if (!validTypes.length) return [];

    const combine = (arrays) =>
      arrays.reduce(
        (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
        [[]]
      );

    return combine(validTypes.map((item) => item.values)).map(
      (combo, index) => ({
        sku: `${formData.sku || "PRD"}-${combo.join("-")}-${index + 1}`
          .toUpperCase()
          .replace(/\s+/g, "-"),
        values: combo.join(" / "),
        purchasePrice: formData.purchasePrice || "0",
        sellingPrice: formData.sellingPrice || "0",
        stock: "0",
        barcode: "",
      })
    );
  }, [
    formData.enableVariants,
    formData.sku,
    formData.purchasePrice,
    formData.sellingPrice,
    variantTypes,
  ]);

  const getList = (res, keys = []) => {
    for (const key of keys) {
      if (Array.isArray(res?.value?.data?.[key])) return res.value.data[key];
    }
    if (Array.isArray(res?.value?.data?.data)) return res.value.data.data;
    if (Array.isArray(res?.value?.data)) return res.value.data;
    return [];
  };

  const fetchMasters = async () => {
    const [catRes, brandRes, unitRes, warehouseRes, taxRes] =
      await Promise.allSettled([
        api.get("/categories"),
        api.get("/brands"),
        api.get("/units"),
        api.get("/warehouses"),
        api.get("/taxes"),
      ]);

    setCategories(getList(catRes, ["categories"]));
    setBrands(getList(brandRes, ["brands"]));
    setUnits(getList(unitRes, ["units"]));
    setWarehouses(getList(warehouseRes, ["warehouses"]));
    setTaxes(getList(taxRes, ["taxes"]));
  };

  const fetchProduct = async () => {
    try {
      setFetching(true);

      const res = await api.get(`/products/${id}`);

      if (res.data.success) {
        const product = res.data.product || res.data.data;

        setFormData({
          name: product.name || "",
          shortName: product.shortName || "",
          category: product.category || "",
          subCategory: product.subCategory || "",
          brand: product.brand || "",
          productType: product.productType || "Simple Product",
          sku: product.sku || "",
          barcode: product.barcode || "",
          hsnSacCode: product.hsnSacCode || "",
          internalProductCode: product.internalProductCode || "",
          purchasePrice: product.purchasePrice || "",
          sellingPrice: product.sellingPrice || "",
          mrp: product.mrp || "",
          wholesalePrice: product.wholesalePrice || "",
          distributorPrice: product.distributorPrice || "",
          tax: product.tax || "",
          discountType: product.discountType || "Flat",
          discountValue: product.discountValue || "",
          openingStock: product.openingStock || "",
          currentStock: product.currentStock || "",
          minStockLevel: product.minStockLevel || "",
          reorderQuantity: product.reorderQuantity || "",
          maximumStock: product.maximumStock || "",
          warehouseLocation: product.warehouseLocation || "",
          enableStockTracking: product.enableStockTracking ?? true,
          allowNegativeStock: product.allowNegativeStock ?? false,
          trackBatchNumber: product.trackBatchNumber ?? true,
          trackSerialNumber: product.trackSerialNumber ?? false,
          enableVariants: product.enableVariants ?? false,
          primaryUnit: product.primaryUnit || product.unit || "Piece",
          enableExpiryTracking: product.enableExpiryTracking ?? false,
          productDescription:
            product.productDescription || product.description || "",
          seoTitle: product.seoTitle || "",
          seoKeywords: product.seoKeywords || "",
          metaDescription: product.metaDescription || "",
          slugUrl: product.slugUrl || "",
          weight: product.weight || "",
          length: product.length || "",
          width: product.width || "",
          height: product.height || "",
          published: product.published ?? true,
          featuredProduct: product.featuredProduct ?? false,
          onlineOnly: product.onlineOnly ?? false,
          returnable: product.returnable ?? false,
          fragile: product.fragile ?? false,
          codAvailable: product.codAvailable ?? false,
          subscriptionProduct: product.subscriptionProduct ?? false,
          perishable: product.perishable ?? false,
          requiresShipping: product.requiresShipping ?? false,
          fastMoving: product.fastMoving ?? false,
          seasonal: product.seasonal ?? false,
          highMargin: product.highMargin ?? false,
          bestseller: product.bestseller ?? false,
          status: product.status || "active",
          visibility: product.visibility || "Visible Everywhere",
        });

        setVariantTypes(
          product.variantTypes?.length
            ? product.variantTypes
            : [
                { type: "Size", values: "S, M, L, XL" },
                { type: "Color", values: "Red, Blue, Black" },
              ]
        );

        setUnitConversions(
          product.unitConversions?.length
            ? product.unitConversions
            : [
                { unit: "Box", conversion: "12", secondaryUnit: "Pieces" },
                { unit: "Carton", conversion: "24", secondaryUnit: "Boxes" },
              ]
        );

        setBatches(
          product.batches?.length
            ? product.batches
            : [
                {
                  batchNo: "",
                  lotNo: "",
                  manufacturingDate: "",
                  expiryDate: "",
                  bestBefore: "",
                  quantity: "",
                },
              ]
        );

        setSuppliers(
          product.suppliers?.length
            ? product.suppliers
            : [
                {
                  preferredVendor: "",
                  vendorSku: "",
                  leadTime: "",
                  purchaseUnit: "",
                },
              ]
        );

        setPreviewThumbnail(
          product.thumbnail
            ? getImageUrl(product.thumbnail)
            : product.image
            ? getImageUrl(product.image)
            : ""
        );

        setPreviewImages((product.images || []).map((img) => getImageUrl(img)));
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
    fetchMasters();
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", "Please select only image file.");
      return;
    }

    setThumbnail(file);
    setPreviewThumbnail(URL.createObjectURL(file));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      toast.error("Invalid File", "Please select only image files.");
      return;
    }

    setImages(validImages);
    setPreviewImages(validImages.map((file) => URL.createObjectURL(file)));
  };

  const generateSku = () => {
    const category = formData.category || "PRODUCT";
    const name = formData.name || "ITEM";
    const code = `${name.slice(0, 4)}-${category.slice(0, 4)}-${Date.now()
      .toString()
      .slice(-4)}`.toUpperCase();

    setFormData((prev) => ({ ...prev, sku: code }));
  };

  const addVariantType = () => {
    setVariantTypes((prev) => [...prev, { type: "", values: "" }]);
  };

  const removeVariantType = (index) => {
    setVariantTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariantType = (index, key, value) => {
    setVariantTypes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const addUnitConversion = () => {
    setUnitConversions((prev) => [
      ...prev,
      { unit: "", conversion: "", secondaryUnit: "" },
    ]);
  };

  const updateUnitConversion = (index, key, value) => {
    setUnitConversions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const removeUnitConversion = (index) => {
    setUnitConversions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBatch = (index, key, value) => {
    setBatches((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const addBatch = () => {
    setBatches((prev) => [
      ...prev,
      {
        batchNo: "",
        lotNo: "",
        manufacturingDate: "",
        expiryDate: "",
        bestBefore: "",
        quantity: "",
      },
    ]);
  };

  const removeBatch = (index) => {
    setBatches((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSupplier = (index, key, value) => {
    setSuppliers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const addSupplier = () => {
    setSuppliers((prev) => [
      ...prev,
      {
        preferredVendor: "",
        vendorSku: "",
        leadTime: "",
        purchaseUnit: "",
      },
    ]);
  };

  const removeSupplier = (index) => {
    setSuppliers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Product name is required.");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Validation Error", "Product category is required.");
      return;
    }

    if (!formData.sku.trim()) {
      toast.error("Validation Error", "SKU is required.");
      return;
    }

    if (!formData.sellingPrice) {
      toast.error("Validation Error", "Selling price is required.");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      form.append("variantTypes", JSON.stringify(variantTypes));
      form.append("variantCombinations", JSON.stringify(variantCombinations));
      form.append("unitConversions", JSON.stringify(unitConversions));
      form.append("batches", JSON.stringify(batches));
      form.append("suppliers", JSON.stringify(suppliers));

      if (thumbnail) form.append("thumbnail", thumbnail);

      images.forEach((image) => {
        form.append("images", image);
      });

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

  const checkboxProps = (name) => ({
    name,
    checked: Boolean(formData[name]),
    onChange: handleChange,
  });

  const fieldProps = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
  });

  if (fetching) {
    return <div className="p-6 text-gray-500">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-950">Edit Product</h1>

            <Breadcrumb
              items={[
                { label: "Dashboard", path: "/" },
                { label: "Products", path: "/inventory/products" },
                { label: "Edit Product" },
              ]}
            />
          </div>

          <div className="flex items-center gap-3">
            <Link to="/inventory/products">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              form="edit-product-form"
              disabled={loading}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Save size={17} />
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 md:px-6">
        <Card className="mb-5 border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  activeTab === index
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`grid h-5 w-5 place-items-center rounded-lg text-[11px] ${
                    activeTab === index
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </span>
                {tab}
              </button>
            ))}
          </div>
        </Card>

        <form id="edit-product-form" onSubmit={handleSubmit}>
          <div className="mx-auto max-w-7xl space-y-5">
            {activeTab === 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
                  <div className="space-y-5">
                    <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                      <SectionHeader
                        icon={Package}
                        title="Product Information"
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field
                          label="Product Name"
                          required
                          placeholder="Enter product name"
                          {...fieldProps("name")}
                        />

                        <Field
                          label="Product Short Name"
                          placeholder="Enter short name"
                          {...fieldProps("shortName")}
                        />

                        <SelectField
                          label="Product Type"
                          required
                          {...fieldProps("productType")}
                        >
                          <option>Simple Product</option>
                          <option>Variant Product</option>
                          <option>Bundle/Combo</option>
                          <option>Service</option>
                        </SelectField>

                        <SelectField
                          label="Category"
                          required
                          addon={
                            <AddonButton
                              path="/inventory/categories/add"
                              navigate={navigate}
                            />
                          }
                          {...fieldProps("category")}
                        >
                          <option value="">Select category</option>
                          {categories.map((item) => (
                            <option key={item._id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </SelectField>

                        <Field
                          label="Sub Category"
                          placeholder="Select sub category"
                          addon={
                            <AddonButton
                              path="/inventory/categories/add-subcategory"
                              navigate={navigate}
                            />
                          }
                          {...fieldProps("subCategory")}
                        />

                        <SelectField
                          label="Brand"
                          addon={
                            <AddonButton
                              path="/inventory/brands/add"
                              navigate={navigate}
                            />
                          }
                          {...fieldProps("brand")}
                        >
                          <option value="">Select brand</option>
                          {brands.map((item) => (
                            <option key={item._id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </SelectField>

                        <Field
                          label="HSN / SAC Code"
                          placeholder="Enter HSN or SAC code"
                          {...fieldProps("hsnSacCode")}
                        />

                        <Field
                          label="Internal Product Code"
                          placeholder="Enter internal code"
                          {...fieldProps("internalProductCode")}
                        />

                        <Field
                          label="SKU"
                          required
                          placeholder="Auto Generate"
                          addon={
                            <button
                              type="button"
                              onClick={generateSku}
                              className="mt-2 grid h-10 w-11 place-items-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                              <Sparkles size={16} />
                            </button>
                          }
                          {...fieldProps("sku")}
                        />

                        <Field
                          label="Barcode / QR Code"
                          placeholder="Enter barcode"
                          {...fieldProps("barcode")}
                        />

                        <SelectField
                          label="Unit"
                          required
                          addon={
                            <AddonButton
                              path="/inventory/units/add"
                              navigate={navigate}
                            />
                          }
                          {...fieldProps("primaryUnit")}
                        >
                          <option value="">Select unit</option>
                          {units.map((item) => (
                            <option key={item._id} value={item.name}>
                              {item.name}
                              {item.abbreviation
                                ? ` (${item.abbreviation})`
                                : ""}
                            </option>
                          ))}
                        </SelectField>

                        <div>
                          <label className={labelClass}>Product Image</label>
                          <label className="mt-2 flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center transition hover:bg-gray-100">
                            <ImagePlus
                              size={22}
                              className="mb-1 text-gray-500"
                            />
                            <span className="text-xs font-semibold text-gray-600">
                              Change Image
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="mt-5">
                        <label className={labelClass}>Gallery Images</label>
                        <label className="mt-2 flex h-20 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center transition hover:bg-gray-100">
                          <Plus size={22} className="mb-1 text-gray-500" />
                          <span className="text-xs font-semibold text-gray-600">
                            Replace Gallery Images
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {(previewThumbnail || previewImages.length > 0) && (
                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-6">
                          {previewThumbnail && (
                            <img
                              src={previewThumbnail}
                              alt="Thumbnail"
                              className="h-20 w-full rounded-xl border object-cover"
                            />
                          )}

                          {previewImages.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt="Product"
                              className="h-20 w-full rounded-xl border object-cover"
                            />
                          ))}
                        </div>
                      )}

                      <div className="mt-5">
                        <label className={labelClass}>
                          Product Description
                        </label>

                        <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-3 py-2 text-gray-600">
                            <select className="h-8 rounded-lg border border-gray-200 px-2 text-xs outline-none">
                              <option>Paragraph</option>
                              <option>Heading</option>
                            </select>
                            <button type="button" className="rounded-lg p-1 hover:bg-gray-50">
                              <Bold size={15} />
                            </button>
                            <button type="button" className="rounded-lg p-1 hover:bg-gray-50">
                              <Italic size={15} />
                            </button>
                            <button type="button" className="rounded-lg p-1 hover:bg-gray-50">
                              <Underline size={15} />
                            </button>
                            <button type="button" className="rounded-lg p-1 hover:bg-gray-50">
                              <List size={15} />
                            </button>
                            <button type="button" className="rounded-lg p-1 hover:bg-gray-50">
                              <AlignLeft size={15} />
                            </button>
                          </div>

                          <textarea
                            name="productDescription"
                            value={formData.productDescription}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Write product description here..."
                            className="w-full resize-none border-0 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-5">
                    <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                      <SectionHeader
                        icon={IndianRupee}
                        title="Pricing Information"
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field
                          label="Purchase Price"
                          type="number"
                          placeholder="₹ 0.00"
                          {...fieldProps("purchasePrice")}
                        />
                        <Field
                          label="Selling Price"
                          type="number"
                          required
                          placeholder="₹ 0.00"
                          {...fieldProps("sellingPrice")}
                        />
                        <Field
                          label="MRP"
                          type="number"
                          placeholder="₹ 0.00"
                          {...fieldProps("mrp")}
                        />
                        <Field
                          label="Wholesale Price"
                          type="number"
                          placeholder="₹ 0.00"
                          {...fieldProps("wholesalePrice")}
                        />
                        <Field
                          label="Distributor Price"
                          type="number"
                          placeholder="₹ 0.00"
                          {...fieldProps("distributorPrice")}
                        />

                        <SelectField
                          label="Tax (%)"
                          addon={
                            <AddonButton
                              path="/inventory/taxes/add"
                              navigate={navigate}
                            />
                          }
                          {...fieldProps("tax")}
                        >
                          <option value="">Select tax</option>
                          {taxes.map((item) => (
                            <option key={item._id} value={item.taxRate}>
                              {item.name} - {item.taxRate}%
                            </option>
                          ))}
                        </SelectField>

                        <SelectField
                          label="Discount Type"
                          {...fieldProps("discountType")}
                        >
                          <option>Flat</option>
                          <option>Percentage</option>
                        </SelectField>

                        <Field
                          label="Discount Value"
                          type="number"
                          placeholder="0.00"
                          className="md:col-span-1 xl:col-span-2"
                          {...fieldProps("discountValue")}
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-500">
                            Profit Margin
                          </p>
                          <p className="mt-1 text-lg font-bold text-emerald-600">
                            {profitMargin} %
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500">
                            Expected Margin
                          </p>
                          <p className="mt-1 text-lg font-bold text-emerald-600">
                            {expectedMargin} %
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                      <SectionHeader
                        icon={Boxes}
                        title="Quick Inventory Setup"
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field
                          label="Opening Stock"
                          type="number"
                          placeholder="0"
                          {...fieldProps("openingStock")}
                        />
                        <Field
                          label="Current Stock"
                          type="number"
                          placeholder="0"
                          {...fieldProps("currentStock")}
                        />
                        <Field
                          label="Minimum Stock Alert"
                          type="number"
                          placeholder="0"
                          {...fieldProps("minStockLevel")}
                        />
                        <Field
                          label="Reorder Quantity"
                          type="number"
                          placeholder="0"
                          {...fieldProps("reorderQuantity")}
                        />
                        <Field
                          label="Maximum Stock"
                          type="number"
                          placeholder="0"
                          {...fieldProps("maximumStock")}
                        />

                        <SelectField
                          label="Warehouse / Store"
                          addon={
                            <AddonButton
                              path="/inventory/warehouses/add"
                              navigate={navigate}
                            />
                          }
                          {...fieldProps("warehouseLocation")}
                        >
                          <option value="">Select warehouse</option>
                          {warehouses.map((item) => (
                            <option key={item._id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </SelectField>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <Toggle
                          label="Enable Stock Tracking"
                          {...checkboxProps("enableStockTracking")}
                        />
                        <Toggle
                          label="Allow Negative Stock"
                          {...checkboxProps("allowNegativeStock")}
                        />
                        <Toggle
                          label="Track Batch Number"
                          {...checkboxProps("trackBatchNumber")}
                        />
                        <Toggle
                          label="Track Serial Number"
                          {...checkboxProps("trackSerialNumber")}
                        />
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {activeTab === 1 && (
              <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                <SectionHeader icon={IndianRupee} title="Pricing Section" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Purchase Price" type="number" {...fieldProps("purchasePrice")} />
                  <Field label="Selling Price" type="number" {...fieldProps("sellingPrice")} />
                  <Field label="MRP" type="number" {...fieldProps("mrp")} />
                  <Field label="Wholesale Price" type="number" {...fieldProps("wholesalePrice")} />
                  <Field label="Distributor Price" type="number" {...fieldProps("distributorPrice")} />
                  <Field label="Tax %" type="number" {...fieldProps("tax")} />
                  <Field label="Discount Value" type="number" {...fieldProps("discountValue")} />
                  <SelectField label="Discount Type" {...fieldProps("discountType")}>
                    <option>Flat</option>
                    <option>Percentage</option>
                  </SelectField>
                </div>
              </Card>
            )}

            {activeTab === 2 && (
              <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                <SectionHeader icon={Boxes} title="Inventory & Stock" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Opening Stock" {...fieldProps("openingStock")} />
                  <Field label="Current Stock" {...fieldProps("currentStock")} />
                  <Field label="Minimum Stock Alert" {...fieldProps("minStockLevel")} />
                  <Field label="Reorder Quantity" {...fieldProps("reorderQuantity")} />
                  <Field label="Maximum Stock" {...fieldProps("maximumStock")} />
                  <Field label="Warehouse / Store Location" {...fieldProps("warehouseLocation")} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Toggle label="Enable Stock Tracking" {...checkboxProps("enableStockTracking")} />
                  <Toggle label="Allow Negative Stock" {...checkboxProps("allowNegativeStock")} />
                  <Toggle label="Track Batch Number" {...checkboxProps("trackBatchNumber")} />
                  <Toggle label="Track Serial Number" {...checkboxProps("trackSerialNumber")} />
                </div>
              </Card>
            )}

            {activeTab === 3 && (
              <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                <SectionHeader icon={Tag} title="Variant Configuration" />

                <Toggle label="Enable Variants" {...checkboxProps("enableVariants")} />

                <div className="mt-4 space-y-3">
                  {variantTypes.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_2fr_auto]"
                    >
                      <input
                        value={item.type}
                        onChange={(e) =>
                          updateVariantType(index, "type", e.target.value)
                        }
                        placeholder="Variant Type"
                        className={inputClass}
                      />

                      <input
                        value={item.values}
                        onChange={(e) =>
                          updateVariantType(index, "values", e.target.value)
                        }
                        placeholder="Red, Blue, Black"
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() => removeVariantType(index)}
                        className="mt-2 grid h-10 w-10 place-items-center rounded-xl border text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariantType}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={15} />
                    Add Variant Type
                  </button>
                </div>
              </Card>
            )}

            {activeTab === 4 && (
              <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                <SectionHeader icon={Barcode} title="Expiry & Batch Management" />

                <Toggle
                  label="Enable Expiry Tracking"
                  {...checkboxProps("enableExpiryTracking")}
                />

                <div className="mt-4 space-y-4">
                  {batches.map((batch, index) => (
                    <div key={index} className="rounded-xl border border-gray-100 p-3">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {[
                          ["batchNo", "Batch Number"],
                          ["lotNo", "Lot Number"],
                          ["manufacturingDate", "Manufacturing Date"],
                          ["expiryDate", "Expiry Date"],
                          ["bestBefore", "Best Before"],
                          ["quantity", "Quantity"],
                        ].map(([key, label]) => (
                          <div key={key}>
                            <label className={labelClass}>{label}</label>
                            <input
                              type={key.includes("Date") ? "date" : "text"}
                              value={batch[key] || ""}
                              onChange={(e) =>
                                updateBatch(index, key, e.target.value)
                              }
                              className={inputClass}
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeBatch(index)}
                        className="mt-3 text-xs font-semibold text-red-500"
                      >
                        Remove Batch
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addBatch}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={15} />
                    Add Batch
                  </button>
                </div>
              </Card>
            )}

            {activeTab === 5 && (
              <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                <SectionHeader icon={Truck} title="E-Commerce Fields" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="SEO Title" {...fieldProps("seoTitle")} />
                  <Field label="SEO Keywords" {...fieldProps("seoKeywords")} />
                  <Field label="Meta Description" {...fieldProps("metaDescription")} />
                  <Field label="Slug URL" {...fieldProps("slugUrl")} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Field label="Weight" {...fieldProps("weight")} />
                  <Field label="Length" {...fieldProps("length")} />
                  <Field label="Width" {...fieldProps("width")} />
                  <Field label="Height" {...fieldProps("height")} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Toggle label="Published" {...checkboxProps("published")} />
                  <Toggle label="Featured Product" {...checkboxProps("featuredProduct")} />
                  <Toggle label="Online Only" {...checkboxProps("onlineOnly")} />
                </div>
              </Card>
            )}

            {activeTab === 6 && (
              <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                <SectionHeader icon={Truck} title="Supplier & Procurement" />

                <div className="space-y-4">
                  {suppliers.map((supplier, index) => (
                    <div key={index} className="rounded-xl border border-gray-100 p-3">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {[
                          ["preferredVendor", "Preferred Vendor"],
                          ["vendorSku", "Vendor SKU"],
                          ["leadTime", "Lead Time"],
                          ["purchaseUnit", "Purchase Unit"],
                        ].map(([key, label]) => (
                          <div key={key}>
                            <label className={labelClass}>{label}</label>
                            <input
                              value={supplier[key] || ""}
                              onChange={(e) =>
                                updateSupplier(index, key, e.target.value)
                              }
                              placeholder={label}
                              className={inputClass}
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSupplier(index)}
                        className="mt-3 text-xs font-semibold text-red-500"
                      >
                        Remove Supplier
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSupplier}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={15} />
                    Add Supplier
                  </button>
                </div>
              </Card>
            )}

            {activeTab === 7 && (
              <Card className="border border-gray-200 bg-white p-5 shadow-sm">
                <SectionHeader icon={ShieldCheck} title="Advanced Settings" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <SelectField label="Status" {...fieldProps("status")}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </SelectField>

                  <SelectField label="Visibility" {...fieldProps("visibility")}>
                    <option>Visible Everywhere</option>
                    <option>Online Only</option>
                    <option>POS Only</option>
                    <option>Hidden</option>
                  </SelectField>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  <Flag label="Returnable" {...checkboxProps("returnable")} />
                  <Flag label="Fragile" {...checkboxProps("fragile")} />
                  <Flag label="COD Available" {...checkboxProps("codAvailable")} />
                  <Flag label="Subscription Product" {...checkboxProps("subscriptionProduct")} />
                  <Flag label="Perishable" {...checkboxProps("perishable")} />
                  <Flag label="Requires Shipping" {...checkboxProps("requiresShipping")} />
                  <Flag label="Fast Moving" {...checkboxProps("fastMoving")} />
                  <Flag label="Seasonal" {...checkboxProps("seasonal")} />
                  <Flag label="High Margin" {...checkboxProps("highMargin")} />
                  <Flag label="Bestseller" {...checkboxProps("bestseller")} />
                </div>
              </Card>
            )}
          </div>

          <div className="mx-auto mt-5 flex max-w-7xl justify-end gap-3">
            <Link to="/inventory/products">
              <Button variant="outline" type="button">
                <ArrowLeft size={17} />
                Back
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Save size={17} />
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;