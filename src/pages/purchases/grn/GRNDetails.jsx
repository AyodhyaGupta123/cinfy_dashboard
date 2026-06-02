import React, { useEffect, useState } from "react";
import { ArrowLeft, PackageCheck, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const GRNDetails = () => {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [grn, setGrn] = useState(null);

  const fetchGRN = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/purchases/grn/${id}`);

      if (res.data.success) {
        setGrn(res.data.grn);
      }
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Unable to load GRN details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGRN();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading GRN...</div>;
  }

  if (!grn) {
    return <div className="py-10 text-center text-gray-500">GRN not found.</div>;
  }

  const purchaseOrder = grn.purchaseOrder || {};
  const supplier = grn.supplier || {};

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Purchases" },
          { label: "Goods Received", path: "/purchases/grn" },
          { label: "GRN Details" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GRN Details</h1>
          <p className="text-gray-500 mt-1">
            View goods received note and received item details.
          </p>
        </div>

        <Link to="/purchases/grn">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <PackageCheck size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {grn.grnNumber || grn._id}
            </h2>
            <p className="text-sm text-gray-500">
              Goods Received Note information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          <Info label="PO Number" value={purchaseOrder.orderNumber || "N/A"} />
          <Info label="Supplier" value={supplier.name || "N/A"} />
          <Info label="Received Date" value={formatDate(grn.receivedDate)} />
          <Info label="Received By" value={grn.receivedBy || "N/A"} />
          <Info label="Warehouse" value={grn.warehouse || "N/A"} />

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="mt-1">
              <Badge variant={grn.status === "Received" ? "success" : "warning"}>
                {grn.status || "Received"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-white">
        <div className="flex items-center gap-3 mb-5">
          <ShoppingCart size={22} className="text-emerald-500" />
          <h2 className="text-lg font-bold text-gray-900">Received Items</h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Product</th>
                <th className="text-left px-4 py-3 font-semibold">SKU</th>
                <th className="text-left px-4 py-3 font-semibold">Ordered</th>
                <th className="text-left px-4 py-3 font-semibold">Received</th>
                <th className="text-left px-4 py-3 font-semibold">Rejected</th>
                <th className="text-left px-4 py-3 font-semibold">Current Stock</th>
                <th className="text-left px-4 py-3 font-semibold">Remarks</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {(grn.items || []).map((item, index) => {
                const product = item.product || {};

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {product.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {product.sku || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.orderedQty || 0}
                    </td>
                    <td className="px-4 py-4 text-emerald-600 font-semibold">
                      {item.receivedQty || 0}
                    </td>
                    <td className="px-4 py-4 text-red-500">
                      {item.rejectedQty || 0}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {product.currentStock ?? "N/A"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.remarks || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {(!grn.items || grn.items.length === 0) && (
            <div className="py-10 text-center text-gray-500">
              No received items found.
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 bg-white">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Remarks</h2>
        <p className="text-gray-600">{grn.remarks || "No remarks added."}</p>
      </Card>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-semibold text-gray-900">{value}</p>
  </div>
);

export default GRNDetails;