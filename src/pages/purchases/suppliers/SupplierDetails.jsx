import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import StatCard from "../../../components/UI/StatCard";
import api from "../../../services/api";

const SupplierDetails = () => {
  const { id } = useParams();

  const [supplier, setSupplier] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSupplierDetails = async () => {
    try {
      setLoading(true);

      const supplierRes = await api.get(`/purchases/suppliers/${id}`);
      const ordersRes = await api.get("/purchases/orders");

      if (supplierRes.data.success) {
        setSupplier(supplierRes.data.supplier);
      }

      if (ordersRes.data.success) {
        const orders = ordersRes.data.purchaseOrders || [];
        const supplierOrders = orders.filter(
          (order) => order.supplier?._id === id || order.supplier === id
        );

        setPurchaseOrders(supplierOrders);
      }
    } catch (error) {
      console.error("Failed to fetch supplier details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierDetails();
  }, [id]);

  const totalPurchase = useMemo(() => {
    return purchaseOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );
  }, [purchaseOrders]);

  const pendingAmount = useMemo(() => {
    return purchaseOrders
      .filter((order) => order.status === "Pending")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  }, [purchaseOrders]);

  const getStatusVariant = (status) => {
    if (status === "Received" || status === "active" || status === "Active") {
      return "success";
    }

    if (status === "Cancelled" || status === "inactive" || status === "Inactive") {
      return "danger";
    }

    return "warning";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading supplier details...
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="p-6 text-gray-500">
        Supplier not found.
      </div>
    );
  }

  const supplierStatus = supplier.status || "inactive";

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Purchases" },
          { label: "Suppliers", path: "/purchases/suppliers" },
          { label: supplier.name || "Supplier Details" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Supplier Details
          </h1>
          <p className="text-gray-500 mt-1">
            View supplier profile, business information, and purchase history.
          </p>
        </div>

        <Link to="/purchases/suppliers">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Suppliers
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Truck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Supplier Profile
              </h2>
              <p className="text-sm text-gray-500">
                Primary supplier contact details.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center py-6">
            <div className="h-20 w-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              {(supplier.name || "S").charAt(0).toUpperCase()}
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              {supplier.name || "N/A"}
            </h2>

            <p className="text-sm text-gray-500">
              {supplier.company || "No company name"}
            </p>

            <div className="mt-3">
              <Badge variant={getStatusVariant(supplierStatus)}>
                {supplierStatus}
              </Badge>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <Contact icon={Mail} value={supplier.email || "N/A"} />
            <Contact icon={Phone} value={supplier.phone || "N/A"} />
            <Contact icon={MapPin} value={supplier.address || "N/A"} />
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Total Purchase"
              value={`₹${totalPurchase.toLocaleString("en-IN")}`}
              icon={ShoppingCart}
            />
            <StatCard
              title="Pending Amount"
              value={`₹${pendingAmount.toLocaleString("en-IN")}`}
              icon={Truck}
            />
            <StatCard
              title="Total Orders"
              value={purchaseOrders.length}
              icon={Building2}
            />
          </div>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Business Information
                </h2>
                <p className="text-sm text-gray-500">
                  Company, GST, city, and communication details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 text-sm">
              <Info label="Supplier ID" value={supplier._id || id} />
              <Info label="Supplier Name" value={supplier.name || "N/A"} />
              <Info label="Company Name" value={supplier.company || "N/A"} />
              <Info label="Email Address" value={supplier.email || "N/A"} />
              <Info label="Phone Number" value={supplier.phone || "N/A"} />
              <Info label="GST Number" value={supplier.gst || "N/A"} />
              <Info label="City" value={supplier.city || "N/A"} />
              <Info label="Status" value={supplierStatus} />
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <ShoppingCart size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Purchase History
            </h2>
            <p className="text-sm text-gray-500">
              Previous purchase orders created for this supplier.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 mt-5">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Order No</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {purchaseOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {order.orderNumber || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {formatDate(order.purchaseDate)}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status || "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link to={`/purchases/orders/${order._id}`}>
                      <button className="font-semibold text-emerald-600 hover:text-emerald-700">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {purchaseOrders.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No purchase history found.
            </div>
          )}
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

const Contact = ({ icon: Icon, value }) => (
  <div className="flex items-start gap-3 text-gray-600">
    <Icon size={18} className="mt-0.5 text-emerald-500 shrink-0" />
    <span className="break-words">{value}</span>
  </div>
);

export default SupplierDetails;