import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Tags } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddBrand = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Active",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Brand Data:", formData);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Brands", path: "/inventory/brands" },
          { label: "Add Brand" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Brand</h1>
          <p className="text-gray-500 mt-1">
            Create a new brand for your inventory products.
          </p>
        </div>

        <Link to="/inventory/brands">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Brands
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Tags size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Brand Information
              </h2>
              <p className="text-sm text-gray-500">
                Fill brand name, code and status details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter brand name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand Code
              </label>
              <input
                type="text"
                name="code"
                placeholder="BRD-001"
                value={formData.code}
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Write brand description..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`${inputClass} h-auto py-3 resize-none`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/inventory/brands">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Save size={18} />
              Save Brand
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddBrand;