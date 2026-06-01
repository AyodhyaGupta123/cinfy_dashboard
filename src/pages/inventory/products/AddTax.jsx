import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Percent } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none";

const AddTax = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    taxType: "",
    taxRate: "",
    calculationType: "taxableAmount",
    description: "",
    applyOn: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      const res = await api.post("/taxes", {
        ...formData,
        taxRate: Number(formData.taxRate),
      });

      if (res.data.success) {
        toast.success("Tax Created", "Tax added successfully.");
        navigate("/inventory/taxes");
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
          { label: "Taxes", path: "/inventory/taxes" },
          { label: "Add Tax" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Add New Tax
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Create a new tax or GST rate.
          </p>
        </div>

        <Link to="/inventory/taxes" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 sm:h-12 sm:w-12">
            <Percent size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Tax Information
            </h2>
            <p className="text-sm text-gray-500">Fill tax details below.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">
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

          <div>
            <label className="text-sm font-medium text-gray-700">
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
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Tax Rate (%) <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 flex">
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
            <label className="text-sm font-medium text-gray-700">
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

          <div>
            <label className="text-sm font-medium text-gray-700">
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
              <option value="shipping">Shipping</option>
            </select>
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

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description <span className="text-gray-400">(Optional)</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={textareaClass}
              placeholder="Enter tax description"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <Link to="/inventory/taxes" className="w-full sm:w-auto">
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
              {loading ? "Saving..." : "Save Tax"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddTax;