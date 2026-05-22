import React from "react";
import { ArrowLeft, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const RefundDetails = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Refunds", path: "/refunds" },
          { label: "Refund Details" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Refund Details
          </h1>

          <p className="text-gray-500 mt-1">
            Refund payment and processing details.
          </p>
        </div>

        <Link to="/inventory/refunds">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <IndianRupee size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              REF-001
            </h2>

            <p className="text-sm text-gray-500">
              Order ID : ORD-001
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium text-gray-900">
                Rahul Sharma
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Refund Amount</span>
              <span className="font-bold text-emerald-600">
                ₹2,499
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-900">
                UPI
              </span>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Refund Date</span>
              <span className="font-medium text-gray-900">
                21 May 2026
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-medium text-gray-900">
                TXN987654
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold">
                Processed
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RefundDetails;