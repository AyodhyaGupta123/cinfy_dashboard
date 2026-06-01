import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Percent } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none";

const EditTax = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    taxType: "",
    taxRate: "",
    calculationType: "taxableAmount",
    description: "",
    applyOn: "",
    status: "active",
  });

  const fetchTax = async () => {
    try {
      setPageLoading(true);

      const res = await api.get(`/taxes/${id}`);

      if (res.data.success) {
        const tax = res.data.data;

        setFormData({
          name: tax.name || "",
          taxType: tax.taxType || "",
          taxRate: tax.taxRate || "",
          calculationType: tax.calculationType || "taxableAmount",
          description: tax.description || "",
          applyOn: tax.applyOn || "",
          status: tax.status || "active",
        });
      }
    } catch (error) {
      toast.error(
        "Fetch Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTax();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "active" : "inactive") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Tax name is required.");
      return;
    }

    if (!formData.taxType.trim()) {
      toast.error("Validation Error", "Tax type is required.");
      return;
    }

    if (!formData.taxRate) {
      toast.error("Validation Error", "Tax rate is required.");
      return;
    }

    if (!formData.applyOn.trim()) {
      toast.error("Validation Error", "Apply on is required.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put(`/taxes/${id}`, {
        ...formData,
        taxRate: Number(formData.taxRate),
      });

      if (res.data.success) {
        toast.success("Tax Updated", "Tax updated successfully.");
        navigate("/inventory/taxes");
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

  if (pageLoading) {
    return (
      <Card className="p-6 bg-white">
        <p className="text-gray-500">Loading tax details...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Taxes", path: "/inventory/taxes" },
          { label: "Edit Tax" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Tax</h1>
          <p className="text-gray-500 mt-1">Update tax or GST rate.</p>
        </div>

        <Link to="/inventory/taxes">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Taxes
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Percent size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Tax</h2>
              <p className="text-sm text-gray-500">
                Modify inventory tax information.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tax Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter tax name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tax Type <span className="text-red-500">*</span>
              </label>
              <select
                name="taxType"
                value={formData.taxType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select tax type</option>
                <option value="GST">GST</option>
                <option value="VAT">VAT</option>
                <option value="Sales Tax">Sales Tax</option>
                <option value="Service Tax">Service Tax</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tax Rate (%) <span className="text-red-500">*</span>
              </label>

              <div className="flex">
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  className="w-full h-11 rounded-l-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter tax rate"
                />
                <span className="flex h-11 items-center justify-center rounded-r-xl border border-l-0 border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-gray-600">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Calculation Type <span className="text-red-500">*</span>
              </label>
              <select
                name="calculationType"
                value={formData.calculationType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="taxableAmount">On Taxable Amount</option>
                <option value="inclusive">Inclusive Tax</option>
                <option value="exclusive">Exclusive Tax</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={textareaClass}
                placeholder="Enter tax description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apply On <span className="text-red-500">*</span>
              </label>
              <select
                name="applyOn"
                value={formData.applyOn}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select apply on</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="shipping">Shipping</option>
                <option value="order">Order</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>

              <label className="flex h-11 items-center gap-3">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status === "active"}
                  onChange={handleChange}
                  className="h-5 w-5 accent-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/inventory/taxes">
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
              {loading ? "Updating..." : "Update Tax"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditTax;