import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  Package,
  Warehouse,
  FileText,
} from "lucide-react";

import Card from "../../../../components/UI/Card";
import Button from "../../../../components/UI/Button";
import Breadcrumb from "../../../../components/UI/Breadcrumb";
import { useToast } from "../../../../components/UI/Toast";

import api from "../../../../services/api";

const TransferDetails = () => {
  const { id } = useParams();

  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [transfer, setTransfer] = useState(null);

  const fetchTransfer = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/transfers/${id}`);

      if (res.data.success) {
        setTransfer(res.data.transfer);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load transfer details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfer();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (status === "cancelled") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-orange-50 text-orange-600 border-orange-100";
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading transfer details...
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="p-6 text-red-500">
        Transfer not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Transfers", path: "/inventory/transfers" },
          { label: "Transfer Details" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Transfer Details
          </h1>

          <p className="text-gray-500 mt-1">
            View complete transfer information.
          </p>
        </div>

        <Link to="/inventory/transfers">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ArrowLeftRight size={26} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {transfer.transferNumber}
              </h2>

              <p className="text-sm text-gray-500">
                Created on {formatDate(transfer.createdAt)}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex px-4 py-2 rounded-full border text-sm font-semibold capitalize ${getStatusClass(
              transfer.status
            )}`}
          >
            {transfer.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <div className="border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Package size={20} className="text-emerald-500" />

              <h3 className="text-lg font-semibold text-gray-900">
                Product Information
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Product Name</p>
                <h4 className="font-semibold text-gray-900">
                  {transfer.product?.name || "-"}
                </h4>
              </div>

              <div>
                <p className="text-gray-500">SKU</p>
                <h4 className="font-semibold text-gray-900">
                  {transfer.product?.sku || "-"}
                </h4>
              </div>

              <div>
                <p className="text-gray-500">Quantity</p>
                <h4 className="font-semibold text-gray-900">
                  {transfer.quantity || 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Warehouse size={20} className="text-emerald-500" />

              <h3 className="text-lg font-semibold text-gray-900">
                Warehouse Information
              </h3>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">From Warehouse</p>

                <h4 className="font-semibold text-gray-900">
                  {transfer.fromWarehouse?.name || "-"}
                </h4>

                <p className="text-gray-400">
                  {transfer.fromWarehouse?.code || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">To Warehouse</p>

                <h4 className="font-semibold text-gray-900">
                  {transfer.toWarehouse?.name || "-"}
                </h4>

                <p className="text-gray-400">
                  {transfer.toWarehouse?.code || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-emerald-500" />

              <h3 className="text-lg font-semibold text-gray-900">
                Notes
              </h3>
            </div>

            <p className="text-gray-600 leading-7">
              {transfer.notes || "No notes added."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransferDetails;