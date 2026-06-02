import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Eye,
  PackageCheck,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass = 
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const GoodsReceived = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [grnList, setGrnList] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [receiveLoadingId, setReceiveLoadingId] = useState(null);

  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [receiveForm, setReceiveForm] = useState({
    receivedBy: "",
    warehouse: "",
    remarks: "Goods received successfully.",
  });

  const fetchGoodsReceived = async () => {
    try {
      setLoading(true);

      const [grnRes, orderRes] = await Promise.all([
        api.get("/purchases/grn"),
        api.get("/purchases/orders"),
      ]);

      const grns = grnRes.data.grns || [];
      const orders = orderRes.data.purchaseOrders || [];

      const pendingOrders = orders
        .filter((order) => order.status === "Pending")
        .map((order) => ({
          _id: order._id,
          grnNumber: "",
          purchaseOrder: order,
          supplier: order.supplier,
          receivedDate: "",
          status: "Pending",
          isPendingOrder: true,
        }));

      setGrnList([...pendingOrders, ...grns]);
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Unable to load GRN records."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await api.get("/warehouses");
      setWarehouses(res.data.warehouses || res.data.data || res.data || []);
    } catch (error) {
      toast.error(
        "Warehouse Load Failed",
        error.response?.data?.message || "Unable to load warehouses."
      );
    }
  };

  useEffect(() => {
    fetchGoodsReceived();
    fetchWarehouses();
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return grnList.filter((item) => {
      const grnNo = item.grnNumber || item._id || "";
      const poNo = item.purchaseOrder?.orderNumber || "";
      const supplierName = item.supplier?.name || "";

      return (
        grnNo.toLowerCase().includes(query) ||
        poNo.toLowerCase().includes(query) ||
        supplierName.toLowerCase().includes(query)
      );
    });
  }, [grnList, search]);

  const getStatusVariant = (status) => {
    if (status === "Received") return "success";
    if (status === "Partial") return "warning";
    return "warning";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const openReceiveModal = (item) => {
    setSelectedOrder(item);
    setReceiveForm({
      receivedBy: "",
      warehouse: "",
      remarks: "Goods received successfully.",
    });
    setShowReceiveModal(true);
  };

  const closeReceiveModal = () => {
    setShowReceiveModal(false);
    setSelectedOrder(null);
  };

  const handleReceiveFormChange = (e) => {
    const { name, value } = e.target;

    setReceiveForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReceive = async () => {
    if (!selectedOrder) return;

    if (!receiveForm.receivedBy.trim()) {
      toast.error("Validation Error", "Received By is required.");
      return;
    }

    if (!receiveForm.warehouse) {
      toast.error("Validation Error", "Warehouse is required.");
      return;
    }

    try {
      setReceiveLoadingId(selectedOrder._id);

      const payload = {
        purchaseOrder:
          selectedOrder.purchaseOrder?._id || selectedOrder.purchaseOrder,
        supplier: selectedOrder.supplier?._id || selectedOrder.supplier,
        receivedDate: new Date().toISOString(),
        receivedBy: receiveForm.receivedBy,
        warehouse: receiveForm.warehouse,
        remarks: receiveForm.remarks,
        status: "Received",
        items:
          selectedOrder.purchaseOrder?.items?.map((row) => ({
            product: row.product?._id || row.product,
            orderedQty: row.quantity,
            receivedQty: row.quantity,
            rejectedQty: 0,
            remarks: "",
          })) || [],
      };

      const res = await api.post("/purchases/grn", payload);

      if (res.data.success) {
        toast.success("Goods Received", "GRN created successfully.");
        closeReceiveModal();
        fetchGoodsReceived();
      }
    } catch (error) {
      toast.error(
        "Receive Failed",
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setReceiveLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Purchases" },
          { label: "Goods Received" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Goods Received Note
          </h1>
          <p className="text-gray-500 mt-1">
            Track received goods against purchase orders and supplier delivery.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={fetchGoodsReceived}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <PackageCheck size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">GRN Records</h2>
            <p className="text-sm text-gray-500">
              View received, partial received, and pending goods records.
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
            placeholder="Search GRN, PO, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">GRN No</th>
                <th className="text-left px-4 py-3 font-semibold">PO No</th>
                <th className="text-left px-4 py-3 font-semibold">Supplier</th>
                <th className="text-left px-4 py-3 font-semibold">
                  Received Date
                </th>
                <th className="text-left px-4 py-3 font-semibold">Items</th>
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
                    Loading GRN records...
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const purchaseOrder = item.purchaseOrder || {};
                  const supplier = item.supplier || {};
                  const grnNo = item.grnNumber || item._id;

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {grnNo || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {purchaseOrder.orderNumber || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {supplier.name || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(item.receivedDate)}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {purchaseOrder.items?.length || item.items?.length || 0}
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status === "Pending" ? "Pending" : "Received"}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                item.isPendingOrder
                                  ? `/purchases/orders/${
                                      item.purchaseOrder?._id || item._id
                                    }`
                                  : `/purchases/grn/${item._id}`
                              )
                            }
                            className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-600"
                          >
                            <Eye size={17} />
                          </button>

                          {item.status === "Pending" && (
                            <Button
                              type="button"
                              onClick={() => openReceiveModal(item)}
                              disabled={receiveLoadingId === item._id}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              <CheckCircle size={16} />
                              {receiveLoadingId === item._id
                                ? "Receiving..."
                                : "Receive"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <PackageCheck className="mx-auto mb-3 text-gray-300" size={38} />
              No GRN records found.
            </div>
          )}
        </div>
      </Card>

      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Receive Goods
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Confirm receiving details for this purchase order.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReceiveModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Received By <span className="text-red-500">*</span>
                </label>

                <input
                  name="receivedBy"
                  value={receiveForm.receivedBy}
                  onChange={handleReceiveFormChange}
                  placeholder="Enter receiver name"
                  className={`${inputClass} mt-2`}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Warehouse <span className="text-red-500">*</span>
                </label>

                <select
                  name="warehouse"
                  value={receiveForm.warehouse}
                  onChange={handleReceiveFormChange}
                  className={`${inputClass} mt-2`}
                >
                  <option value="">Select Warehouse</option>

                  {warehouses.map((warehouse) => (
                    <option key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={receiveForm.remarks}
                  onChange={handleReceiveFormChange}
                  rows={4}
                  placeholder="Enter remarks"
                  className={`${inputClass} mt-2 h-auto resize-none py-3`}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={closeReceiveModal}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleReceive}
                disabled={receiveLoadingId === selectedOrder?._id}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <CheckCircle size={16} />
                {receiveLoadingId === selectedOrder?._id
                  ? "Receiving..."
                  : "Confirm Receive"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodsReceived;