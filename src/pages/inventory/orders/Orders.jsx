import React, { useState } from "react";
import { Search, Download, ShoppingBag, Eye, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Orders = () => {
  const [search, setSearch] = useState("");

  const orders = [
    {
      id: 1,
      orderId: "ORD-001",
      customer: "Rahul Sharma",
      amount: "₹2,499",
      payment: "Paid",
      date: "21 May 2026",
      status: "Delivered",
    },
    {
      id: 2,
      orderId: "ORD-002",
      customer: "Priya Verma",
      amount: "₹1,299",
      payment: "COD",
      date: "20 May 2026",
      status: "Processing",
    },
    {
      id: 3,
      orderId: "ORD-003",
      customer: "Amit Patel",
      amount: "₹3,999",
      payment: "Paid",
      date: "19 May 2026",
      status: "Shipped",
    },
  ];

  const filteredOrders = orders.filter(
    (item) =>
      item.orderId.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Orders" },
          { label: "All Orders" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage customer orders, payments and delivery status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ShoppingBag size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">1,248</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Delivered</p>
          <h3 className="text-2xl font-bold text-emerald-600">980</h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Pending / Shipped</p>
          <h3 className="text-2xl font-bold text-orange-500">268</h3>
        </Card>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order or customer..."
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Payment</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{item.orderId}</td>
                  <td className="px-4 py-4 text-gray-600">{item.customer}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">{item.amount}</td>
                  <td className="px-4 py-4 text-gray-600">{item.payment}</td>
                  <td className="px-4 py-4 text-gray-600">{item.date}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold bg-emerald-50 text-emerald-600 border-emerald-100">
                      <Truck size={13} />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link to={`/inventory/orders/${item.id}`}>
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

export default Orders;