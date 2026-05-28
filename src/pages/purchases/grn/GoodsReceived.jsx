import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Eye,
  PackageCheck,
  RefreshCw,
  Search,
} from "lucide-react";
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

  const [search, setSearch] = useState("");
  const [grnList, setGrnList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [receiveLoadingId, setReceiveLoadingId] = useState(null);

  const fetchGoodsReceived = async () => {
    try {
      setLoading(true);

      const res = await api.get("/purchases/grn");

      if (res.data.success) {
        setGrnList(res.data.grns || []);
      }
    } catch (error) {
      console.error("Failed to fetch GRN records:", error);

      toast.error(
        "Load Failed",
        error.response?.data?.message || "Unable to load GRN records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoodsReceived();
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

  const handleReceive = async (item) => {
    try {
      setReceiveLoadingId(item._id);

      const payload = {
        purchaseOrder: item.purchaseOrder?._id || item.purchaseOrder,
        supplier: item.supplier?._id || item.supplier,
        receivedDate: new Date().toISOString(),
        status: "Received",
        remarks: "Goods received successfully.",
      };

      const res = await api.post("/purchases/grn", payload);

      if (res.data.success) {
        toast.success("Goods Received", "GRN created successfully.");
        fetchGoodsReceived();
      }
    } catch (error) {
      console.error("Receive failed:", error);

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
                        {purchaseOrder.items?.length || 0}
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status || "Received"}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-600">
                            <Eye size={17} />
                          </button>

                          <Button
                            type="button"
                            onClick={() => handleReceive(item)}
                            disabled={receiveLoadingId === item._id}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            <CheckCircle size={16} />
                            {receiveLoadingId === item._id
                              ? "Receiving..."
                              : "Receive"}
                          </Button>
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
    </div>
  );
};

export default GoodsReceived;