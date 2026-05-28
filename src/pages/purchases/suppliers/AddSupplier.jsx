import React, { useState } from "react";
import { ArrowLeft, Save, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddSupplier = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    gst: "",
    city: "",
    address: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(
        "Validation Error",
        "Supplier name is required."
      );
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error(
        "Validation Error",
        "Phone number is required."
      );
      return false;
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      toast.error(
        "Validation Error",
        "Please enter a valid email address."
      );
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      gst: "",
      city: "",
      address: "",
      status: "active",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        gst: formData.gst,
        city: formData.city,
        address: formData.address,
        status: formData.status,
      };

      const res = await api.post(
        "/purchases/suppliers",
        payload
      );

      if (res.data.success) {
        toast.success(
          "Supplier Created",
          "Supplier added successfully."
        );

        resetForm();

        navigate("/purchases/suppliers");
      }
    } catch (error) {
      console.error("Create supplier failed:", error);

      toast.error(
        "Create Failed",
        error.response?.data?.message ||
          "Something went wrong."
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
          {
            label: "Suppliers",
            path: "/purchases/suppliers",
          },
          { label: "Add Supplier" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Supplier
          </h1>

          <p className="text-gray-500 mt-1">
            Create a new supplier profile for purchase
            management.
          </p>
        </div>

        <Link to="/purchases/suppliers">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Suppliers
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Truck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Supplier Information
              </h2>

              <p className="text-sm text-gray-500">
                Fill supplier contact, company, GST,
                and address details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              [
                "name",
                "Supplier Name",
                "Enter supplier name",
              ],
              [
                "company",
                "Company Name",
                "Enter company name",
              ],
              [
                "email",
                "Email Address",
                "supplier@example.com",
              ],
              [
                "phone",
                "Phone Number",
                "9876543210",
              ],
              [
                "gst",
                "GST Number",
                "23ABCDE1234F1Z5",
              ],
              ["city", "City", "Enter city"],
            ].map(([name, label, placeholder]) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {label}
                </label>

                <input
                  type={
                    name === "email" ? "email" : "text"
                  }
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}

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
                <option value="active">Active</option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>

              <textarea
                name="address"
                placeholder="Enter supplier full address..."
                value={formData.address}
                onChange={handleChange}
                rows={5}
                className={`${inputClass} h-auto py-3 resize-none`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/purchases/suppliers">
              <Button
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save size={18} />

              {loading
                ? "Saving Supplier..."
                : "Save Supplier"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSupplier;