import React, { useEffect, useMemo, useState } from "react";
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
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const PurchaseDetails = () => {
  const { id } = useParams();
  const toast = useToast();

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPurchaseDetails = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/purchases/orders/${id}`);

      if (res.data.success) {
        setPurchase(res.data.purchaseOrder);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message ||
          "Failed to load purchase order details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseDetails();
  }, [id]);

  const subTotal = useMemo(() => {
    return (
      purchase?.items?.reduce((sum, item) => {
        const qty = Number(item.quantity || item.qty || 0);
        const rate = Number(item.rate || item.price || 0);

        return sum + qty * rate;
      }, 0) || 0
    );
  }, [purchase]);

  const gst = useMemo(() => {
    return Number(purchase?.tax || 0);
  }, [purchase]);

  const grandTotal = useMemo(() => {
    return Number(purchase?.grandTotal || 0) || subTotal + gst;
  }, [purchase, subTotal, gst]);

  const getStatusVariant = (status = "") => {
    const value = status.toLowerCase();

    if (["received", "completed"].includes(value)) {
      return "success";
    }

    if (["cancelled", "rejected"].includes(value)) {
      return "danger";
    }

    return "warning";
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const exportPurchase = () => {
    if (!purchase) return;

    const rows = [
      ["Product", "SKU", "Quantity", "Rate", "Amount"],
      ...(purchase.items || []).map((item) => {
        const qty = Number(item.quantity || item.qty || 0);
        const rate = Number(item.rate || item.price || 0);

        return [
          item.productName || item.product?.name || item.name || "",
          item.sku || item.product?.sku || "",
          qty,
          rate,
          qty * rate,
        ];
      }),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${purchase.purchaseOrderNumber || "purchase-order"}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading purchase details...</div>;
  }

  if (!purchase) {
    return <div className="p-6 text-gray-500">Purchase order not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Purchases" },
          {
            label: "Purchase Orders",
            path: "/purchases/orders",
          },
          {
            label: purchase.purchaseOrderNumber || purchase.orderNumber || id,
          },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Details</h1>

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

          <Button variant="outline" onClick={() => window.print()}>
            <Printer size={18} />
            Print
          </Button>

          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={exportPurchase}
          >
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Grand Total"
          value={formatCurrency(grandTotal)}
          icon={ShoppingCart}
        />

        <StatCard
          title="Total Items"
          value={purchase.items?.length || 0}
          icon={PackageCheck}
        />

        <StatCard
          title="Expected Date"
          value={formatDate(purchase.expectedDate)}
          icon={CalendarDays}
        />
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

            <Badge
              variant={getStatusVariant(
                purchase.status || purchase.purchaseStatus,
              )}
            >
              {purchase.status || purchase.purchaseStatus || "Pending"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 text-sm">
            <Info
              label="Purchase Order No"
              value={
                purchase.purchaseOrderNumber || purchase.orderNumber || "N/A"
              }
            />

            <Info
              label="Supplier Name"
              value={purchase.supplier?.name || purchase.supplierName || "N/A"}
            />

            <Info
              label="Purchase Date"
              value={formatDate(purchase.purchaseDate)}
            />

            <Info
              label="Expected Delivery Date"
              value={formatDate(purchase.expectedDate)}
            />

            <Info
              label="Supplier Email"
              value={purchase.supplier?.email || purchase.email || "N/A"}
            />

            <Info
              label="Supplier Phone"
              value={purchase.supplier?.phone || purchase.phone || "N/A"}
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Notes</p>

            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-6">
              {purchase.notes || "No notes added."}
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

            <SummaryRow label="GST" value={gst} />

            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900">
              <span>Grand Total</span>
              <span>{formatCurrency(grandTotal)}</span>
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
              {(purchase.items || []).map((item, index) => {
                const qty = Number(item.quantity || item.qty || 0);

                const rate = Number(item.rate || item.price || 0);

                return (
                  <tr key={item._id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {item.productName || typeof item.product === "string"
                        ? item.product
                        : item.product?.name ||
                          item.productName ||
                          item.name ||
                          "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {item.product?.sku || item.sku || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">{qty}</td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatCurrency(rate)}
                    </td>

                    <td className="px-4 py-4 text-right font-semibold text-gray-900">
                      {formatCurrency(qty * rate)}
                    </td>
                  </tr>
                );
              })}

              {(!purchase.items || purchase.items.length === 0) && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No purchase items found.
                  </td>
                </tr>
              )}
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

    <span className="font-semibold">
      ₹{Number(value || 0).toLocaleString("en-IN")}
    </span>
  </div>
);

export default PurchaseDetails;
