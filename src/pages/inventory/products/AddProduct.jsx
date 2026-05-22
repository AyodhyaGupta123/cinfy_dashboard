import React from "react";
import { Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddProduct = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Add Product" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
          <p className="text-gray-500 mt-1">
            Create a new product for your inventory.
          </p>
        </div>

        <Link to="/inventory/products">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input type="text" placeholder="Enter product name" className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">SKU</label>
            <input type="text" placeholder="PRD-001" className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select className={inputClass}>
              <option>Select category</option>
              <option>Fashion</option>
              <option>Electronics</option>
              <option>Grocery</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <select className={inputClass}>
              <option>Select brand</option>
              <option>Kat Forever</option>
              <option>Generic</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Price
            </label>
            <input type="number" placeholder="0" className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Selling Price
            </label>
            <input type="number" placeholder="0" className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Opening Stock
            </label>
            <input type="number" placeholder="0" className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Low Stock Alert
            </label>
            <input type="number" placeholder="10" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Write product description..."
              className={textareaClass}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <Link to="/inventory/products">
              <Button variant="outline">Cancel</Button>
            </Link>

            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Save size={18} />
              Save Product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;