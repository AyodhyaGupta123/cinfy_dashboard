import React from "react";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  PackageCheck,
  Printer,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import StatCard from "../../../components/UI/StatCard";

const purchase = {
  id: "PO-1001",
  supplier: "Sharma Traders",
  email: "sharma@example.com",
  phone: "9876543210",
  date: "2026-05-27",
  expectedDate: "2026-05-30",
  status: "Pending",
  notes: "Please deliver all items before the expected date.",
  items: [
    { name: "Laptop Stand", sku: "LS-001", qty: 10, rate: 850 },
    { name: "Wireless Mouse", sku: "WM-002", qty: 20, rate: 450 },
    { name: "Keyboard", sku: "KB-003", qty: 15, rate: 700 },
  ],
};

const PurchaseDetails = () => {
  const { id } = useParams();

  const subTotal = purchase.items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0
  );

  const gst = subTotal * 0.18;
  const grandTotal = subTotal + gst;

  const statusVariant =
    purchase.status === "Received"
      ? "success"
      : purchase.status === "Cancelled"
      ? "danger"
      : "warning";

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Purchases" },
          { label: "Purchase Orders", path: "/purchases/orders" },
          { label: id || purchase.id },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Purchase Details
          </h1>
          <p className="text-gray-500 mt-1">
            View complete purchase order summary, supplier details, and item
            information.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/purchases/orders">
            <Button variant="outline">
              <ArrowLeft size={18} />
              Back to Orders
            </Button>
          </Link>

          <Button variant="outline">
            <Printer size={18} />
            Print
          </Button>

          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Grand Total"
          value={`₹${grandTotal.toLocaleString()}`}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Items"
          value={purchase.items.length}
          icon={PackageCheck}
        />
        <StatCard title="Expected Date" value={purchase.expectedDate} icon={CalendarDays} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 bg-white lg:col-span-2">
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <ShoppingCart size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Purchase Information
                </h2>
                <p className="text-sm text-gray-500">
                  Basic purchase order and supplier details.
                </p>
              </div>
            </div>

            <Badge variant={statusVariant}>{purchase.status}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 text-sm">
            <Info label="Purchase Order No" value={id || purchase.id} />
            <Info label="Supplier Name" value={purchase.supplier} />
            <Info label="Purchase Date" value={purchase.date} />
            <Info label="Expected Delivery Date" value={purchase.expectedDate} />
            <Info label="Supplier Email" value={purchase.email} />
            <Info label="Supplier Phone" value={purchase.phone} />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Notes</p>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-6">
              {purchase.notes}
            </p>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <PackageCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Amount Summary
              </h2>
              <p className="text-sm text-gray-500">
                Subtotal, GST, and final amount.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm mt-5">
            <SummaryRow label="Subtotal" value={subTotal} />
            <SummaryRow label="GST 18%" value={gst} />

            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <PackageCheck size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">Purchase Items</h2>
            <p className="text-sm text-gray-500">
              Product-wise quantity, rate, and amount details.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 mt-5">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Product</th>
                <th className="text-left px-4 py-3 font-semibold">SKU</th>
                <th className="text-left px-4 py-3 font-semibold">Qty</th>
                <th className="text-left px-4 py-3 font-semibold">Rate</th>
                <th className="text-right px-4 py-3 font-semibold">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {purchase.items.map((item) => (
                <tr key={item.sku} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{item.sku}</td>
                  <td className="px-4 py-4 text-gray-600">{item.qty}</td>
                  <td className="px-4 py-4 text-gray-600">₹{item.rate}</td>
                  <td className="px-4 py-4 text-right font-semibold text-gray-900">
                    ₹{(item.qty * item.rate).toLocaleString()}
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

const Info = ({ label, value }) => (
  <div className="rounded-xl bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 font-semibold text-gray-900 break-words">{value}</p>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between text-gray-600">
    <span>{label}</span>
    <span className="font-semibold">₹{Number(value).toLocaleString()}</span>
  </div>
);

export default PurchaseDetails;