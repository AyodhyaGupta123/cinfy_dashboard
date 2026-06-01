import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  ClipboardList,
  Package,
  PackageMinus,
  Warehouse,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/orders/${id}`);

      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message ||
          "Failed to load issue order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const totalQty = useMemo(() => {
    return (
      order?.items?.reduce(
        (sum, item) =>
          sum +
          Number(
            item.quantity || item.qty || 0
          ),
        0
      ) || 0
    );
  }, [order]);

  const getStatusClass = (status = "") => {
    const value = status.toLowerCase();

    if (
      ["issued", "completed"].includes(value)
    ) {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (
      ["draft", "pending", "approved"].includes(value)
    ) {
      return "bg-orange-50 text-orange-600 border-orange-100";
    }

    if (value === "cancelled") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-gray-50 text-gray-600 border-gray-100";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-gray-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          {
            label: "Dashboard",
            path: "/",
          },
          {
            label: "Issue Orders",
            path: "/inventory/orders",
          },
          {
            label: "Issue Order Details",
          },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Issue Order Details
          </h1>

          <p className="text-gray-500 mt-1">
            Complete stock issue order
            information and item movement
            details.
          </p>
        </div>

        <Link to="/inventory/orders">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 bg-white lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <PackageMinus size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {order.orderNumber ||
                    order.issueOrderNumber ||
                    "N/A"}
                </h2>

                <p className="text-sm text-gray-500">
                  Issue Date:{" "}
                  {formatDate(
                    order.issueDate ||
                      order.createdAt
                  )}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusClass(
                order.status ||
                  order.orderStatus
              )}`}
            >
              {order.status ||
                order.orderStatus ||
                "Pending"}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Issued Items
            </h3>

            <div className="space-y-4">
              {(order.items || []).map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center">
                        <Package size={18} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {typeof item.product ===
                          "string"
                            ? item.product
                            : item.product
                                ?.name ||
                              item.productName ||
                              "N/A"}
                        </h3>

                        <p className="text-sm text-gray-500">
                          SKU:{" "}
                          {typeof item.product ===
                          "object"
                            ? item.product?.sku ||
                              item.sku ||
                              "N/A"
                            : item.sku ||
                              "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-emerald-600">
                        Qty:{" "}
                        {item.quantity ||
                          item.qty ||
                          0}
                      </p>

                      <p className="text-xs text-gray-500">
                        Unit:{" "}
                        {item.unit || "pcs"}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Building2
                size={20}
                className="text-emerald-500"
              />

              <h3 className="font-bold text-gray-900">
                Issue Information
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow
                label="Department / Client"
                value={
                  order.department ||
                  order.clientName ||
                  "N/A"
                }
              />

              <InfoRow
                label="Purpose"
                value={
                  order.purpose || "N/A"
                }
              />

              <InfoRow
                label="Requested By"
                value={
                  order.requestedBy ||
                  order.createdBy?.name ||
                  "N/A"
                }
              />
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Warehouse
                size={20}
                className="text-emerald-500"
              />

              <h3 className="font-bold text-gray-900">
                Warehouse Details
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow
                label="Warehouse"
                value={
                  order.warehouse?.name ||
                  order.warehouseName ||
                  "N/A"
                }
              />

              <InfoRow
                label="Issued By"
                value={
                  order.issuedBy ||
                  order.createdBy?.name ||
                  "N/A"
                }
              />

              <InfoRow
                label="Total Issued Qty"
                value={totalQty}
              />
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList
                size={20}
                className="text-emerald-500"
              />

              <h3 className="font-bold text-gray-900">
                Status Summary
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow
                label="Current Status"
                value={
                  order.status ||
                  order.orderStatus ||
                  "Pending"
                }
              />

              <InfoRow
                label="Issue Date"
                value={formatDate(
                  order.issueDate ||
                    order.createdAt
                )}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}) => (
  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2 last:border-b-0">
    <span className="text-gray-500">
      {label}
    </span>

    <span className="font-semibold text-gray-900 text-right break-words">
      {value}
    </span>
  </div>
);

export default OrderDetails;