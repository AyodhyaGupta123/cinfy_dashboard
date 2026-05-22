import React from "react";
import { ArrowLeft, Save, PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddStockIn = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Stock In", path: "/inventory/stock-in" },
          { label: "Add Stock In" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Stock In
          </h1>
          <p className="text-gray-500 mt-1">
            Add incoming stock into inventory.
          </p>
        </div>

        <Link to="/inventory/stock-in">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <PackagePlus size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock In Details
            </h2>
            <p className="text-sm text-gray-500">
              Enter stock receiving information.
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product
            </label>

            <select className={inputClass}>
              <option>Select product</option>
              <option>Cotton Kurti</option>
              <option>Silk Saree</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Supplier
            </label>

            <select className={inputClass}>
              <option>Select supplier</option>
              <option>Raj Textile</option>
              <option>Surat Fabrics</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>

            <input
              type="number"
              placeholder="Enter quantity"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Price
            </label>

            <input
              type="number"
              placeholder="Enter purchase price"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Date
            </label>

            <input type="date" className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>

            <select className={inputClass}>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <Link to="/inventory/stock-in">
              <Button variant="outline">Cancel</Button>
            </Link>

            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Save size={18} />
              Save Stock In
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddStockIn;