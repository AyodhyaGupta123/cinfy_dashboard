import React, { useState } from "react";
import { Search, Download, RotateCcw, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Returns = () => {
  const [search, setSearch] = useState("");

  const returns = [
    {
      id: 1,
      returnId: "RET-001",
      orderId: "ORD-001",
      customer: "Rahul Sharma",
      reason: "Size issue",
      date: "21 May 2026",
      status: "Approved",
    },
    {
      id: 2,
      returnId: "RET-002",
      orderId: "ORD-008",
      customer: "Priya Verma",
      reason: "Damaged item",
      date: "20 May 2026",
      status: "Pending",
    },
    {
      id: 3,
      returnId: "RET-003",
      orderId: "ORD-014",
      customer: "Amit Patel",
      reason: "Wrong product",
      date: "19 May 2026",
      status: "Rejected",
    },
  ];

  const filteredReturns = returns.filter(
    (item) =>
      item.returnId.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Orders" },
          { label: "Returns" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Returns</h1>
        <p className="text-gray-500 mt-1">
          Review return requests and manage returned products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <RotateCcw size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Returns</p>
              <h3 className="text-2xl font-bold text-gray-900">86</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Approved</p>
          <h3 className="text-2xl font-bold text-emerald-600">58</h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Pending</p>
          <h3 className="text-2xl font-bold text-orange-500">28</h3>
        </Card>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search return..."
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Return ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Reason</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredReturns.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{item.returnId}</td>
                  <td className="px-4 py-4 text-gray-600">{item.orderId}</td>
                  <td className="px-4 py-4 text-gray-600">{item.customer}</td>
                  <td className="px-4 py-4 text-gray-600">{item.reason}</td>
                  <td className="px-4 py-4 text-gray-600">{item.date}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full border text-xs font-semibold bg-orange-50 text-orange-600 border-orange-100">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link to={`/inventory/returns/${item.id}`}>
                      <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Eye size={16} className="mx-auto" />
                      </button>
                    </Link>
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

export default Returns;