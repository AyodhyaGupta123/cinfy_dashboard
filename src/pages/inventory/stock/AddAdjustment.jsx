import React from "react";
import { ArrowLeft, Save, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const AddAdjustment = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          {
            label: "Stock Adjustments",
            path: "/inventory/stock-adjustments",
          },
          { label: "Add Adjustment" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Adjustment</h1>
          <p className="text-gray-500 mt-1">
            Create manual stock correction for damaged, lost, or extra stock.
          </p>
        </div>

        <Link to="/inventory/stock-adjustments">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <SlidersHorizontal size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Adjustment Details
            </h2>
            <p className="text-sm text-gray-500">
              Select product, adjustment type, quantity and reason.
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product
            </label>
            <select className={inputClass}>
              <option value="">Select product</option>
              <option value="cotton-kurti">Cotton Kurti</option>
              <option value="silk-saree">Silk Saree</option>
              <option value="designer-dupatta">Designer Dupatta</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Adjustment Type
            </label>
            <select className={inputClass}>
              <option value="">Select adjustment type</option>
              <option value="increase">Increase Stock</option>
              <option value="decrease">Decrease Stock</option>
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
              Adjustment Date
            </label>
            <input type="date" className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Reason
            </label>
            <select className={inputClass}>
              <option value="">Select reason</option>
              <option value="opening-correction">Opening Correction</option>
              <option value="damaged-stock">Damaged Stock</option>
              <option value="lost-item">Lost Item</option>
              <option value="manual-correction">Manual Correction</option>
              <option value="extra-stock-found">Extra Stock Found</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Approval Status
            </label>
            <select className={inputClass}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              rows="4"
              placeholder="Write adjustment notes..."
              className={textareaClass}
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Link to="/inventory/stock-adjustments">
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>

            <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white">
              <Save size={18} />
              Save Adjustment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddAdjustment;