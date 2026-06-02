import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Truck,
  Building2,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none";

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className={inputClass}
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-700">
      {label}
    </label>

    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      placeholder={placeholder || label}
      className={textareaClass}
    />
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5 flex items-center gap-4 border-b border-gray-100 pb-5">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
      <Icon size={22} />
    </div>

    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    alternatePhone: "",
    gst: "",
    pan: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
    openingBalance: "",
    creditLimit: "",
    paymentTerms: "30 Days",
    notes: "",
    status: "active",
  });

  const fetchSupplier = async () => {
    try {
      setPageLoading(true);

      const res = await api.get(`/purchases/suppliers/${id}`);

      if (res.data.success) {
        const supplier = res.data.supplier || {};

        setFormData({
          name: supplier.name || "",
          company: supplier.company || "",
          contactPerson: supplier.contactPerson || supplier.contact || "",
          email: supplier.email || "",
          phone: supplier.phone || "",
          alternatePhone: supplier.alternatePhone || supplier.altPhone || "",
          gst: supplier.gst || supplier.gstNumber || "",
          pan: supplier.pan || supplier.panNumber || "",
          city: supplier.city || "",
          state: supplier.state || "",
          pincode: supplier.pincode || supplier.pinCode || "",
          address: supplier.address || "",
          openingBalance: supplier.openingBalance ?? supplier.balance ?? "",
          creditLimit: supplier.creditLimit ?? "",
          paymentTerms: supplier.paymentTerms || "30 Days",
          notes: supplier.notes || supplier.description || "",
          status: supplier.status || "active",
        });
      }
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Unable to load supplier."
      );
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Validation Error", "Supplier name is required.");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Validation Error", "Phone number is required.");
      return false;
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      toast.error("Validation Error", "Please enter a valid email address.");
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
        ...formData,
        openingBalance: Number(formData.openingBalance || 0),
        creditLimit: Number(formData.creditLimit || 0),
      };

      const res = await api.put(`/purchases/suppliers/${id}`, payload);

      if (res.data.success) {
        toast.success("Supplier Updated", "Supplier updated successfully.");
        navigate(`/purchases/suppliers/${id}`);
      }
    } catch (error) {
      toast.error(
        "Update Failed",
        error.response?.data?.message || "Unable to update supplier."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading supplier...</div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Purchases" },
          { label: "Suppliers", path: "/purchases/suppliers" },
          { label: "Edit Supplier" },
        ]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Supplier</h1>
          <p className="mt-1 text-gray-500">
            Update supplier details for purchases, GRN, and inventory
            procurement.
          </p>
        </div>

        <Link to="/purchases/suppliers">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Suppliers
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-white p-5">
          <SectionTitle
            icon={Truck}
            title="Basic Information"
            subtitle="Primary supplier and contact details."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Supplier Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Field
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />

            <Field
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
            />

            <Field
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Field
              label="Alternate Phone"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
            />

            <Field
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </Card>

        <Card className="bg-white p-5">
          <SectionTitle
            icon={Building2}
            title="Business Information"
            subtitle="GST, PAN, and business identity details."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="GST Number"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
            />

            <Field
              label="PAN Number"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
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
          </div>
        </Card>

        <Card className="bg-white p-5">
          <SectionTitle
            icon={MapPin}
            title="Address Information"
            subtitle="Supplier billing and shipping location."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />

            <Field
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />

            <Field
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />

            <div className="md:col-span-3">
              <TextareaField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter supplier full address..."
              />
            </div>
          </div>
        </Card>

        <Card className="bg-white p-5">
          <SectionTitle
            icon={CreditCard}
            title="Financial Information"
            subtitle="Opening balance, credit limit, and payment terms."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field
              label="Opening Balance"
              name="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={handleChange}
            />

            <Field
              label="Credit Limit"
              name="creditLimit"
              type="number"
              value={formData.creditLimit}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Payment Terms
              </label>

              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Immediate">Immediate</option>
                <option value="7 Days">7 Days</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="45 Days">45 Days</option>
                <option value="60 Days">60 Days</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-5">
          <SectionTitle
            icon={FileText}
            title="Additional Information"
            subtitle="Internal notes and supplier remarks."
          />

          <TextareaField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter additional notes..."
          />
        </Card>

        <div className="flex flex-col justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
          <Link to={`/purchases/suppliers/${id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <Save size={18} />
            {loading ? "Updating Supplier..." : "Update Supplier"}
          </Button>
        </div>
      </form>
    </div>
  );
};  

export default EditSupplier;