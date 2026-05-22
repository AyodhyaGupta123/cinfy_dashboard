import React from "react";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const OrderDetails = () => {
  const order = {
    orderId: "ORD-001",
    customer: "Rahul Sharma",
    phone: "+91 9876543210",
    email: "rahul@gmail.com",
    address: "Bhopal, Madhya Pradesh",
    payment: "Paid",
    amount: "₹2,499",
    status: "Delivered",
    date: "21 May 2026",
    products: [
      {
        name: "Cotton Kurti",
        qty: 2,
        price: "₹999",
      },
      {
        name: "Designer Dupatta",
        qty: 1,
        price: "₹499",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Orders", path: "/orders" },
          { label: "Order Details" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order Details
          </h1>
          <p className="text-gray-500 mt-1">
            Complete order information and tracking.
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
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Package size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {order.orderId}
              </h2>
              <p className="text-sm text-gray-500">
                Order Date : {order.date}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {order.products.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-gray-100 rounded-xl p-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Quantity : {item.qty}
                  </p>
                </div>

                <h4 className="font-bold text-emerald-600">
                  {item.price}
                </h4>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-emerald-500" />
              <h3 className="font-bold text-gray-900">
                Customer Info
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-gray-900 font-medium">
                {order.customer}
              </p>

              <p className="text-gray-500">{order.phone}</p>

              <p className="text-gray-500">{order.email}</p>

              <p className="text-gray-500">{order.address}</p>
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payment</span>
                <span className="font-semibold text-emerald-600">
                  {order.payment}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-emerald-600">
                  {order.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-gray-900">
                  {order.amount}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;