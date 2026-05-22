import React from "react";
import { ArrowLeft, Save, PackageMinus } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100";

const AddStockOut = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Stock Out", path: "/inventory/stock-out" },
          { label: "Add Stock Out" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Stock Out
          </h1>
          <p className="text-gray-500 mt-1">
            Remove outgoing stock from inventory.
          </p>
        </div>

        <Link to="/inventory/stock-out">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <PackageMinus size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Out Details
            </h2>
            <p className="text-sm text-gray-500">
              Enter stock outgoing information.
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
              Reason
            </label>

            <select className={inputClass}>
              <option>Sales Order</option>
              <option>Damaged</option>
              <option>Manual Issue</option>
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
            <Link to="/inventory/stock-out">
              <Button variant="outline">Cancel</Button>
            </Link>

            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Save size={18} />
              Save Stock Out
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddStockOut;