import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Warehouse } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddWarehouse = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    manager: "",
    capacity: "",
    status: "Active",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Warehouse Data:", formData);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Warehouses", path: "/warehouse/warehouses" },
          { label: "Add Warehouse" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Warehouse</h1>
          <p className="text-gray-500 mt-1">
            Create a new warehouse location for inventory storage.
          </p>
        </div>

        <Button variant="outline">
          <ArrowLeft size={18} />
          Back to Warehouses
        </Button>
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
                Fill warehouse basic and location details.
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
                Location
              </label>
              <input
                name="location"
                value={formData.location}
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
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className={inputClass}
                placeholder="Manager name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Capacity
              </label>
              <input
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={inputClass}
                placeholder="10000 Units"
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
            <Link to="/warehouse/warehouses">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save size={18} />
              Save Warehouse
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddWarehouse;
