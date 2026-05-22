import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Download, ArrowLeftRight, Eye } from "lucide-react";
import Card from "../../../../components/UI/Card";
import Button from "../../../../components/UI/Button";
import Breadcrumb from "../../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Transfers = () => {
  const [search, setSearch] = useState("");

  const transfers = [
    {
      id: 1,
      transferNo: "TRF-001",
      product: "Cotton Kurti",
      from: "Main Warehouse",
      to: "Surat Storage",
      quantity: 25,
      date: "21 May 2026",
      status: "Completed",
    },
    {
      id: 2,
      transferNo: "TRF-002",
      product: "Silk Saree",
      from: "Surat Storage",
      to: "Backup Warehouse",
      quantity: 10,
      date: "20 May 2026",
      status: "Pending",
    },
    {
      id: 3,
      transferNo: "TRF-003",
      product: "Designer Dupatta",
      from: "Main Warehouse",
      to: "Indore Store",
      quantity: 40,
      date: "19 May 2026",
      status: "In Transit",
    },
  ];

  const filteredTransfers = transfers.filter((item) =>
    item.transferNo.toLowerCase().includes(search.toLowerCase()) ||
    item.product.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Transfers" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
          <p className="text-gray-500 mt-1">
            Track stock movement between warehouses and locations.
          </p>
        </div>

        <Link to="/inventory/transfers/create">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Create Transfer
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ArrowLeftRight size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transfers</p>
              <h3 className="text-2xl font-bold text-gray-900">248</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Completed</p>
          <h3 className="text-2xl font-bold text-emerald-600">210</h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Pending / Transit</p>
          <h3 className="text-2xl font-bold text-orange-500">38</h3>
        </Card>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transfer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <Button variant="outline">
            <Download size={18} />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Transfer No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">From</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">To</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Qty</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredTransfers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{item.transferNo}</td>
                  <td className="px-4 py-4 text-gray-600">{item.product}</td>
                  <td className="px-4 py-4 text-gray-600">{item.from}</td>
                  <td className="px-4 py-4 text-gray-600">{item.to}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">{item.quantity}</td>
                  <td className="px-4 py-4 text-gray-600">{item.date}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full border text-xs font-semibold bg-emerald-50 text-emerald-600 border-emerald-100">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                      <Eye size={16} className="mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Transfers;