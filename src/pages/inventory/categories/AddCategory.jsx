import React from "react";
import { ArrowLeft, Save, FolderTree } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddCategory = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Categories", path: "/inventory/categories" },
          { label: "Add Category" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Category</h1>
          <p className="text-gray-500 mt-1">
            Create a new category for your inventory products.
          </p>
        </div>

        <Link to="/inventory/categories">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <FolderTree size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Category Information
            </h2>
            <p className="text-sm text-gray-500">
              Add category name, status and description.
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Parent Category
            </label>
            <select className={inputClass}>
              <option value="">Select parent category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="grocery">Grocery</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Category Code
            </label>
            <input
              type="text"
              placeholder="CAT-001"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select className={inputClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Write category description..."
              className={textareaClass}
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Link to="/inventory/categories">
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>

            <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white">
              <Save size={18} />
              Save Category
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCategory;