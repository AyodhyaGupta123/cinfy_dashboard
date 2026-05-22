import React from "react";
import { ArrowLeft, Save, FolderPen } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const EditCategory = () => {
  const { id } = useParams();

  const category = {
    name: "Fashion",
    parentCategory: "",
    code: "CAT-001",
    status: "active",
    description: "Fashion products category.",
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Categories", path: "/inventory/categories" },
          { label: "Edit Category" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-500 mt-1">
            Update category details. Category ID: {id}
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
            <FolderPen size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Category Information
            </h2>
            <p className="text-sm text-gray-500">
              Edit category name, parent category, code and status.
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
              defaultValue={category.name}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Parent Category
            </label>
            <select
              defaultValue={category.parentCategory}
              className={inputClass}
            >
              <option value="">No parent category</option>
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
              defaultValue={category.code}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select defaultValue={category.status} className={inputClass}>
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
              defaultValue={category.description}
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
              Update Category
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditCategory;