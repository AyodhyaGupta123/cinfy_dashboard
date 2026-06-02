import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Save, ShoppingCart, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const CreatePurchase = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    supplier: "",
    date: "",
    expectedDate: "",
    notes: "",
  });

  const [items, setItems] = useState([
    {
      product: "",
      quantity: 1,
      rate: 0,
    },
  ]);

  const fetchSuppliers = async () => {
    try {
      setSupplierLoading(true);
      const res = await api.get("/purchases/suppliers");

      if (res.data.success) {
        setSuppliers(res.data.suppliers || []);
      }
    } catch (error) {
      toast.error(
        "Supplier Load Failed",
        error.response?.data?.message || "Unable to load suppliers."
      );
    } finally {
      setSupplierLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      const res = await api.get("/products");

      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (error) {
      toast.error(
        "Product Load Failed",
        error.response?.data?.message || "Unable to load products."
      );
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const totalAmount = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0) * Number(item.rate || 0),
      0
    );
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.supplier) {
      toast.error("Validation Error", "Please select supplier.");
      return false;
    }

    if (!formData.date) {
      toast.error("Validation Error", "Purchase date is required.");
      return false;
    }

    const hasInvalidItem = items.some(
      (item) =>
        !item.product ||
        Number(item.quantity) <= 0 ||
        Number(item.rate) <= 0
    );

    if (hasInvalidItem) {
      toast.error(
        "Validation Error",
        "Please select product and enter valid quantity and rate."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        supplier: formData.supplier,
        purchaseDate: formData.date,
        expectedDate: formData.expectedDate || null,
        notes: formData.notes,
        subtotal: totalAmount,
        gstAmount: 0,
        totalAmount,
        items: items.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          amount: Number(item.quantity) * Number(item.rate),
        })),
      };

      const res = await api.post("/purchases/orders", payload);

      if (res.data.success) {
        toast.success(
          "Purchase Created",
          "Purchase order created successfully."
        );

        navigate("/purchases/orders");
      }
    } catch (error) {
      toast.error(
        "Create Failed",
        error.response?.data?.message || "Something went wrong."
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
          { label: "Purchases" },
          { label: "Purchase Orders", path: "/purchases/orders" },
          { label: "Create Purchase" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Purchase Order
          </h1>
          <p className="text-gray-500 mt-1">
            Add supplier, product, quantity, and rate details.
          </p>
        </div>

        <Link to="/purchases/orders">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Orders
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ShoppingCart size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Purchase Information
              </h2>
              <p className="text-sm text-gray-500">
                Fill supplier and purchase order basic details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Supplier <span className="text-red-500">*</span>
              </label>

              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className={inputClass}
                disabled={supplierLoading}
              >
                <option value="">
                  {supplierLoading ? "Loading suppliers..." : "Select supplier"}
                </option>

                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purchase Date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Date
              </label>

              <input
                type="date"
                name="expectedDate"
                value={formData.expectedDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Purchase Items
                </h2>
                <p className="text-sm text-gray-500">
                  Select product, quantity, rate, and amount.
                </p>
              </div>

              <Button
                type="button"
                onClick={addItem}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus size={18} />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const amount =
                  Number(item.quantity || 0) * Number(item.rate || 0);

                return (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl"
                  >
                    <div className="md:col-span-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product <span className="text-red-500">*</span>
                      </label>

                      <select
                        value={item.product}
                        onChange={(e) =>
                          handleItemChange(index, "product", e.target.value)
                        }
                        className={inputClass}
                        disabled={productLoading}
                      >
                        <option value="">
                          {productLoading
                            ? "Loading products..."
                            : "Select product"}
                        </option>

                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name} - SKU: {product.sku}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rate
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount
                      </label>

                      <div className="h-11 flex items-center px-4 rounded-xl bg-white border border-gray-200 font-semibold text-gray-900">
                        ₹{amount.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="h-11 w-11 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full md:w-80 bg-emerald-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-emerald-700">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>

            <textarea
              name="notes"
              placeholder="Write purchase notes..."
              value={formData.notes}
              onChange={handleChange}
              rows={5}
              className={`${inputClass} h-auto py-3 resize-none`}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/purchases/orders">
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
              {loading ? "Saving Purchase..." : "Save Purchase"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePurchase;