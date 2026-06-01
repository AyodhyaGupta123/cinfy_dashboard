import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Warehouse } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const EditWarehouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
    managerName: "",
    phone: "",
    status: "active",
    address: "",
  });

  const fetchWarehouse = async () => {
    try {
      setFetchLoading(true);

      const res = await api.get(`/warehouses/${id}`);

      if (res.data.success) {
        const warehouse = res.data.warehouse || res.data.data;

        setFormData({
          name: warehouse?.name || "",
          code: warehouse?.code || "",
          city: warehouse?.city || "",
          managerName: warehouse?.managerName || "",
          phone: warehouse?.phone || "",
          status: warehouse?.status || "active",
          address: warehouse?.address || "",
        });
      }
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Failed to load warehouse details."
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Warehouse name is required.");
      return;
    }

    if (!formData.code.trim()) {
      toast.error("Validation Error", "Warehouse code is required.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put(`/warehouses/${id}`, formData);

      if (res.data.success) {
        toast.success("Warehouse Updated", "Warehouse updated successfully.");
        navigate("/inventory/warehouses");
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

  if (fetchLoading) {
    return <div className="p-6 text-gray-500">Loading warehouse...</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Warehouses", path: "/inventory/warehouses" },
          { label: "Edit Warehouse" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Warehouse</h1>
          <p className="text-gray-500 mt-1">
            Update warehouse location, manager, contact, and status details.
          </p>
        </div>

        <Link to="/inventory/warehouses">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Warehouses
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Warehouse size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Warehouse Information
              </h2>
              <p className="text-sm text-gray-500">
                Edit warehouse basic and location details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Warehouse Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Main Warehouse"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Warehouse Code
              </label>
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={inputClass}
                placeholder="WH-001"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="Bhopal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manager Name
              </label>
              <input
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Manager name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="9876543210"
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} h-auto py-3 resize-none`}
                placeholder="Full warehouse address..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/inventory/warehouses">
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
              {loading ? "Updating..." : "Update Warehouse"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditWarehouse;