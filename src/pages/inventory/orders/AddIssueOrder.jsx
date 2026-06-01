import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2, PackageMinus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddIssueOrder = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [formData, setFormData] = useState({
    department: "",
    warehouse: "",
    issueDate: "",
    purpose: "",
    status: "pending",
    notes: "",
  });

  const [items, setItems] = useState([
    {
      product: "",
      quantity: 1,
    },
  ]);

  const fetchData = async () => {
    try {
      const [productsRes, warehousesRes] = await Promise.all([
        api.get("/products"),
        api.get("/warehouses"),
      ]);

      if (productsRes.data.success) {
        setProducts(productsRes.data.products || productsRes.data.data || []);
      }

      if (warehousesRes.data.success) {
        setWarehouses(
          warehousesRes.data.warehouses || warehousesRes.data.data || []
        );
      }
    } catch {
      toast.error("Load Failed", "Products or warehouses failed to load.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalQty = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [items]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setItems(updated);
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product: "",
        quantity: 1,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;

    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.department.trim()) {
      toast.error("Validation Error", "Department / Client is required.");
      return false;
    }

    if (!formData.warehouse) {
      toast.error("Validation Error", "Warehouse is required.");
      return false;
    }

    const invalidItem = items.some(
      (item) => !item.product || Number(item.quantity) <= 0
    );

    if (invalidItem) {
      toast.error("Validation Error", "Please select product and quantity.");
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
        department: formData.department,
        warehouse: formData.warehouse,
        issueDate: formData.issueDate || new Date(),
        purpose: formData.purpose,
        status: formData.status,
        notes: formData.notes,
        items: items.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
        })),
      };

      const res = await api.post("/orders", payload);

      if (res.data.success) {
        toast.success("Issue Order Created", "Stock issue order saved.");
        navigate("/inventory/orders");
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
          { label: "Orders" },
          { label: "Issue Orders", path: "/inventory/orders" },
          { label: "Add Issue Order" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Issue Order
          </h1>
          <p className="text-gray-500 mt-1">
            Issue stock from warehouse to department, client, or internal team.
          </p>
        </div>

        <Link to="/inventory/orders">
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
              <PackageMinus size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Issue Information
              </h2>
              <p className="text-sm text-gray-500">
                Fill department, warehouse, status, and issue purpose.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department / Client
              </label>
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={inputClass}
                placeholder="Production Department"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Warehouse
              </label>
              <select
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name || warehouse.warehouseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="issued">Issued</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purpose
              </label>
              <input
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className={inputClass}
                placeholder="Material issue for production work"
              />
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Issue Items
                </h2>
                <p className="text-sm text-gray-500">
                  Select products and issue quantity.
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
                const selectedProduct = products.find(
                  (product) => product._id === item.product
                );

                return (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gray-50 p-4 rounded-xl items-end"
                  >
                    <div className="md:col-span-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product
                      </label>
                      <select
                        value={item.product}
                        onChange={(e) =>
                          handleItemChange(index, "product", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="">Select product</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name} - Stock:{" "}
                            {product.currentStock || product.stock || 0}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3">
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
                        Available
                      </label>
                      <div className="h-11 flex items-center px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold">
                        {selectedProduct?.currentStock ||
                          selectedProduct?.stock ||
                          0}
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

            <div className="mt-5 flex justify-end">
              <div className="w-full md:w-80 rounded-xl bg-emerald-50 p-4 flex justify-between">
                <span className="font-semibold text-gray-700">
                  Total Issue Qty
                </span>
                <span className="text-xl font-bold text-emerald-700">
                  {totalQty}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} h-auto py-3 resize-none`}
              placeholder="Write notes..."
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/inventory/orders">
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
              {loading ? "Saving..." : "Save Issue Order"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddIssueOrder;