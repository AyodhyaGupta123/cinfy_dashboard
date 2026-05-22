import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, ArrowLeftRight } from "lucide-react";
import Card from "../../../../components/UI/Card";
import Button from "../../../../components/UI/Button";
import Breadcrumb from "../../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const CreateTransfer = () => {
  const [formData, setFormData] = useState({
    transferNo: "",
    product: "",
    fromWarehouse: "",
    toWarehouse: "",
    quantity: "",
    date: "",
    status: "Pending",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Transfer Data:", formData);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Transfers", path: "/warehouse/transfers" },
          { label: "Create Transfer" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Transfer</h1>
          <p className="text-gray-500 mt-1">
            Move stock from one warehouse to another warehouse.
          </p>
        </div>

          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Transfers
          </Button>
      </div>

      <Card className="p-5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ArrowLeftRight size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Transfer Information</h2>
              <p className="text-sm text-gray-500">Fill warehouse transfer details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transfer No</label>
              <input name="transferNo" value={formData.transferNo} onChange={handleChange} className={inputClass} placeholder="TRF-001" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
              <select name="product" value={formData.product} onChange={handleChange} className={inputClass}>
                <option value="">Select product</option>
                <option value="Cotton Kurti">Cotton Kurti</option>
                <option value="Silk Saree">Silk Saree</option>
                <option value="Designer Dupatta">Designer Dupatta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From Warehouse</label>
              <select name="fromWarehouse" value={formData.fromWarehouse} onChange={handleChange} className={inputClass}>
                <option value="">Select warehouse</option>
                <option value="Main Warehouse">Main Warehouse</option>
                <option value="Surat Storage">Surat Storage</option>
                <option value="Backup Warehouse">Backup Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To Warehouse</label>
              <select name="toWarehouse" value={formData.toWarehouse} onChange={handleChange} className={inputClass}>
                <option value="">Select warehouse</option>
                <option value="Main Warehouse">Main Warehouse</option>
                <option value="Surat Storage">Surat Storage</option>
                <option value="Backup Warehouse">Backup Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={inputClass} placeholder="Enter quantity" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transfer Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} h-auto py-3 resize-none`}
                placeholder="Transfer notes..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/warehouse/transfers">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>

            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Save size={18} />
              Create Transfer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateTransfer;