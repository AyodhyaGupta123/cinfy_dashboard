import React from "react";
import {
  ArrowLeft,
  Building2,
  ClipboardList,
  Package,
  RotateCcw,
  Warehouse,
} from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const ReturnDetails = () => {
  const stockReturn = {
    returnNumber: "RET-001",
    issueOrderNo: "IO-001",
    department: "Production Department",
    warehouse: "Main Warehouse",
    returnedBy: "Vishal Gupta",
    receivedBy: "Admin",
    returnDate: "21 May 2026",
    reason: "Unused material returned back to warehouse.",
    status: "Pending",
    items: [
      {
        name: "Cotton Fabric Roll",
        sku: "FAB-001",
        qty: 5,
        unit: "meter",
      },
      {
        name: "Packing Box",
        sku: "BOX-002",
        qty: 10,
        unit: "pcs",
      },
    ],
  };

  const totalQty = stockReturn.items.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const getStatusClass = (status = "") => {
    const value = status.toLowerCase();

    if (["approved", "received", "completed"].includes(value)) {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (["rejected", "cancelled"].includes(value)) {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-orange-50 text-orange-600 border-orange-100";
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Stock Returns", path: "/inventory/returns" },
          { label: "Return Details" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Stock Return Details
          </h1>
          <p className="text-gray-500 mt-1">
            Returned stock information from department, client, or issue order.
          </p>
        </div>

        <Link to="/inventory/returns">
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
              <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <RotateCcw size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {stockReturn.returnNumber}
                </h2>
                <p className="text-sm text-gray-500">
                  Issue Order: {stockReturn.issueOrderNo}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                stockReturn.status
              )}`}
            >
              {stockReturn.status}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Returned Items
            </h3>

            <div className="space-y-4">
              {stockReturn.items.map((item, index) => (
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
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        SKU: {item.sku}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-orange-600">
                      Return Qty: {item.qty}
                    </p>
                    <p className="text-xs text-gray-500">
                      Unit: {item.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Building2 size={20} className="text-orange-500" />
              <h3 className="font-bold text-gray-900">
                Return Information
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow
                label="Department / Client"
                value={stockReturn.department}
              />
              <InfoRow label="Return Reason" value={stockReturn.reason} />
              <InfoRow label="Returned By" value={stockReturn.returnedBy} />
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Warehouse size={20} className="text-orange-500" />
              <h3 className="font-bold text-gray-900">
                Warehouse Details
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow label="Warehouse" value={stockReturn.warehouse} />
              <InfoRow label="Received By" value={stockReturn.receivedBy} />
              <InfoRow label="Total Return Qty" value={totalQty} />
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList size={20} className="text-orange-500" />
              <h3 className="font-bold text-gray-900">
                Status Summary
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow label="Current Status" value={stockReturn.status} />
              <InfoRow label="Return Date" value={stockReturn.returnDate} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2 last:border-b-0">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-900 text-right break-words">
      {value}
    </span>
  </div>
);

export default ReturnDetails;