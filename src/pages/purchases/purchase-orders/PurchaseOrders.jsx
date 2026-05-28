import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, RefreshCw, Search, ShoppingCart } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const PurchaseOrders = () => {
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/purchases/orders");

      if (res.data.success) {
        setOrders(res.data.purchaseOrders || []);
      }
    } catch (error) {
      console.error("Failed to fetch purchase orders:", error);

      toast.error(
        "Load Failed",
        error.response?.data?.message || "Unable to load purchase orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();

    return orders.filter((order) => {
      const orderNumber = order.orderNumber || "";
      const supplierName = order.supplier?.name || "";

      return (
        orderNumber.toLowerCase().includes(query) ||
        supplierName.toLowerCase().includes(query)
      );
    });
  }, [orders, search]);

  const getStatusVariant = (status) => {
    if (status === "Received") return "success";
    if (status === "Cancelled") return "danger";
    return "warning";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Purchases" },
          { label: "Purchase Orders" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Purchase Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Create, track, and manage purchase orders from suppliers.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchPurchaseOrders}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>

          <Link to="/purchases/orders/create">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus size={18} />
              Create Purchase
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <ShoppingCart size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Purchase Order List
            </h2>
            <p className="text-sm text-gray-500">
              Search and view supplier purchase order records.
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80 my-5">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search order number or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Order No</th>
                <th className="text-left px-4 py-3 font-semibold">Supplier</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Items</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading purchase orders...
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {order.orderNumber || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {order.supplier?.name || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(order.purchaseDate)}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {order.items?.length || 0}
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
                        <button className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-600">
                          <Eye size={17} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && filteredOrders.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <ShoppingCart className="mx-auto mb-3 text-gray-300" size={38} />
              No purchase orders found.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PurchaseOrders;