import React from "react";
import { ArrowLeft, RotateCcw, User } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const ReturnDetails = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Returns", path: "/returns" },
          { label: "Return Details" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Return Details
          </h1>
          <p className="text-gray-500 mt-1">
            Customer return request information.
          </p>
        </div>

        <Link to="/inventory/returns">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <RotateCcw size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              RET-001
            </h2>
            <p className="text-sm text-gray-500">
              Order ID : ORD-001
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Customer Info
            </h3>

            <div className="space-y-2 text-sm text-gray-500">
              <p>Rahul Sharma</p>
              <p>rahul@gmail.com</p>
              <p>+91 9876543210</p>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Return Reason
            </h3>

            <p className="text-sm text-gray-500">
              Product size issue and fitting problem.
            </p>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Return Status</span>

            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-semibold">
              Pending
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReturnDetails;